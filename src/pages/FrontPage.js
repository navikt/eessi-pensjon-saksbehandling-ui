import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { translate } from 'react-i18next'
import _ from 'lodash'
import 'url-search-params-polyfill'

import LanguageSelector from '../components/ui/LanguageSelector'
import TopContainer from '../components/ui/TopContainer/TopContainer'
import * as Nav from '../components/ui/Nav'
import DocumentStatus from '../components/ui/DocumentStatus/DocumentStatus'
import EmptyDrawer from '../components/drawer/Empty'

import * as constants from '../constants/constants'
import * as routes from '../constants/routes'
import * as statusActions from '../actions/status'
import * as appActions from '../actions/app'
import * as uiActions from '../actions/ui'

import './FrontPage.css'

const mapStateToProps = (state) => {
  return {
    userRole: state.app.userRole,
    language: state.ui.language,
    gettingStatus: state.loading.gettingStatus,
    status: state.status
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions, appActions, statusActions), dispatch) }
}

class FrontPage extends Component {
  componentDidMount () {
    const { actions } = this.props

    actions.addToBreadcrumbs({
      label: 'ui:home',
      url: routes.ROOT
    })
  }

  getCreateableDocuments (status) {
    return status.docs ? status.docs
      .filter(item => { return item.navn === 'Create' })
      .sort((a, b) => { return (a.dokumentType > b.dokumentType) ? 1 : ((a.dokumentType < b.dokumentType) ? -1 : 0) })
      : []
  }

  render () {
    const { t, language, gettingStatus, gettingRinaCase, history, status, location, userRole } = this.props

    return <TopContainer className='frontPage'
      language={language} history={history} location={location}
      sideContent={<EmptyDrawer />}>
      <Nav.Row>
        <div className='col-md-8'>
          <h1 className='appTitle'>{t('app-pageTitle')}</h1>
          <h4 className='appDescription'>{t('app-pageDescription')}</h4>
        </div>
        <div className='col-md-4 text-right m-auto'>
          <LanguageSelector className='mr-4' />
        </div>
      </Nav.Row>
      <div className='fieldset animate mb-4'>
        {_.isEmpty(status.documents) ? (gettingStatus || gettingRinaCase ? <div>
          <h4 className='mb-4'>{t('status')}</h4>
          <div className='w-100 text-center' style={{ minHeight: '110px' }}>
            <Nav.NavFrontendSpinner />
            <p>{gettingStatus ? t('loading-gettingStatus') : t('loading-gettingRinaCase')}</p>
          </div>
        </div> : null) : <div className='mb-4'>
          <h4 className='mb-4'>{t('status')}</h4>
          <DocumentStatus history={history} />
        </div> }
        <h4 className='mb-4'>{t('forms')}</h4>

        {userRole === constants.SAKSBEHANDLER
          ? <Nav.Lenkepanel style={{ animationDelay: '0s' }}
            className='frontPageLink caseLink' linkCreator={(props) => (
              <Link to={routes.CASE_START + '?sed=&buc='} {...props} />)
            } href='#'>{t('case:app-createNewCase')}</Nav.Lenkepanel>
          : null}

        {userRole === constants.SAKSBEHANDLER
          ? <Nav.Lenkepanel style={{ animationDelay: '0.1s' }} className='frontPageLink pSelvLink' linkCreator={(props) => (
            <Link to={routes.PSELV} {...props} />)
          } href='#'>{t('pselv:app-startPselv')}</Nav.Lenkepanel>
          : null}

        <Nav.Lenkepanel style={{ animationDelay: '0.2s' }} className='frontPageLink pInfoLink' linkCreator={(props) => (
          <Link to={routes.PINFO} {...props} />)
        } href='#'>{t('pinfo:app-startPinfo')}</Nav.Lenkepanel>
        {status ? this.getCreateableDocuments(status).map(item => <Nav.Lenkepanel
          className={'frontPageLink ' + item.dokumentType + 'Link'}
          key={item.dokumentType}
          linkCreator={(props) => (
            <Link to={routes.ROOT + item.dokumentType} {...props} />)
          } href='#'>{t(item.dokumentType + ':app-start' + item.dokumentType)}
        </Nav.Lenkepanel>) : null}
        <Nav.Lenkepanel style={{ animationDelay: '0.3s' }}
          className='frontPageLink p4000Link' linkCreator={(props) => (
            <Link to={routes.P4000} {...props} />)
          } href='#'>{t('p4000:app-startP4000')}</Nav.Lenkepanel>
        <h4 className='mt-4 mb-4'>{t('tools')}</h4>
        <Nav.Lenkepanel style={{ animationDelay: '0.4s' }} className='frontPageLink pdfLink' linkCreator={(props) => (
          <Link to={routes.PDF_SELECT} {...props} />)
        } href='#'>{t('pdf:app-createPdf')}</Nav.Lenkepanel>
      </div>
    </TopContainer>
  }
}

FrontPage.propTypes = {
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
  translate()(FrontPage)
)
