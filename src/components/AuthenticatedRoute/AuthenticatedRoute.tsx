import { getUserInfo, login, setStatusParam } from 'actions/app'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import * as constants from 'constants/constants'
import * as routes from 'constants/routes'
import { Params } from 'declarations/app'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import styled from 'styled-components'

const RouteDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`

export interface AuthenticatedRouteSelector {
  allowed: boolean | undefined;
  loggedIn: boolean | undefined;
  userRole: string | undefined;
}

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

export const AuthenticatedRoute: React.FC<RouteProps> = (props: RouteProps): JSX.Element => {
  const { allowed, loggedIn, userRole } = useSelector<State, AuthenticatedRouteSelector>(mapState)
  const dispatch = useDispatch()
  const { location } = props

  const [_params, _setParams] = useState<Params>({})
  const [_mounted, setMounted] = useState<boolean>(false)
  const [_requestingUserInfo, setRequestingUserInfo] = useState<boolean>(false)
  const [_requestingLogin, setRequestingLogin] = useState<boolean>(false)

  useEffect(() => {
    const parseSearchParams = () => {
      const newParams: Params = {}
      if (location) {
        const params: URLSearchParams = new URLSearchParams(location.search)

        params.forEach((value, key) => {
          const _key = Object.prototype.hasOwnProperty.call(paramAliases, key)
            ? paramAliases[key]
            : key
          if (value && value !== _params[_key]) {
            dispatch(setStatusParam(_key, value))
            newParams[_key] = value
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
    if (!_mounted) {
      if (loggedIn === undefined && !_requestingUserInfo) {
        dispatch(getUserInfo())
        setRequestingUserInfo(true)
      }

      if (loggedIn === false && !_requestingLogin) {
        dispatch(login())
        setRequestingLogin(true)
      }
      if (loggedIn === true) {
        setMounted(true)
      }
    }
  }, [dispatch, loggedIn, _requestingUserInfo, _requestingLogin, _mounted])

  if (!_mounted) {
    return (
      <RouteDiv>
        <WaitingPanel />
      </RouteDiv>
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
