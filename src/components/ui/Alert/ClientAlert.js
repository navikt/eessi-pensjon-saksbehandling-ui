import React, { Component } from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'

import Icons from '../Icons'
import * as Nav from '../Nav'

import * as alertActions from '../../../actions/alert'

import './ClientAlert.css'

const mapStateToProps = (state) => {
  return {
    clientErrorStatus: state.alert.clientErrorStatus,
    clientErrorMessage: state.alert.clientErrorMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, alertActions), dispatch) }
}

class ClientAlert extends Component {
    state = {
      status: undefined,
      message: undefined
    }

    static getDerivedStateFromProps (newProps, oldState) {
      if (newProps.clientErrorStatus !== oldState.status || newProps.clientErrorMessage !== oldState.message) {
        return {
          status: newProps.clientErrorStatus,
          message: newProps.clientErrorMessage
        }
      }
      return {}
    }

    clientClear () {
      const { actions } = this.props

      actions.clientClear()
    }

    render () {
      let { t, className, fixed } = this.props
      let { status, message } = this.state

      let _fixed = fixed || true

      if (!message) {
        return null
      }

      let separatorIndex = message.lastIndexOf('|')
      let _message

      if (separatorIndex >= 0) {
        _message = t(message.substring(0, separatorIndex)) + ': ' + message.substring(separatorIndex + 1)
      } else {
        _message = t(message)
      }
      return <Nav.AlertStripe solid
        className={classNames(className, 'c-ui-clientAlert', {
          'fixed': _fixed
        })}
        type={status === 'OK' ? 'suksess' : 'advarsel'}>
        {_message}
        <Icons className='closeIcon' size='1x' kind='close' onClick={this.clientClear.bind(this)} />
      </Nav.AlertStripe>
    }
}

ClientAlert.propTypes = {
  t: PT.func.isRequired,
  actions: PT.object.isRequired,
  className: PT.string,
  fixed: PT.bool
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(ClientAlert)
)
