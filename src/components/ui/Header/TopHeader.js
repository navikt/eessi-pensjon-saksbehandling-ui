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

import '../app-decorator-v4.css'
import '../bundle.css'
import './TopHeader.css'

const mapStateToProps = (state) => {
  return {
    username: state.app.username,
    userRole: state.app.userRole,
    gettingUserInfo: state.loading.gettingUserInfo,
    isLoggingOut: state.loading.isLoggingOut
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions, appActions), dispatch) }
}

class TopHeader extends Component {


  onLogout () {
    const { actions, cookies } = this.props

    cookies.remove('eessipensjon-idtoken-public', { path: '/' })
    actions.clearData()
    actions.logout()
  }

   render () {

    let { username } = this.props

    return <div className='hodefot'>
      <header className='siteheader' role='banner'>
        <div className='site-coltrols-toolbar site-controls-toolbar'>
            <div className='navbar container'>
              <div className='col-md-12'>
                <div className='settings'>
                  <ul className='nav' style={{justifyContent: 'center'}}>
                  <li id='text-size-accessibility' tabIndex='0'>
                  <span className='link-btn' aria-label='Hold Ctrl-tasten nede (Cmd-tasten på Mac). Trykk samtidig på + for å forstørre eller - for å forminske.'>Skriftstørrelse</span><div className='text-size-tooltip'><p>Hold Ctrl-tasten nede (Cmd-tasten på Mac). Trykk samtidig på + for å forstørre eller - for å forminske.</p><span className='arrow'></span></div></li>
                  </ul>
                </div>
                <div className='login-container'>
                  <div id='login-details' className=''>
                    <span id='name-container'>
                      <img id='idporten-ikon-innlogging' alt='Innlogget via ID-porten' src='https://appres.nav.no/_public/beta.nav.no/built-navno/img/navno/gfx/icons/idporten_ikon.png?_ts=164657e6e70'/>
                      <span id='name'>{username}</span>
                    </span>
                  </div>
                  <div id='auth-btns' className=' idporten'>
                    <a id='logout' className='btn-auth knapp mini hoved btn-logout' href='https://loginservice-q.nav.no/slo' aria-hidden='false'>Logg ut</a>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div className='sitelogo sitelogo-large'>
          <div>
            <a href='https://www.nav.no' title='Hjem' data-ga='Header/Logo'>
              <img src='https://appres.nav.no/_public/beta.nav.no/images/logo.png?_ts=1512923c9b0' alt='NAV-logo'/>
            </a>
          </div>
        </div>
        <div className='sitelogo sitelogo-small'>
          <a href='https://www.nav.no' title='Hjem'>
            <img src='https://appres.nav.no/_public/beta.nav.no/images/logo.png?_ts=1512923c9b0' alt='NAV-logo'/>
          </a>
        </div>
      </header>
    </div>
  }

  render2 () {
    let { t, username, userRole, gettingUserInfo, isLoggingOut } = this.props

    return <header className='c-ui-topHeader'>

      <div className='user'>
        {userRole ? <div title={userRole} className={classNames('mr-2', userRole)}><Icons kind='user' /></div>
          : isLoggingOut ? <Nav.NavFrontendSpinner type='XS' /> : null}
        <div className='mr-4 name'
          onMouseEnter={this.onHandleMouseEnter.bind(this, 'div')}
          onMouseLeave={this.onHandleMouseLeave.bind(this, 'div')}>
          {gettingUserInfo ? t('case:loading-gettingUserInfo')
            : username
              ? <React.Fragment>
                <div>
                  <div className='col-sm-6'>
                    <span id='pensjon-utland-span-username' className='username-span'>{username}</span>
                  </div>
                  <div className='col-sm-6'>
                    <a href='https://loginservice-q.nav.no/slo' class='btn btn-secondary btn-sm' role='button'>{t('logout')}</a>
                  </div>
                </div>
              </React.Fragment>
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
