import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import { withTranslation } from 'react-i18next'
import { Route, withRouter, Redirect } from 'react-router'
import _ from 'lodash'

import WaitingPanel from './WaitingPanel'

import * as routes from '../../constants/routes'
import * as constants from '../../constants/constants'
import * as appActions from '../../actions/app'
import * as statusActions from '../../actions/status'

const mapStateToProps = (state) => {
  return {
    userRole: state.app.userRole,
    userStatus: state.app.userStatus,
    loggedIn: state.app.loggedIn,
    allowed: state.app.allowed,
    isLoggingIn: state.loading.isLoggingIn,
    rinaId: state.status.rinaId
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, appActions, statusActions), dispatch) }
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
  }, [location.search])

  useEffect(() => {
    if (!mounted) {
      if (loggedIn === undefined && !requestingUserInfo) {
        actions.getUserInfo()
        setRequestingUserInfo(true)
      }

      if (requestingUserInfo && loggedIn !== undefined) {
        setRequestingUserInfo(false)
        if (loggedIn === false) {
          actions.login()
        } else {
          setMounted(true)
        }
      }
    }
  }, [loggedIn, actions])

  if (!loggedIn) {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withRouter(
    withTranslation()(AuthenticatedRoute)
  )
)
