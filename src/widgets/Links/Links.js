import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import 'url-search-params-polyfill'

import * as Nav from '../../components/ui/Nav'
import * as constants from '../../constants/constants'
import * as routes from '../../constants/routes'
import * as statusActions from '../../actions/status'
import * as appActions from '../../actions/app'
import * as uiActions from '../../actions/ui'

const mapStateToProps = (state) => {
  return {
    userRole: state.app.userRole,
    language: state.ui.language,
    status: state.status
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions, appActions, statusActions), dispatch) }
}

class Links extends Component {
  getCreateableDocuments (status) {
    return status.docs ? status.docs
      .filter(item => { return item.navn === 'Create' })
      .sort((a, b) => { return (a.dokumentType > b.dokumentType) ? 1 : ((a.dokumentType < b.dokumentType) ? -1 : 0) })
      : []
  }

  render () {
    const { t, status, userRole } = this.props

    return <div>
      <h3 className='typo-undertittel mb-4'>{t('forms')}</h3>

      {userRole === constants.SAKSBEHANDLER
        ? <Nav.Lenkepanel  border style={{ animationDelay: '0s' }}
          className='frontPageLink caseLink' linkCreator={(props) => (
            <Link to={routes.CASE + '?sed=&buc='} {...props} />)
          } href='#'>{t('case:app-createNewCase')}</Nav.Lenkepanel>
        : null}

      {userRole === constants.SAKSBEHANDLER
        ? <Nav.Lenkepanel  border style={{ animationDelay: '0.1s' }} className='frontPageLink pSelvLink' linkCreator={(props) => (
          <Link to={routes.PSELV} {...props} />)
        } href='#'>{t('pselv:app-startPselv')}</Nav.Lenkepanel>
        : null}

      <Nav.Lenkepanel  border style={{ animationDelay: '0.2s' }} className='frontPageLink pInfoLink' linkCreator={(props) => (
        <Link to={routes.PINFO} {...props} />)
      } href='#'>{t('pinfo:app-startPinfo')}</Nav.Lenkepanel>
      {status ? this.getCreateableDocuments(status).map(item => <Nav.Lenkepanel
        className={'frontPageLink ' + item.dokumentType + 'Link'}
        key={item.dokumentType}
        linkCreator={(props) => (
          <Link to={routes.ROOT + item.dokumentType} {...props} />)
        } href='#'>{t(item.dokumentType + ':app-start' + item.dokumentType)}
      </Nav.Lenkepanel>) : null}
      <Nav.Lenkepanel border style={{ animationDelay: '0.3s' }}
        className='frontPageLink p4000Link' linkCreator={(props) => (
          <Link to={routes.P4000} {...props} />)
        } href='#'>{t('p4000:app-startP4000')}</Nav.Lenkepanel>
    </div>
  }
}

Links.propTypes = {
  t: PT.func.isRequired,
  actions: PT.object.isRequired,
  gettingStatus: PT.bool,
  status: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(Links)
)
