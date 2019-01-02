import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'

import 'react-datepicker/dist/react-datepicker.min.css'

import * as Nav from '../../components/ui/Nav'
import Icons from '../../components/ui/Icons'
import TopContainer from '../../components/ui/TopContainer/TopContainer'

import * as storageActions from '../../actions/storage'
import * as pinfoActions from '../../actions/pinfo'

import './PInfo.css'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    saksId: state.status.saksId,
    aktoerId: state.status.aktoerId,
    username: state.app.username,
    fileList: state.storage.fileList,
    isSendingPinfo: state.loading.isSendingPinfo,
    isInvitingPinfo: state.loading.isInvitingPinfo,
    message: state.pinfoSaksbehandler.message,
    status: state.pinfoSaksbehandler.status
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions, storageActions), dispatch) }
}

class PInfoSaksbehandler extends React.Component {
  state = {
    isReady: false,
    noParams: false
  }

  componentDidMount () {
    let { actions, aktoerId, saksId, fileList } = this.props

    if (aktoerId && fileList === undefined) {
      actions.listStorageFiles(aktoerId, 'varsler')
    }
    if (!aktoerId || !saksId) {
      this.setState({
        noParams: true
      })
    }
  }

  componentDidUpdate () {
    let { fileList } = this.props

    if (fileList !== undefined && !this.state.isReady) {
      this.setState({
        isReady: true
      })
    }
  }

  onInviteButtonClick () {
    let { actions, aktoerId, saksId } = this.props
    actions.sendInvite({
      aktoerId: aktoerId,
      saksId: saksId
    })
  }

  render () {
    const { t, location, history, fileList, username, isInvitingPinfo, message, status } = this.props
    const { isReady, noParams } = this.state

    if (noParams) {
      return <TopContainer className='p-pInfo' history={history} location={location} header={t('pinfo:app-title')}>
        <div className='text-center'>
          <p className='typo-normal'>{'Please provide saksId/saksNr or fnr/aktoerId'}</p>
        </div>
      </TopContainer>
    }

    if (!isReady) {
      return <TopContainer className='p-pInfo' history={history} location={location} header={t('pinfo:app-title')}>
        <div className='text-center'>
          <Nav.NavFrontendSpinner />
          <p className='typo-normal'>{t('ui:loading')}</p>
        </div>
      </TopContainer>
    }

    return <TopContainer className='p-pInfo' history={history} location={location}>
      <Nav.Row>
        <div className='col-md-6'>
          <div className={classNames('fieldset', 'animate', 'mt-4', 'mb-4')}>
            <Nav.Undertittel>{t('pinfo:sb-send-notification-title')}</Nav.Undertittel>
            <Nav.Undertekst className='mt-3 mb-3'>{t('pinfo:sb-send-notification-description', { user: username })}</Nav.Undertekst>
            <Nav.Hovedknapp
              id='pinfo-forward-button'
              className='forwardButton mb-2 mr-3'
              disabled={isInvitingPinfo}
              spinner={isInvitingPinfo}
              onClick={this.onInviteButtonClick.bind(this)}>
              {isInvitingPinfo ? t('sending') : t('pinfo:sb-send-notification-button')}
            </Nav.Hovedknapp>
            { message ? <Nav.AlertStripe className='mt-4 mb-4' type={status === 'ERROR' ? 'advarsel' : 'suksess'}>
              {t(message)}
            </Nav.AlertStripe> : null}
          </div>
        </div>
        <div className='col-md-6'>
          <div className={classNames('fieldset', 'animate', 'mt-4', 'mb-4')}>
            <Nav.Undertittel>{t('pinfo:sb-sent-notifications-title')}</Nav.Undertittel>
            <table className='w-100 mt-4'>
              <thead>
                <tr style={{ borderBottom: '1px solid lightgrey' }}>
                  <th />
                  <th>{t('document')}</th>
                  <th>{t('sender')}</th>
                  <th>{t('date')}</th>
                </tr>
              </thead>
              <tbody>
                {fileList ? fileList.map(file => {
                  return <tr key={file}>
                    <td><Icons kind='nav-message-sent' /></td>
                    <td><a href='#'>{file}</a></td>
                    <td>{t('unknown')}</td>
                    <td>{t('unknown')}</td>
                  </tr>
                }) : null}
              </tbody>
            </table>
          </div>
        </div>
      </Nav.Row>
    </TopContainer>
  }
}

PInfoSaksbehandler.propTypes = {
  history: PT.object,
  t: PT.func,
  locale: PT.string,
  step: PT.number,
  referrer: PT.string,
  actions: PT.object,
  location: PT.object.isRequired,
  status: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(PInfoSaksbehandler)
)
