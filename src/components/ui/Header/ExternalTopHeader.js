import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'

import LogoHeader from './LogoHeader'

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
  changeLanguage (lang, e) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    let { actions } = this.props

    actions.changeLanguage(lang)
  }

  changeContrast () {
    let { actions } = this.props
    actions.toggleHighContrast()
  }

  onLogout () {
    const { actions } = this.props

    actions.clearData()
    actions.logout()
  }

  render () {
    let { t, username, header } = this.props

    return <div className='c-ui-topheader hodefot'>
      <header className='siteheader' role='banner'>
        <div className='site-coltrols-toolbar site-controls-toolbar'>
          <div className='navbar container'>
            <div className='col-md-12'>
              <div className='settings'>
                <ul className='nav' style={{ justifyContent: 'center' }}>
                  <li className='dropdown'>
                    <button type='button' className='link-btn dropdown-toggle' data-toggle='dropdown'>
                      {t('language')}
                    </button>
                    <ul className='dropdown-menu hidden'>
                      <li className='active'>
                        <a href='#language' title={'Norsk (Globalt språkvalg)'}
                          onClick={this.changeLanguage.bind(this, 'no')}>{'Norsk'}</a>
                      </li>
                      <li>
                        <a href='#language' title={'English (Globalt språkvalg)'}
                          onClick={this.changeLanguage.bind(this, 'en')}>{'English'}</a>
                      </li>
                    </ul>
                  </li>
                  <li id='high-contrast'>
                    <button type='button' class='link-btn' onClick={this.changeContrast.bind(this)}>{t('highContrast')}</button>
                  </li>
                  <li id='text-size-accessibility'>
                    <span className='link-btn' aria-label='Hold Ctrl-tasten nede (Cmd-tasten på Mac). Trykk samtidig på + for å forstørre eller - for å forminske.'>Skriftstørrelse</span><div className='text-size-tooltip'><p>Hold Ctrl-tasten nede (Cmd-tasten på Mac). Trykk samtidig på + for å forstørre eller - for å forminske.</p><span className='arrow' /></div></li>
                </ul>
              </div>
              <div className='login-container'>
                <div id='login-details' className=''>
                  <span id='name-container'>
                    <img id='idporten-ikon-innlogging' alt='Innlogget via ID-porten' src='https://appres.nav.no/_public/beta.nav.no/built-navno/img/navno/gfx/icons/idporten_ikon.png?_ts=164657e6e70' />
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
        <LogoHeader />
        <div className='banner'>
          <h1 className='typo-undertittel m-0 pt-4 pb-4 text-center appTitle'>{header}</h1>
        </div>
      </header>
    </div>
  }
}

ExternalTopHeader.propTypes = {
  t: PT.func.isRequired,
  username: PT.string,
  userRole: PT.string,
  actions: PT.object,
  history: PT.object,
  gettingUserInfo: PT.bool
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(ExternalTopHeader)
)
