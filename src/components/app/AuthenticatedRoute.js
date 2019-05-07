import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators }from 'redux'
import { withTranslation } from 'react-i18next'
import { Route, withRouter, Redirect } from 'react-router'
import _ from 'lodash'

import WaitingPanel from './WaitingPanel'

import * as routes from '../../constants/routes'
import * as appActions from '../../actions/app'
import * as statusActions from '../../actions/status'
import * as attachmentActions from '../../actions/attachment'

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
  return { actions: bindActionCreators(Object.assign({}, appActions, statusActions, attachmentActions), dispatch) }
}

const paramAliases = {
  'rinaid': 'rinaId',
  'saksNr': 'sakId',
  'saksId': 'sakId',
  'fnr': 'aktoerId'
}

const AuthenticatedRoute = (props) => {

  const [ _params, _setParams ] = useState({})
  const { t, allowed, actions, location, loggedIn, gettingUserInfo, roles, userRole } = props

  const parseSearchParams = () => {

    let params = new URLSearchParams(location.search)
    let newParams = {}
    params.forEach((value, key) => {
      const _key = paramAliases.hasOwnProperty(key) ? paramAliases[key] : key
      const _value = value || undefined
      if (_value !== _params[_key]) {
        actions.setStatusParam(_key, _value)
        newParams[_key] = _value
      }
    })
    if (!_.isEmpty(newParams)) {
      _setParams(newParams)
    }
    return newParams
  }

  useEffect(() => {
    if (loggedIn === undefined && !gettingUserInfo) {
      actions.getUserInfo()
    }
    if (loggedIn === false) {
      actions.login()
    }
    parseSearchParams()
  }, [loggedIn, gettingUserInfo, actions])

  const hasApprovedRole = () => {
    return roles.indexOf(userRole) >= 0
  }

  if (!loggedIn) {
    return <WaitingPanel message={t('authenticating')} />
  }

  let validRole = hasApprovedRole()

  if (!validRole) {
    return <Redirect to={{
      pathname: routes.FORBIDDEN,
      state: { role: userRole }
    }} />
  }

  let authorized = allowed

  if (!authorized) {
    return <Redirect to={{
      pathname: routes.NOT_INVITED,
      state: { role: userRole }
    }} />
  }

  return <Route {...props} />
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
  withRouter(
    withTranslation()(AuthenticatedRoute)
  )
)
