import React, { Component } from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route, withRouter, Redirect } from 'react-router'
import _ from 'lodash'

import NotInvited from './NotInvited'

import { IS_DEVELOPMENT_WITH_NO_AUTH } from '../../constants/environment'
import * as routes from '../../constants/routes'
import * as appActions from '../../actions/app'
import * as statusActions from '../../actions/status'

const mapStateToProps = (state) => {
  return {

    userRole: state.app.userRole,
    loggedIn: state.app.loggedIn,
    invited: state.app.invited,
    isLoggingIn: state.loading.isLoggingIn,
    rinaId: state.status.rinaId
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, appActions, statusActions), dispatch) }
}

const paramAliases = {
  'rinaid': 'rinaId',
  'saksNr': 'sakId'
}

class AuthenticatedRoute extends Component {
  state = {}

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
  }

  componentDidUpdate () {
    this.parseSearchParams()
  }

  hasApprovedRole () {
    const { roles, userRole } = this.props
    return roles.indexOf(userRole) >= 0
  }

  render () {
    const { userRole, invited } = this.props

    let validRole = this.hasApprovedRole()

    return IS_DEVELOPMENT_WITH_NO_AUTH || (userRole && validRole)
      ? !invited ? <Route {...this.props} /> : <NotInvited />
      : <Redirect to={routes.ROOT} />
  }
}

AuthenticatedRoute.propTypes = {
  t: PT.func.isRequired,
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
