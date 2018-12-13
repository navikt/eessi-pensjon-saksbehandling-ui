import React, { Component } from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route, withRouter, Redirect } from 'react-router'
import _ from 'lodash'

import WaitingPanel from './WaitingPanel'
import * as routes from '../../constants/routes'
import * as appActions from '../../actions/app'
import * as statusActions from '../../actions/status'

const mapStateToProps = (state) => {
  return {

    userRole: state.app.userRole,
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
  'saksNr': 'saksId'
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
    const { actions, userRole } = this.props
    if (!userRole) {
      actions.getUserInfo()
    }
    this.parseSearchParams()
    this.setState({
      isReady: true
    })
  }

  componentDidUpdate () {
    this.parseSearchParams()
  }

  hasApprovedRole () {
    const { roles, userRole } = this.props
    return roles.indexOf(userRole) >= 0
  }

  render () {
    const { userRole, allowed, gettingUserInfo } = this.props
    const { isReady } = this.state

    if (!isReady || gettingUserInfo) {
      return <WaitingPanel message='authenticating' />
    }

    let validRole = this.hasApprovedRole()

    return userRole && validRole
      ? !allowed
        ? <Route {...this.props} />
        : <Redirect to={routes.NOT_INVITED} />
      : <Redirect to={routes.ROOT} />
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
