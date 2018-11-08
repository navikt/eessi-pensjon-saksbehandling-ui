import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { withCookies, Cookies } from 'react-cookie'
import classNames from 'classnames'

import Icons from '../Icons'
import * as Nav from '../Nav'

import * as constants from '../../../constants/constants'

import * as navLogo from '../../../resources/images/nav.svg'
import * as appActions from '../../../actions/app'
import * as uiActions from '../../../actions/ui'

import './TopHeader.css'

const mapStateToProps = (state) => {
  return {
    username: state.app.username,
    userRole: state.app.userRole,
    gettingUserInfo: state.loading.gettingUserInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions, appActions), dispatch) }
}

class TopHeader extends Component {
  state = {
    isHovering: false
  }

  componentDidMount () {
    const { username, actions } = this.props

    if (!username) {
      actions.getUserInfo()
    }
  }

  onHandleMouseEnter () {
    this.setState({ isHovering: true })
  }

  onHandleMouseLeave () {
    this.setState({ isHovering: false })
  }

  onLogoClick () {
    const { actions, userRole } = this.props

    if (userRole === constants.SAKSBEHANDLER) {
      actions.toggleDrawerEnable()
    }
  }

  onUsernameSelectRequest (e) {
    const { actions, history, cookies } = this.props

    if (e.target.value === 'logout') {
      cookies.remove('eessipensjon-idtoken-public', { path: '/' })//= ;path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
      actions.clearData()
      actions.logout()
      history.push('/')
    }
  }

  render () {
    let { t, username, userRole, gettingUserInfo } = this.props

    return <header className='c-ui-topHeader'>
      <div className='brand'>
        <a href='#toggleDrawerEnable' onClick={this.onLogoClick.bind(this)}>
          <img className='logo' src={navLogo} alt='To personer på NAV kontor' />
        </a>
        <div className='skillelinje' />
        <div className='tittel'><span>{t('app-headerTitle')}</span></div>
      </div>
      <div className='user'>
        {userRole ? <div title={userRole} className={classNames('mr-2', userRole)}><Icons kind='user' /></div> : null}
        <div className='mr-4 name'
          onMouseEnter={this.onHandleMouseEnter.bind(this)}
          onMouseLeave={this.onHandleMouseLeave.bind(this)}>
          {gettingUserInfo ? t('case:loading-gettingUserInfo')
            : username ? this.state.isHovering
              ? <Nav.Select className='username-select' label={''} value={username} onChange={this.onUsernameSelectRequest.bind(this)}>
                <option value=''>{username}</option>
                <option value='logout'>{t('logout')}</option>
              </Nav.Select>
              : <span className='username-span'>{username}</span>
              : <React.Fragment>
                <Nav.Ikon size={16} kind='advarsel-trekant' />
                <span className='ml-2'>{t('unknown')}</span>
              </React.Fragment>
          }
        </div>
      </div>
    </header>
  }
}

TopHeader.propTypes = {
  t: PT.func.isRequired,
  username: PT.string,
  userRole: PT.string,
  cookies: PT.instanceOf(Cookies),
  actions: PT.object,
  history: PT.object,
  gettingUserInfo: PT.bool
}

export default withCookies(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    withNamespaces()(TopHeader)
  )
)
