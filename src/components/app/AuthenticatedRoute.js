import React, { Component } from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withCookies, Cookies } from 'react-cookie'
import { Route, withRouter, Redirect } from 'react-router'
import classNames from 'classnames'
import { translate } from 'react-i18next'

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

class AuthenticatedRoute extends Component {

  state = {}

  handleLoginRequest () {
    const { actions } = this.props
    actions.login()
  }

  componentDidMount () {
    const { cookies, actions, location } = this.props

    let idtoken = cookies.get('eessipensjon-idtoken-public')
    actions.setLoginState(idtoken === 'logged')

    let params = new URLSearchParams(location.search)
    const rinaIdFromParam = this.getAndSaveParam(params, 'rinaId')

    if (rinaIdFromParam) {
      actions.getStatus(rinaIdFromParam)
      //actions.getCase(rinaIdFromParam)
    }

    this.getAndSaveParam(params, 'fnr')
    this.getAndSaveParam(params, 'aktoerId')
    this.getAndSaveParam(params, 'rinaid', 'rinaId')
    this.getAndSaveParam(params, 'saksNr', 'sakId')
    this.getAndSaveParam(params, 'sakId')
    this.getAndSaveParam(params, 'kravId')
    this.getAndSaveParam(params, 'vedtakId')
  }

  componentDidUpdate() {

    const { actions, rinaId } = this.props

    if (rinaId && rinaId !== this.state.rinaId) {

      actions.getStatus(rinaId)
      this.setState({
        rinaId: rinaId
      })
    }
  }

  getAndSaveParam (params, key, renamedKey) {
    const { actions } = this.props
    const value = params.get(key)

    if (value) {
      actions.setStatusParam(renamedKey || key, value)
      this.setState({
        [renamedKey || key] : value
      })
    }
    return value
  }

  hasApprovedRole () {
    const { roles, userRole } = this.props

    return roles.indexOf(userRole) >= 0
  }

  render () {
    const { t, className, userRole, loggedIn, isLoggingIn } = this.props

    let validRole = this.hasApprovedRole()

    return IS_DEVELOPMENT_WITH_NO_AUTH || (loggedIn && userRole)
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
      translate()(AuthenticatedRoute)
    )
  )
)
