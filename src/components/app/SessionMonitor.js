import React, { Component } from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import { withTranslation } from 'react-i18next'

import * as uiActions from '../../actions/ui'

const mapStateToProps = (state) => {
  return {
    loggedTime: state.app.loggedTime,
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
    const { t, actions, loggedTime, expirationTime, sessionExpiringWarning, sessionExpiredReload, checkInterval } = this.props
    if (!loggedTime || !sessionExpiringWarning || !sessionExpiredReload || !checkInterval) {
      return
    }
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
  expirationTime: PT.object,
  sessionExpiringWarning: PT.number,
  sessionExpiredReload: PT.number,
  checkInterval: PT.number
}

const ConnectedSessionMonitor = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(SessionMonitor)
)

export default ConnectedSessionMonitor
