import React, {Component} from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'

import * as uiActions from '../../actions/ui'
import { getDisplayName } from '../../utils/displayName'

const mapStateToProps = (state) => {
  return {
    loggedTime: state.app.loggedTime,
    remainingTime: state.app.remainingTime,
    expirationTime: state.app.expirationTime
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions), dispatch) }
}

export class SessionMonitor extends Component {
  componentDidMount () {
    this.checkTimeout()
  }

  closeModal () {
    const { actions } = this.props
    actions.closeModal()
  }

  checkTimeout () {
    let self = this
    const { t, actions, loggedTime, remainingTime, expirationTime } = this.props

    if (!loggedTime || !remainingTime || !expirationTime) {
      return
    }

   /* how many minutes starts the warnings */
    const minutesForWarning = 5
    /* X minutes before expired */
    let sessionExpiringWarning = remainingTime - 1000 * 60 * minutesForWarning
    if (sessionExpiringWarning <= 1) { sessionExpiringWarning = 1 }
    /* check every minute */
    const checkInterval = 1000 * 60
    /* At expired time plus 1 minute */
    const sessionExpiredReload = remainingTime + 1000 * 60

    return setTimeout(() => {
      const now = new Date()
      const diff = now.getTime() - loggedTime.getTime()
      if (diff > sessionExpiredReload) {
        window.location.reload()
      } else {
        if (diff > sessionExpiringWarning) {
          const minutesRemaining = Math.abs(Math.ceil((expirationTime.getTime() - now.getTime()) / 1000 / 60))
          actions.openModal({
            modalTitle: t('ui:session-expire-title'),
            modalText: t('ui:session-expire-text', { minutes: minutesRemaining }),
            modalButtons: [{
              main: true,
              text: t('ui:ok-got-it'),
              onClick: this.closeModal.bind(this)
            }]
          })
        }
        self.checkTimeout()
      }
    }, checkInterval)
  }

  render () {
    return <div />
  }
}

SessionMonitor.propTypes = {
  loggedTime: PT.object,
  remainingTime: PT.object,
  expirationTime: PT.object,
  sessionExpiringWarning: PT.number,
  sessionExpiredReload: PT.number,
  checkInterval: PT.number
}

const ConnectedSessionMonitor = connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionMonitor)

ConnectedSessionMonitor.displayName = `Connect(${getDisplayName((
  SessionMonitor)
)})`

export default ConnectedSessionMonitor
