import React, { Component } from 'react'
import { connect, bindActionCreators } from 'store'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'

import AdvarselTrekant from '../../../resources/images/AdvarselTrekant'
import Icons from '../Icons'
import * as Nav from '../Nav'

import * as routes from '../../../constants/routes'

import NavLogoTransparent from '../../../resources/images/NavLogoTransparent'
import * as appActions from '../../../actions/app'
import * as uiActions from '../../../actions/ui'

import './InternalTopHeader.css'
import { getDisplayName } from '../../../utils/displayName'

const mapStateToProps = (state) => {
  return {
    username: state.app.username,
    userRole: state.app.userRole,
    highContrast: state.ui.highContrast,
    gettingUserInfo: state.loading.gettingUserInfo,
    isLoggingOut: state.loading.isLoggingOut
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions, appActions), dispatch) }
}

export class InternalTopHeader extends Component {
  onLogoClick () {
    const { history, actions } = this.props
    actions.clearData()
    history.push({
      pathname: routes.INDEX,
      search: window.location.search
    })
  }

  handleUsernameSelectRequest (e) {
    const { actions } = this.props

    if (e.target.value === 'logout') {
      actions.clearData()
      actions.logout()
    }
  }

  render () {
    let { t, username, userRole, gettingUserInfo, isLoggingOut, highContrast, header } = this.props

    return <React.Fragment>
      <header className='c-ui-topHeader'>
        <div className='brand'>
          <a href='#index' id='c-ui-logo-link' onClick={this.onLogoClick.bind(this)}>
            <NavLogoTransparent width='100' height='45' color={highContrast ? 'white' : 'black'} />
          </a>
          <div className='skillelinje' />
          <div className='tittel'><span>{t('app-headerTitle')}</span></div>
        </div>
        <div className='user'>
          {userRole ? <div title={userRole} className={classNames('mr-2', userRole)}>
            <Icons kind='user' />
          </div>
            : isLoggingOut ? <Nav.NavFrontendSpinner type='XS' /> : null}
          <div className='skillelinje' />
          <div className='mr-4 ml-2 align-middle name'>
            {gettingUserInfo ? t('buc:loading-gettingUserInfo')
              : username
                ? <Nav.Select className='username-select'
                  label={''} value={username} selected={username}
                  onChange={this.handleUsernameSelectRequest.bind(this)}>
                  <option value=''>{username}</option>
                  <option value='feedback'>{t('ui:giveFeedback')}</option>
                  <option value='logout'>{t('logout')}</option>
                </Nav.Select>
                : <React.Fragment>
                  <AdvarselTrekant size={16} />
                  <span className='username-span'>{t('unknown')}</span>
                </React.Fragment>
            }
          </div>
        </div>
      </header>
      {header ? <h1 className='typo-sidetittel mt-4 appTitle'>{header}</h1> : null}
    </React.Fragment>
  }
}

InternalTopHeader.propTypes = {
  t: PT.func.isRequired,
  username: PT.string,
  userRole: PT.string,
  actions: PT.object,
  history: PT.object,
  gettingUserInfo: PT.bool,
  header: PT.oneOfType([PT.node, PT.string])
}

const ConnectedInternalTopHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(InternalTopHeader)
)

ConnectedInternalTopHeader.displayName = `Connect(${getDisplayName((
  withTranslation()(InternalTopHeader)
))})`

export default ConnectedInternalTopHeader
