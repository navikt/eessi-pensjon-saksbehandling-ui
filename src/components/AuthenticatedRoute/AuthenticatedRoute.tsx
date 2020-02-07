import { getUserInfo, login, setStatusParam } from 'actions/app'
import * as constants from 'constants/constants'
import * as routes from 'constants/routes'
import { State } from 'declarations/reducers'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, Route, RouteProps } from 'react-router'
import './AuthenticatedRoute.css'

const mapState = (state: State): AuthenticatedRouteSelector => ({
  /* istanbul ignore next */
  userRole: state.app.userRole,
  loggedIn: state.app.loggedIn,
  allowed: state.app.allowed
})

const paramAliases: {[k: string]: string} = {
  rinaid: 'rinaId',
  saksNr: 'sakId',
  saksId: 'sakId',
  fnr: 'aktoerId',
  saksType: 'sakType'
}

type Params = {[k: string]: any}

export interface AuthenticatedRouteSelector {
  userRole: string | undefined;
  loggedIn: boolean | undefined;
  allowed: boolean | undefined;
}

export const AuthenticatedRoute: React.FC<RouteProps> = (props: RouteProps): JSX.Element => {
  const { location } = props
  const [_params, _setParams] = useState<Params>({})
  const [mounted, setMounted] = useState<boolean>(false)
  const [requestingUserInfo, setRequestingUserInfo] = useState<boolean>(false)
  const [requestingLogin, setRequestingLogin] = useState<boolean>(false)
  const { allowed, loggedIn, userRole } = useSelector<State, AuthenticatedRouteSelector>(mapState)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  useEffect(() => {
    const parseSearchParams = () => {
      const newParams: Params = {}
      if (location) {
        const params: URLSearchParams = new URLSearchParams(location.search)

        params.forEach((value, key) => {
          const _key = Object.prototype.hasOwnProperty.call(paramAliases, key)
            ? paramAliases[key]
            : key
          const _value: string | undefined = value || undefined
          if (_value !== _params[_key]) {
            dispatch(setStatusParam(_key, _value))
            newParams[_key] = _value
          }
        })
        if (!_.isEmpty(newParams)) {
          _setParams(newParams)
        }
      }
      return newParams
    }

    parseSearchParams()
  }, [dispatch, location, _params])

  useEffect(() => {
    if (!mounted) {
      if (loggedIn === undefined && !requestingUserInfo) {
        dispatch(getUserInfo())
        setRequestingUserInfo(true)
      }

      if (loggedIn === false && !requestingLogin) {
        dispatch(login())
        setRequestingLogin(true)
      }
      if (loggedIn === true) {
        setMounted(true)
      }
    }
  }, [dispatch, loggedIn, requestingUserInfo, requestingLogin, mounted])

  if (!mounted) {
    return (
      <div className='c-authenticatedRoute'>
        <Ui.WaitingPanel size='XL' essage={t('authenticating')} />
      </div>
    )
  }

  if (userRole !== constants.SAKSBEHANDLER) {
    return (
      <Redirect to={{
        pathname: routes.FORBIDDEN
      }}
      />
    )
  }

  if (!allowed) {
    return (
      <Redirect to={{
        pathname: routes.NOT_INVITED
      }}
      />
    )
  }
  return <Route {...props} />
}

export default AuthenticatedRoute
