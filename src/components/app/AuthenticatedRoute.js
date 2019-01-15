import React, { Component } from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route, withRouter, Redirect } from 'react-router'
import _ from 'lodash'

import { IS_DEVELOPMENT } from '../../constants/environment'
import WaitingPanel from './WaitingPanel'

import * as routes from '../../constants/routes'
import * as appActions from '../../actions/app'
import * as statusActions from '../../actions/status'

const mapStateToProps = (state) => {
  return {
    userRole: state.app.userRole,
    userStatus: state.app.userStatus,
    loggedIn: state.app.loggedIn,
    allowed: state.app.allowed,
    isLoggingIn: state.loading.isLoggingIn,
    gettingUserInfo: state.loading.gettingUserInfo,
    rinaId: state.status.rinaId
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, appActions, statusActions), dispatch) }
}

const paramAliases = {
  'rinaid': 'rinaId',
  'saksNr': 'saksId',
  'fnr': 'aktoerId'
}

class AuthenticatedRoute extends Component {
  state = {
    isReady: false
  }

  parseSearchParams () {
    const { actions, location } = this.props

    let params = new URLSearchParams(location.search)
    let newParams = {}
    params.forEach((value, key) => {
      const _key = paramAliases.hasOwnProperty(key) ? paramAliases[key] : key
      const _value = value || undefined
      if (_value !== this.state[_key]) {
        actions.setStatusParam(_key, _value)
        newParams[_key] = _value
      }
    })
    if (!_.isEmpty(newParams)) {
      this.setState(newParams)
    }
    return newParams
  }

  componentDidMount () {
    const { actions, userStatus } = this.props
    if (!userStatus) {
      actions.getUserInfo()
    } else {
      this.setState({
        isReady: true
      })
    }
    this.parseSearchParams()
  }

  componentDidUpdate () {
    const { userStatus } = this.props
    const { isReady } = this.state

    if (!isReady && userStatus !== undefined) {
      this.setState({
        isReady: true
      })
    }
    this.parseSearchParams()
  }

  hasApprovedRole () {
    const { roles, userRole } = this.props
    return roles.indexOf(userRole) >= 0
  }

  comesFromPesys () {
    return this.state.hasOwnProperty('saksId') && this.state.hasOwnProperty('aktoerId')
  }

  forceLogin () {
    const { actions } = this.props

    console.log("No oidc-token, force login.")
    actions.login()
  }

  render () {
    const { userRole, allowed, gettingUserInfo } = this.props
    const { isReady } = this.state

    if (!isReady || gettingUserInfo) {
      return <WaitingPanel message='authenticating' />
    }

    if (!userRole) {
      this.forceLogin()
      return null
    }

    let validRole = this.hasApprovedRole()

    if (!validRole) {
      return <Redirect to={routes.FORBIDDEN} />
    }

    let authorized = allowed || IS_DEVELOPMENT

    if (!authorized) {
      return <Redirect to={routes.NOT_INVITED} />
    }

    return <Route {...this.props} />
  }
}

AuthenticatedRoute.propTypes = {
  className: PT.string,
  actions: PT.object.isRequired,
  roles: PT.array.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withRouter(AuthenticatedRoute)
)
