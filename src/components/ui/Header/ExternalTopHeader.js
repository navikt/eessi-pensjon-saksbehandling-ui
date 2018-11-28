import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { withCookies, Cookies } from 'react-cookie'
import classNames from 'classnames'

import LogoHeader from './LogoHeader'
import Icons from '../Icons'
import * as Nav from '../Nav'

import * as appActions from '../../../actions/app'
import * as uiActions from '../../../actions/ui'

import '../app-decorator-v4.css'
import '../bundle.css'
import './ExternalTopHeader.css'

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

class ExternalTopHeader extends Component {


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
        <LogoHeader/>
      </header>
    </div>
  }
}

ExternalTopHeader.propTypes = {
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
    withNamespaces()(ExternalTopHeader)
  )
)
