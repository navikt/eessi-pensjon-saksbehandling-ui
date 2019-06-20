import React from 'react'
import { connect, bindActionCreators } from 'store'
import PT from 'prop-types'
import _ from 'lodash'

import * as Nav from '../../components/ui/Nav'
import * as pinfoActions from '../../actions/pinfo'

import '../PInfo/PInfo.css'

const mapStateToProps = (state) => {
  return {
    sakId: state.app.params.sakId,
    aktoerId: state.app.params.aktoerId,
    sakType: state.app.params.sakType,
    isSendingPinfo: state.loading.isSendingPinfo,
    isInvitingPinfo: state.loading.isInvitingPinfo,
    invite: state.pinfo.invite
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions), dispatch) }
}

class VarslerPanel extends React.Component {
  state = {
    noParams: false
  }

  componentDidMount () {
    let { aktoerId, sakId, sakType } = this.props
    if (!aktoerId || !sakId || !sakType) {
      this.setState({
        noParams: true
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
    const { t, aktoerId, isInvitingPinfo, invite, sakId, sakType } = this.props
    const { noParams } = this.state

    if (noParams) {
      return <div className='text-center'>
        <Nav.Normaltekst>{t('pinfo:error-noParams')}</Nav.Normaltekst>
      </div>
    }

    return <React.Fragment>
      <Nav.Undertittel>{t('pinfo:sb-send-notification-title')}</Nav.Undertittel>
      <div className='mt-3' style={{ columns: 3 }}>
        <div><label class='skjemaelement__label d-inline-block'>{t('pinfo:sb-sakId')}</label>: {sakId}</div>
        <div><label class='skjemaelement__label d-inline-block'>{t('ui:aktoerId')}</label>: {aktoerId}</div>
        <div><label class='skjemaelement__label d-inline-block'>{t('pinfo:sb-sakType')}</label>: {sakType}</div>
      </div>
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
    </React.Fragment>
  }
}

VarslerPanel.propTypes = {
  t: PT.func,
  actions: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VarslerPanel)
