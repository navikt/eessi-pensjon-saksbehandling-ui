import {getCountryCodeLists, getUserInfo, setContext, setStatusParam} from 'src/actions/app'
import WaitingPanel from 'src/components/WaitingPanel/WaitingPanel'
import * as constants from 'src/constants/constants'
import * as routes from 'src/constants/routes'
import {SakTypeKey, SakTypeMap} from 'src/declarations/buc.d'
import {CountryCodes, FeatureToggles, Params} from 'src/declarations/app'
import { State } from 'src/declarations/reducers'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'


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
  countryCodes: CountryCodes | undefined
  gettingUserInfo: boolean
  isLoggingIn: boolean
  gettingCountryCodes: boolean
  featureToggles: FeatureToggles
}

const mapState = (state: State): RequireAuthSelector => ({
  /* istanbul ignore next */
  userRole: state.app.userRole,
  loggedIn: state.app.loggedIn,
  countryCodes: state.app.countryCodes,
  gettingUserInfo: state.loading.gettingUserInfo,
  isLoggingIn: state.loading.isLoggingIn,
  gettingCountryCodes: state.loading.gettingCountryCodes,
  featureToggles: state.app.featureToggles
})

const paramAliases: {[k: string]: string} = {
  rinaid: 'rinaId',
  saksNr: 'sakId',
  saksId: 'sakId',
  fnr: 'aktoerId',
  saksType: 'sakType'
}

const RequireAuth: React.FC<any> = (props) => {
  const {context, adminOnly} = props
  const { loggedIn, userRole, countryCodes, gettingUserInfo, gettingCountryCodes, isLoggingIn, featureToggles } = useSelector<State, RequireAuthSelector>(mapState)
  const dispatch = useDispatch()
  const location = useLocation()

  const isAdmin: boolean = featureToggles.EESSI_ADMIN === true

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

          if(_key === "sakType" && SakTypeMap.hasOwnProperty(value)){
            value = SakTypeMap[value as SakTypeKey]
          }

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
  }, [location])

  useEffect(() => {
    if (loggedIn === undefined && !gettingUserInfo) {
      dispatch(getUserInfo())
    }
    if(countryCodes === undefined && !gettingCountryCodes){
      dispatch(getCountryCodeLists())
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

  if (userRole !== constants.SAKSBEHANDLER || !loggedIn || (adminOnly && !isAdmin)) {
    return (
      <Navigate to={routes.FORBIDDEN} />
    )
  }

  return props.children
}

export default RequireAuth
