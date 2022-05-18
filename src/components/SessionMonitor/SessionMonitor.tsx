import { closeModal, openModal } from 'actions/ui'
import PT from 'prop-types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

export interface SessionMonitorProps {
  checkInterval?: number
  expirationTime?: Date
  millisecondsForWarning?: number
  sessionExpiredReload?: number
  now?: Date
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
  now
}: SessionMonitorProps): JSX.Element => {

  const { t } = useTranslation()
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
              onClick: () => dispatch(closeModal())
            }]
          }))
        }
        checkTimeout()
      }, checkInterval)
    }
    checkTimeout()
  }, [])

  return <div role='application' data-testid='c-sessionMonitor' />
}

SessionMonitor.propTypes = {
  checkInterval: PT.number,
  expirationTime: PT.instanceOf(Date),
  millisecondsForWarning: PT.number,
  sessionExpiredReload: PT.number,
  now: PT.instanceOf(Date)
}
export default SessionMonitor
