import { closeModal, openModal } from 'actions/ui'
import { TPropType } from 'declarations/types.pt'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { T } from 'declarations/types'
import { useDispatch } from 'react-redux'

export interface SessionMonitorProps {
  checkInterval?: number;
  expirationTime?: Date;
  millisecondsForWarning?: number;
  sessionExpiredReload?: number;
  now?: Date;
  t: T
}

const SessionMonitor: React.FC<SessionMonitorProps> = ({
  /* check every minute */
  checkInterval = 1000 * 60,
  /* When session will expire */
  expirationTime,
  /* Warnings should start under 5 minutes */
  millisecondsForWarning = 5 * 1000 * 60,
  /* Reload under a minute */
  sessionExpiredReload = 1000,
  now,
  t
}: SessionMonitorProps): JSX.Element => {
  const [mounted, setMounted] = useState<boolean>(false)

  const dispatch = useDispatch()
  useEffect(() => {
    const checkTimeout = () => {
      if (!expirationTime) {
        return
      }
      setTimeout(() => {
        const _now: Date = now || new Date()
        const diff: number = expirationTime.getTime() - _now.getTime()
        if (diff < sessionExpiredReload) {
          window.location.reload()
        }
        if (diff < millisecondsForWarning) {
          dispatch(openModal({
            modalTitle: t('ui:session-expire-title'),
            modalText: t('ui:session-expire-text', { minutes: Math.ceil(Math.abs(diff / 1000 / 60)) }),
            modalButtons: [{
              main: true,
              text: t('ui:ok-got-it'),
              onClick: dispatch(closeModal)
            }]
          }))
        }
        checkTimeout()
      }, checkInterval)
    }

    if (!mounted) {
      checkTimeout()
      setMounted(true)
    }
  }, [checkInterval, dispatch, expirationTime, millisecondsForWarning, mounted, now, sessionExpiredReload, t])

  return <div className='c-sessionMonitor' />
}

SessionMonitor.propTypes = {
  checkInterval: PT.number,
  expirationTime: PT.instanceOf(Date),
  millisecondsForWarning: PT.number,
  sessionExpiredReload: PT.number,
  now: PT.instanceOf(Date),
  t: TPropType.isRequired
}
export default SessionMonitor
