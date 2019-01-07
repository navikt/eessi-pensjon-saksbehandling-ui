import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'
import _ from 'lodash'

import 'react-datepicker/dist/react-datepicker.min.css'

import * as Nav from '../../components/ui/Nav'
import Icons from '../../components/ui/Icons'
import TopContainer from '../../components/ui/TopContainer/TopContainer'
import Psycho from '../../components/ui/Psycho/Psycho'

import * as storageActions from '../../actions/storage'
import * as pinfoActions from '../../actions/pinfo'

import './PInfo.css'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    saksId: state.status.saksId,
    aktoerId: state.status.aktoerId,
    fileList: state.storage.fileList,
    file: state.storage.file,
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
    noParams: false,
    fileList: undefined,
    files: {}
  }

  componentDidMount () {
    let { actions, aktoerId, saksId, fileList } = this.props

    if (aktoerId && saksId && fileList === undefined) {
      actions.listStorageFiles(aktoerId, 'varsler___' + saksId)
    }

    if (!aktoerId || !saksId) {
      this.setState({
        noParams: true
      })
    }
  }

  componentDidUpdate () {
    let { fileList, actions, file, aktoerId, saksId } = this.props

    if (fileList !== undefined && this.state.fileList === undefined) {
      fileList.map(file => {
        actions.getStorageFile({
          userId: aktoerId,
          namespace: 'varsler',
          file: saksId + '___' + file,
          context: { successAlert: false }
        })
      })
      this.setState({
        isReady: _.isEmpty(fileList),
        fileList: fileList
      })
    }

    if (file !== undefined && !this.state.isReady) {
      let files = _.cloneDeep(this.state.files)
      let key = file.timestamp + '.json'
      if (!files.hasOwnProperty(key)) {
        files[key] = file
        let allFilesDone = Object.keys(files).length === fileList.length
        this.setState({
          files: files,
          isReady: allFilesDone
        })
      }
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
    const { t, location, history, fileList, aktoerId, isInvitingPinfo, message, status } = this.props
    const { isReady, noParams, files } = this.state

    if (noParams) {
      return <TopContainer className='p-pInfo' history={history} location={location} header={t('pinfo:app-title')}>
        <div className='content container text-center pt-4'>
          <div className='psycho mt-3 mb-4' style={{ height: '110px' }}>
            <Psycho type='trist' id='psycho' />
          </div>
          <div className='text-center'>
            <Nav.Normaltekst>{t('pinfo:error-noParams')}</Nav.Normaltekst>
          </div>
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
        <div className='col-md-12'>
          <div className={classNames('fieldset', 'animate', 'mt-4', 'mb-4')}>
            <Nav.Undertittel>{t('pinfo:sb-send-notification-title')}</Nav.Undertittel>
            <Nav.Undertekst className='mt-3 mb-3'>{t('pinfo:sb-send-notification-description', { user: aktoerId })}</Nav.Undertekst>
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
        <div className='col-md-12'>
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
                {files ? Object.keys(files).map(file => {
                  let content = files[file]
                  return <tr key={file}>
                    <td><Icons kind='nav-message-sent' /></td>
                    <td>{content.tittel || file}</td>
                    <td>{content.fulltNavn || t('unknown')}</td>
                    <td>{content.timestamp ? new Date(content.timestamp).toDateString() : t('unknown')}</td>
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
