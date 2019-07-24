import React, { Component } from 'react'
import { connect } from 'store'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import 'url-search-params-polyfill'

import Psycho from '../../components/Psycho/Psycho'
import TopContainer from '../../components/TopContainer/TopContainer'
import * as Nav from '../../components/Nav'

import * as routes from '../../constants/routes'

import './FirstPage.css'

const mapStateToProps = (state) => {
  return {
    username: state.app.username,
    loggedIn: state.app.loggedIn,
    gettingUserInfo: state.loading.gettingUserInfo,
    isLoggingIn: state.loading.isLoggingIn,
    language: state.ui.language
  }
}

class FirstPage extends Component {
  handleForwardButtonClick () {
    const { history } = this.props
    history.push({
      pathname: routes.PINFO,
      search: window.location.search
    })
  }

  render () {
    const { t, history } = this.props

    return <TopContainer
      className='p-firstPage'
      t={t}
      history={history}
      header={<span>{t('pinfo:app-title')}</span>}>
      <div className='content container pt-4'>
        <div className='col-sm-3 col-12' />
        <div className='col-12'>
          <div className='psycho text-center mt-3 mb-4'>
            <Psycho id='psycho' />
          </div>
          <div dangerouslySetInnerHTML={{ __html: t('pinfo:psycho-description-saksbehandler') }} />
          <div className='text-center mt-3 mb-4'>
            <Nav.Hovedknapp
              id='pinfo-firstPage-forwardButton'
              className='mt-3 forwardButton'
              onClick={this.handleForwardButtonClick.bind(this)}>{t('continue')}
            </Nav.Hovedknapp>
          </div>
        </div>
        <div className='col-sm-3 col-12' />
      </div>
    </TopContainer>
  }
}

FirstPage.propTypes = {
  language: PT.string,
  location: PT.object.isRequired,
  t: PT.func.isRequired,
  gettingStatus: PT.bool,
  status: PT.object,
  history: PT.object.isRequired
}

const ConnectedFirstPage = connect(
  mapStateToProps,
  () => {}
)(
  withTranslation()(FirstPage)
)

export default ConnectedFirstPage
