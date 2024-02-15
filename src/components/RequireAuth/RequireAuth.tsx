import {getUserInfo, setContext, setStatusParam} from 'actions/app'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import * as constants from 'constants/constants'
import * as routes from 'constants/routes'
import {SakTypeKey, SakTypeMap} from 'declarations/buc.d'
import { Params } from 'declarations/app'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'


const RouteDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`

export interface RequireAuthSelector {
  loggedIn: boolean | undefined
  userRole: string | undefined
  gettingUserInfo: boolean
  isLoggingIn: boolean
}

const mapState = (state: State): RequireAuthSelector => ({
  /* istanbul ignore next */
  userRole: state.app.userRole,
  loggedIn: state.app.loggedIn,
  gettingUserInfo: state.loading.gettingUserInfo,
  isLoggingIn: state.loading.isLoggingIn
})

const paramAliases: {[k: string]: string} = {
  rinaid: 'rinaId',
  saksNr: 'sakId',
  saksId: 'sakId',
  fnr: 'aktoerId',
  saksType: 'sakType'
}

const RequireAuth: React.FC<any> = (props) => {
  const {context} = props
  const { loggedIn, userRole, gettingUserInfo, isLoggingIn } = useSelector<State, RequireAuthSelector>(mapState)
  const dispatch = useDispatch()
  const location = useLocation()

  const [_params, _setParams] = useState<Params>({})

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
            if(_key === "sakType" && SakTypeMap.hasOwnProperty(value)){
              value = SakTypeMap[value as SakTypeKey]
            }
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
  }, [location, _params])

  useEffect(() => {
    if (loggedIn === undefined && !gettingUserInfo) {
      dispatch(getUserInfo())
    }
  }, [])

  useEffect(() => {
    if (context) {
      dispatch(setContext(context))
    }
  }, [context])

  if (isLoggingIn || loggedIn === undefined) {
    return (
      <RouteDiv role='alert'>
        <WaitingPanel />
      </RouteDiv>
    )
  }

  if (userRole !== constants.SAKSBEHANDLER || loggedIn === false) {
    return (
      <Navigate to={routes.FORBIDDEN} />
    )
  }

  return props.children
}

export default RequireAuth
