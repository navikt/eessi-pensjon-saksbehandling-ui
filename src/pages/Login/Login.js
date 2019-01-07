import React, { Component } from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'

import TopContainer from '../../components/ui/TopContainer/TopContainer'
import Psycho from '../../components/ui/Psycho/Psycho'
import * as Nav from '../../components/ui/Nav'
import * as appActions from '../../actions/app'

import './Login.css'

const mapStateToProps = (state) => {
  return {
    loggedIn: state.app.loggedIn,
    gettingUserInfo: state.loading.gettingUserInfo,
    isLoggingIn: state.loading.isLoggingIn
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, appActions), dispatch) }
}

class Login extends Component {


  handleLoginRequest () {
    const { actions } = this.props
    actions.login()
  }

  render () {
    const { t, history, location, type, isLoggingIn, gettingUserInfo } = this.props

    return <TopContainer className={classNames('p-login')}
      history={history} location={location} header={t('app-headerTitle')}>
      <div className='col-md-12 text-center'>
        <div className='psycho mt-3 mb-4'>
          <Psycho id='psycho' />
        </div>
        <Nav.Hovedknapp
              className='mt-3 loginButton'
              onClick={this.handleLoginRequest.bind(this)}
              disabled={isLoggingIn || gettingUserInfo}
              spinner={isLoggingIn || gettingUserInfo}>
              {isLoggingIn ? t('ui:authenticating')
                : gettingUserInfo ? t('loading') : t('login')}
            </Nav.Hovedknapp>

      </div>
    </TopContainer>
  }
}

Login.propTypes = {
  t: PT.func.isRequired,
  type: PT.string.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces()(Login))
