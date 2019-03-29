import React, { Component } from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withTranslation } from 'react-i18next'

import * as uiActions from '../../actions/ui'

const mapStateToProps = (state) => {
  return {
    loggedTime: state.app.loggedTime
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
    const { t, actions, loggedTime, sessionExpiringWarning, sessionExpiredReload, checkInterval } = this.props
    if (!loggedTime || !sessionExpiringWarning || !sessionExpiredReload || !checkInterval) {
      return
    }
    return setTimeout(() => {
      let diff = new Date().getTime() - loggedTime.getTime()
      if (diff > sessionExpiringWarning) {
        console.log('Session will expire')
        actions.openModal({
          modalTitle: t('ui:session-expire-title'),
          modalText: t('ui:session-expire-text'),
          modalButtons: [{
            main: true,
            text: t('ui:ok-got-it'),
            onClick: this.closeModal.bind(this)
          }]
        })
      }
      if (diff > sessionExpiredReload) {
        window.location.reload()
      }
      self.checkTimeout()
    }, checkInterval)
  }

  render () {
    return <div />
  }
}

SessionMonitor.propTypes = {
  loggedTime: PT.object,
  sessionExpiringWarning: PT.number,
  sessionExpiredReload: PT.number,
  checkInterval: PT.number
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(SessionMonitor)
)
