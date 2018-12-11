import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import 'url-search-params-polyfill'

import LogoHeader from '../../components/ui/Header/LogoHeader'

import LanguageSelector from '../../components/ui/LanguageSelector'
import FirstBanner from '../../components/ui/Banner/FirstBanner'
import * as Nav from '../../components/ui/Nav'

import * as routes from '../../constants/routes'
import * as constants from '../../constants/constants'
import * as statusActions from '../../actions/status'
import * as appActions from '../../actions/app'
import * as uiActions from '../../actions/ui'

import './FirstPage.css'

const mapStateToProps = (state) => {
  return {
    username: state.app.username,
    userRole: state.app.userRole,
    loggedIn: state.app.loggedIn,
    gettingUserInfo: state.loading.gettingUserInfo,
    isLoggingIn: state.loading.isLoggingIn
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions, appActions, statusActions), dispatch) }
}

class FirstPage extends Component {
  componentDidMount () {
    const { actions, userRole } = this.props
    if (!userRole) {
      actions.getUserInfo()
    }
  }

  handleLoginRequest () {
    const { actions } = this.props
    actions.login()
  }

  handleForwardButtonClick () {
    const { history, userRole } = this.props

    switch(userRole) {

      case constants.SAKSBEHANDLER:
      history.push(routes.PINFO_SAKSBEHANDLER)
      break
      default:
      history.push(routes.PINFO)
      break
    }
  }

  render () {
    const { t, loggedIn, isLoggingIn, gettingUserInfo } = this.props

    return <div className='p-firstPage hodefot'>
      <LogoHeader />
      <FirstBanner />
      <div className='content'>
        <div className='container text-center pt-4'>
          <LanguageSelector className='mt-3' />
          {!loggedIn ? <Nav.Hovedknapp
            className='mt-3 loginButton'
            onClick={this.handleLoginRequest.bind(this)}
            disabled={isLoggingIn || gettingUserInfo}
            spinner={isLoggingIn || gettingUserInfo}>
            {isLoggingIn ? t('ui:authenticating')
              : gettingUserInfo ? t('loading') : t('login')}
          </Nav.Hovedknapp>
            : <Nav.Hovedknapp
              className='mt-3 forwardButton'
              onClick={this.handleForwardButtonClick.bind(this)}>{t('next')}
            </Nav.Hovedknapp>}
        </div>
      </div>
    </div>
  }
}

FirstPage.propTypes = {
  language: PT.string,
  location: PT.object.isRequired,
  t: PT.func.isRequired,
  actions: PT.object.isRequired,
  gettingStatus: PT.bool,
  status: PT.object,
  history: PT.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(FirstPage)
)
