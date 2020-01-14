import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { ActionCreators, T } from 'types.d'

export interface SessionMonitorProps {
  actions: ActionCreators;
  checkInterval?: number;
  expirationTime: Date;
  millisecondsForWarning?: number;
  sessionExpiredReload?: number;
  now?: Date;
  t: T
}

const SessionMonitor = ({
  actions,
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
}: SessionMonitorProps) => {
  const [mounted, setMounted] = useState<boolean>(false)

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
          actions.openModal({
            modalTitle: t('ui:session-expire-title'),
            modalText: t('ui:session-expire-text', { minutes: Math.ceil(Math.abs(diff / 1000 / 60)) }),
            modalButtons: [{
              main: true,
              text: t('ui:ok-got-it'),
              onClick: actions.closeModal
            }]
          })
        }
        checkTimeout()
      }, checkInterval)
    }

    if (!mounted) {
      checkTimeout()
      setMounted(true)
    }
  }, [actions, checkInterval, expirationTime, millisecondsForWarning, mounted, now, sessionExpiredReload, t])

  return <div className='c-sessionMonitor' />
}

SessionMonitor.propTypes = {
  actions: PT.object.isRequired,
  expirationTime: PT.object,
  now: PT.object,
  t: PT.func.isRequired
}
export default SessionMonitor
