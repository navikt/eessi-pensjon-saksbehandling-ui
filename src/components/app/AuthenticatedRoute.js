import React, { Component } from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withCookies, Cookies } from 'react-cookie'
import { Route, withRouter, Redirect } from 'react-router'
import classNames from 'classnames'
import { withNamespaces } from 'react-i18next'
import _ from 'lodash'

import * as Nav from '../ui/Nav'
import TopHeader from '../ui/Header/TopHeader'
import { IS_DEVELOPMENT_WITH_NO_AUTH } from '../../constants/environment'

import * as routes from '../../constants/routes'
import * as appActions from '../../actions/app'
import * as statusActions from '../../actions/status'

const mapStateToProps = (state) => {
  return {
    userRole: state.app.userRole,
    loggedIn: state.app.loggedIn,
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

  handleLoginRequest () {
    const { actions } = this.props
    actions.login()
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
    const { cookies, actions } = this.props
    actions.getUserInfo()
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
    const { t, className, userRole, loggedIn, isLoggingIn } = this.props

    let validRole = this.hasApprovedRole()

    return IS_DEVELOPMENT_WITH_NO_AUTH || (userRole)
      ? IS_DEVELOPMENT_WITH_NO_AUTH || validRole
        ? <Route {...this.props} />
        : <Redirect to={routes.ROOT} />
      : <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
        <TopHeader />
        <div className={classNames('w-100 text-center p-5', className)}>
          {!loggedIn ? <div>
            <Nav.Hovedknapp
              style={{ minHeight: '50px' }}
              className='loginButton'
              onClick={this.handleLoginRequest.bind(this)}
              disabled={isLoggingIn}
              spinner={isLoggingIn}>
              {isLoggingIn ? t('ui:authenticating') : t('login')}
            </Nav.Hovedknapp>
          </div> : null}
        </div>
      </div>
  }
}

AuthenticatedRoute.propTypes = {
  t: PT.func.isRequired,
  className: PT.string,
  cookies: PT.instanceOf(Cookies),
  actions: PT.object.isRequired,
  roles: PT.array.isRequired
}

export default withCookies(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    withRouter(
      withNamespaces()(AuthenticatedRoute)
    )
  )
)
