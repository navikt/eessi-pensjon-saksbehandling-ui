import React, { Component } from 'react'
import { connect, bindActionCreators } from 'store'
import PT from 'prop-types'
import classNames from 'classnames'

import Icons from 'components/Icons'
import { NavFrontendSpinner, Select, Systemtittel } from 'components/Nav'
import * as routes from 'constants/routes'
import AdvarselTrekant from 'resources/images/AdvarselTrekant'
import NavLogoTransparent from 'resources/images/NavLogoTransparent'
import * as appActions from 'actions/app'
import * as uiActions from 'actions/ui'
import { getDisplayName } from 'utils/displayName'

import './InternalTopHeader.css'

const mapStateToProps = (state) => {
  return {
    username: state.app.username,
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
    let { t, username, gettingUserInfo, isLoggingOut, header } = this.props

    return <React.Fragment>
      <header className='c-ui-topHeader'>
        <div className='brand'>
          <a href='#index' id='c-ui-logo-link' onClick={this.onLogoClick.bind(this)}>
            <NavLogoTransparent width='100' height='45' color='white' />
          </a>
          <div className='skillelinje' />
          <div className='tittel'><span>{t('app-headerTitle')}</span></div>
        </div>
        <div className='user'>
          {isLoggingOut
            ? <NavFrontendSpinner type='XS' />
            : <div className={classNames('mr-2', 'SAKSBEHANDLER')}>
              <Icons kind='user' />
            </div>}
          <div className='skillelinje' />
          <div className='mr-4 ml-2 align-middle name'>
            {gettingUserInfo ? t('buc:loading-gettingUserInfo')
              : username
                ? <Select className='username-select'
                  label={''} value={username} selected={username}
                  onChange={this.handleUsernameSelectRequest.bind(this)}>
                  <option value=''>{username}</option>
                  <option value='feedback'>{t('ui:giveFeedback')}</option>
                  <option value='logout'>{t('logout')}</option>
                </Select>
                : <React.Fragment>
                  <AdvarselTrekant size={16} />
                  <span className='username-span'>{t('unknown')}</span>
                </React.Fragment>
            }
          </div>
        </div>
      </header>
      {header ? <Systemtittel className='m-4'>{header}</Systemtittel> : null}
    </React.Fragment>
  }
}

InternalTopHeader.propTypes = {
  t: PT.func.isRequired,
  username: PT.string,
  actions: PT.object,
  history: PT.object,
  gettingUserInfo: PT.bool,
  header: PT.oneOfType([PT.node, PT.string])
}

const ConnectedInternalTopHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(InternalTopHeader)

ConnectedInternalTopHeader.displayName = `Connect(${getDisplayName(InternalTopHeader)})`

export default ConnectedInternalTopHeader
