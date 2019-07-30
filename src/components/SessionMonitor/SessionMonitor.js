import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'

import * as uiActions from 'actions/ui'
import { getDisplayName } from 'utils/displayName'

const mapStateToProps = (state) => {
  return {
    expirationTime: state.app.expirationTime
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(uiActions, dispatch) }
}

export const SessionMonitor = (props) => {
  const { actions,
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
  } = props
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const checkTimeout = () => {
      if (!expirationTime) {
        return
      }
      setTimeout(() => {
        const _now = now || new Date()
        const diff = expirationTime.getTime() - _now.getTime()
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

const ConnectedSessionMonitor = connect(mapStateToProps, mapDispatchToProps)(SessionMonitor)
ConnectedSessionMonitor.displayName = `Connect(${getDisplayName((SessionMonitor))})`
export default ConnectedSessionMonitor
