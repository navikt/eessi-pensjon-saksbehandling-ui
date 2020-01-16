import * as appActions from 'actions/app'
import * as constants from 'constants/constants'
import * as routes from 'constants/routes'
import { T } from 'declarations/types'
import { ActionCreatorsPropType, TPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import { ActionCreators, Dispatch, State } from 'eessi-pensjon-ui/dist/declarations/types'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { Redirect, Route, withRouter } from 'react-router'
import { bindActionCreators, connect } from 'store'
import './AuthenticatedRoute.css'

const mapStateToProps = (state: State) => ({
  /* istanbul ignore next */
  userRole: state.app.userRole,
  userStatus: state.app.userStatus,
  loggedIn: state.app.loggedIn,
  allowed: state.app.allowed
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  /* istanbul ignore next */
  actions: bindActionCreators(appActions, dispatch)
})

const paramAliases: {[k: string]: string} = {
  rinaid: 'rinaId',
  saksNr: 'sakId',
  saksId: 'sakId',
  fnr: 'aktoerId',
  saksType: 'sakType'
}

type Params = {[k: string]: any}

export interface AuthenticatedRouteProps {
  actions: ActionCreators;
  allowed?: boolean;
  location: any;
  loggedIn?: boolean;
  t: T;
  userRole?: string;
}

export const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = (props: AuthenticatedRouteProps): JSX.Element => {
  const { actions, allowed, location, loggedIn, t, userRole } = props
  const [_params, _setParams] = useState<Params>({})
  const [mounted, setMounted] = useState<boolean>(false)
  const [requestingUserInfo, setRequestingUserInfo] = useState<boolean>(false)
  const [requestingLogin, setRequestingLogin] = useState<boolean>(false)

  useEffect(() => {
    const parseSearchParams = () => {
      const params: URLSearchParams = new URLSearchParams(location.search)
      const newParams: Params = {}
      params.forEach((value, key) => {
        const _key = Object.prototype.hasOwnProperty.call(paramAliases, key)
          ? paramAliases[key]
          : key
        const _value: string | undefined = value || undefined
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

      if (loggedIn === false && !requestingLogin) {
        actions.login()
        setRequestingLogin(true)
      }
      if (loggedIn === true) {
        setMounted(true)
      }
    }
  }, [loggedIn, actions, requestingUserInfo, requestingLogin, mounted])

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

AuthenticatedRoute.propTypes = {
  actions: ActionCreatorsPropType.isRequired,
  allowed: PT.bool,
  location: PT.object.isRequired,
  loggedIn: PT.bool,
  t: TPropType.isRequired,
  userRole: PT.string
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withTranslation()(AuthenticatedRoute)))
