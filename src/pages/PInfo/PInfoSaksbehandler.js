import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'

import 'react-datepicker/dist/react-datepicker.min.css'

import * as Nav from '../../components/ui/Nav'
import TopContainer from '../../components/ui/TopContainer/TopContainer'

import * as routes from '../../constants/routes'
import * as storageActions from '../../actions/storage'

import './PInfo.css'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    pinfo: state.pinfo,
    sakId: state.status.sakId,
    aktoerId: state.status.aktoerId,
    username: state.app.username,
    fileList: state.storage.fileList,
    isSendingPinfo: state.loading.isSendingPinfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, storageActions), dispatch) }
}

class PInfoSaksbehandler extends React.Component {
  state = {
    isReady: false
  }

  componentDidUpdate () {
    let { actions, aktoerId, fileList } = this.props

    if (aktoerId && fileList === undefined) {
      actions.listStorageFiles(aktoerId, 'varsler')
    }

    if (fileList !== undefined && !this.state.isReady) {
      this.setState({
        isReady: true
      })
    }
  }

  onForwardButtonClick () {
    const { history } = this.props
    history.push(routes.PINFO)
  }

  onInviteButtonClick () {

  }

  render () {
    const { t, location, history, fileList } = this.props
    const { isReady } = this.state

    if (!isReady) {
      return <TopContainer className='p-pInfo' history={history} location={location} header={t('pinfo:app-title')}>
        <div className='text-center'>
          <Nav.NavFrontendSpinner />
          <p className='typo-normal'>{t('ui:loading')}</p>
        </div>
      </TopContainer>
    }

    return <TopContainer className='p-pInfo' history={history} location={location} header={t('pinfo:app-title')}>

      <div className={classNames('fieldset animate', 'mb-4')}>
        Notifications:
        {fileList ? <ul>
          {fileList.map(file => {
            return <li>{file}</li>
          })}
        </ul> : null}
      </div>
      <Nav.Hovedknapp
        id='pinfo-forward-button'
        className='forwardButton mb-2 mr-3'
        onClick={this.onInviteButtonClick.bind(this)}>
        {t('Invite')}
      </Nav.Hovedknapp>

      <Nav.Hovedknapp
        id='pinfo-forward-button'
        className='forwardButton mb-2 mr-3'
        onClick={this.onForwardButtonClick.bind(this)}>
        {t('PInfo')}
      </Nav.Hovedknapp>
    </TopContainer>
  }
}

PInfoSaksbehandler.propTypes = {
  history: PT.object,
  t: PT.func,
  locale: PT.string,
  pinfo: PT.object,
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
