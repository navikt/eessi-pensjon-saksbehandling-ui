import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'
import _ from 'lodash'

import 'react-datepicker/dist/react-datepicker.min.css'

import * as Nav from '../../components/ui/Nav'
import Icons from '../../components/ui/Icons'
import TopContainer from '../../components/ui/TopContainer/TopContainer'
import Psycho from '../../components/ui/Psycho/Psycho'

import * as storageActions from '../../actions/storage'
import * as pinfoActions from '../../actions/pinfo_saksbehandler'

import './PInfo.css'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    sakId: state.status.sakId,
    aktoerId: state.status.aktoerId,
    fileList: state.storage.fileList,
    file: state.storage.file,
    isSendingPinfo: state.loading.isSendingPinfo,
    isInvitingPinfo: state.loading.isInvitingPinfo,
    gettingPinfoSaktype: state.loading.gettingPinfoSaktype,
    invite: state.pinfoSaksbehandler.invite,
    sakType: state.pinfoSaksbehandler.sakType
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
    let { actions, aktoerId, sakId, fileList } = this.props
    if (aktoerId && sakId && fileList === undefined) {
      actions.listStorageFiles(aktoerId, 'varsler___' + sakId)
      actions.getSakType({ sakId: sakId, aktoerId: aktoerId })
    }
    if (!aktoerId || !sakId) {
      this.setState({
        noParams: true
      })
    }
  }

  componentDidUpdate () {
    let { fileList, actions, file, aktoerId, sakId } = this.props

    if (fileList !== undefined && this.state.fileList === undefined) {
      fileList.map(file => {
        actions.getStorageFileWithNoNotification({
          userId: aktoerId,
          namespace: 'varsler',
          file: sakId + '___' + file
        })
        return file
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

  refresh () {
    let { actions, aktoerId, sakId } = this.props

    if (aktoerId && sakId) {
      this.setState({
        fileList: undefined,
        files: {}
      }, () => {
        actions.listStorageFiles(aktoerId, 'varsler___' + sakId)
      })
    }
  }

  onInviteButtonClick () {
    let { actions, aktoerId, sakId } = this.props
    actions.sendInvite({
      aktoerId: aktoerId,
      sakId: sakId
    })
  }

  render () {
    const { t, location, history, aktoerId, isInvitingPinfo, gettingPinfoSaktype, invite, sakType } = this.props
    const { isReady, noParams, files } = this.state

    if (noParams) {
      return <TopContainer className='p-pInfo p-pInfoSaksbehandler' history={history} location={location} header={t('pinfo:app-title')}>
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

    return <TopContainer className='p-pInfo p-pInfoSaksbehandler' history={history} location={location}>
      <Nav.Row>
        <div className='col-md-12'>
          <div className={classNames('fieldset', 'animate', 'mt-4', 'mb-4')}>
            <Nav.Undertittel>{t('pinfo:sb-send-notification-title')}</Nav.Undertittel>
            {!_.isEmpty(sakType) ? <Nav.Undertittel>{t('pinfo:sb-saktype', sakType)}</Nav.Undertittel> : null}
            {gettingPinfoSaktype ? <div>
              <Nav.NavFrontendSpinner />
              <p className='typo-normal'>{t('ui:loading')}</p>
            </div> : null}
            <Nav.Undertekst className='mt-3 mb-3'>{t('pinfo:sb-send-notification-description', { user: aktoerId })}</Nav.Undertekst>
            <Nav.Hovedknapp
              id='pinfo-forward-button'
              className='forwardButton mb-2 mr-3'
              disabled={isInvitingPinfo}
              spinner={isInvitingPinfo}
              onClick={this.onInviteButtonClick.bind(this)}>
              {isInvitingPinfo ? t('sending') : t('pinfo:sb-send-notification-button')}
            </Nav.Hovedknapp>
            { !_.isEmpty(invite) ? <Nav.AlertStripe
              className='mt-4 mb-4' type={invite.status === 'ERROR' ? 'advarsel' : 'suksess'}>
              {t(invite.message)}
            </Nav.AlertStripe> : null}
          </div>
        </div>
        <div className='col-md-12'>
          <div className={classNames('fieldset', 'animate', 'mt-4', 'mb-4')}>
            <div className='notification-title'>
              <Nav.Undertittel>{t('pinfo:sb-sent-notifications-title')}</Nav.Undertittel>
              <div title={t('refresh')} className={classNames('refresh', { rotating: !isReady })}>
                {isReady ? <a href='#refresh' onClick={this.refresh.bind(this)}>
                  <Icons kind='refresh' />
                </a> : <Icons kind='refresh' />}
              </div>
            </div>

            {!isReady ? <div className='text-center' style={{ paddingTop: '3rem' }}>
              <Nav.NavFrontendSpinner />
              <p className='typo-normal'>{t('ui:loading')}</p>
            </div>
              : <table className='w-100 mt-4'>
                <thead>
                  <tr style={{ borderBottom: '1px solid lightgrey' }}>
                    <th />
                    <th>{t('document')}</th>
                    <th>{t('sender')}</th>
                    <th>{t('date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {files ? Object.keys(files)
                    .sort((a, b) => files[b].timestamp.localeCompare(files[a].timestamp))
                    .map((file, index) => {
                      let content = files[file]
                      return <tr className='slideAnimate' style={{ animationDelay: index * 0.03 + 's' }} key={file}>
                        <td><Icons kind='nav-message-sent' /></td>
                        <td>{content.tittel || file}</td>
                        <td>{content.fulltnavn || t('unknown')}</td>
                        <td>{content.timestamp ? new Date(content.timestamp).toDateString() : t('unknown')}</td>
                      </tr>
                    }) : null}
                </tbody>
              </table>}
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
  withTranslation()(PInfoSaksbehandler)
)
