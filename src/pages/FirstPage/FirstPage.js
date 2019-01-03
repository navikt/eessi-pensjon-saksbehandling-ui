import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import 'url-search-params-polyfill'

import Psycho from '../../components/ui/Psycho/Psycho'
import TopContainer from '../../components/ui/TopContainer/TopContainer'
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
    isLoggingIn: state.loading.isLoggingIn,
    language: state.ui.language
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

    switch (userRole) {
      case constants.SAKSBEHANDLER:
        history.push({
          pathname: routes.PINFO_SAKSBEHANDLER,
          search: window.location.search
        })
        break
      default:
        history.push(routes.PINFO)
        break
    }
  }

  render () {
    const { t, loggedIn, isLoggingIn, gettingUserInfo, history, location, userRole } = this.props

    return <TopContainer className='p-firstPage'
      history={history} location={location}
      header={<span>{t('pinfo:app-title')}
        <Nav.HjelpetekstBase id='pinfo-title-help' type='under'>
          {t('pinfo:eea-countries')}
        </Nav.HjelpetekstBase>
      </span>}>
      <div className='content container text-center pt-4'>
        <div className='col-md-2' />
        <div className='col-md-8'>
          <div className='psycho mt-3 mb-4'>
            <Psycho id='psycho' />
          </div>
          { userRole === constants.BRUKER ? <div className='text-justify' dangerouslySetInnerHTML={{ __html: t('pinfo:psycho-description') }} /> : null }
          <div className='psycho mt-3 mb-4'>
            { !loggedIn ? <Nav.Hovedknapp
              className='mt-3 loginButton'
              onClick={this.handleLoginRequest.bind(this)}
              disabled={isLoggingIn || gettingUserInfo}
              spinner={isLoggingIn || gettingUserInfo}>
              {isLoggingIn ? t('ui:authenticating')
                : gettingUserInfo ? t('loading') : t('continue')}
            </Nav.Hovedknapp>
              : <Nav.Hovedknapp
                className='mt-3 forwardButton'
                onClick={this.handleForwardButtonClick.bind(this)}>{t('continue')}
              </Nav.Hovedknapp>}
          </div>
        </div>
        <div className='col-md-2' />
      </div>
    </TopContainer>
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
