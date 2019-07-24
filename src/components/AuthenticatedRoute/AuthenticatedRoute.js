import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import { withTranslation } from 'react-i18next'
import { Route, withRouter, Redirect } from 'react-router'
import _ from 'lodash'

import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import * as routes from 'constants/routes'
import * as constants from 'constants/constants'
import * as appActions from 'actions/app'
import { getDisplayName } from 'utils/displayName'

const mapStateToProps = (state) => {
  return {
    userRole: state.app.userRole,
    userStatus: state.app.userStatus,
    loggedIn: state.app.loggedIn,
    allowed: state.app.allowed,
    isLoggingIn: state.loading.isLoggingIn,
    rinaId: state.app.params.rinaId
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, appActions), dispatch) }
}

const paramAliases = {
  'rinaid': 'rinaId',
  'saksNr': 'sakId',
  'saksId': 'sakId',
  'fnr': 'aktoerId'
}

const AuthenticatedRoute = (props) => {
  const [ _params, _setParams ] = useState({})
  const [ mounted, setMounted ] = useState(false)
  const [ requestingUserInfo, setRequestingUserInfo ] = useState(false)
  const [ requestingLogin, setRequestingLogin ] = useState(false)
  const { t, allowed, actions, location, loggedIn, userRole } = props

  useEffect(() => {
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
    parseSearchParams()
  }, [location.search, _params, actions])

  useEffect(() => {
    if (!mounted) {
      if (loggedIn === undefined && !requestingUserInfo) {
        actions.getUserInfo()
        setRequestingUserInfo(true)
      }
      if (loggedIn === false && requestingUserInfo && !requestingLogin) {
        actions.login()
        setRequestingLogin(true)
      }
      if (loggedIn === true) {
        setMounted(true)
      }
    }
  }, [loggedIn, actions, requestingUserInfo, requestingLogin, mounted])

  if (!mounted) {
    return <WaitingPanel message={t('authenticating')} />
  }

  if (userRole !== constants.SAKSBEHANDLER) {
    return <Redirect to={{
      pathname: routes.FORBIDDEN
    }} />
  }

  if (!allowed) {
    return <Redirect to={{
      pathname: routes.NOT_INVITED
    }} />
  }
  return <Route {...props} />
}

AuthenticatedRoute.propTypes = {
  className: PT.string,
  actions: PT.object.isRequired
}

const ConnectedAuthenticatedRoute = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withRouter(
    withTranslation()(AuthenticatedRoute)
  )
)

ConnectedAuthenticatedRoute.displayName = `Connect(${getDisplayName(
  withRouter(
    withTranslation()(AuthenticatedRoute)
  ))})`

export default ConnectedAuthenticatedRoute
