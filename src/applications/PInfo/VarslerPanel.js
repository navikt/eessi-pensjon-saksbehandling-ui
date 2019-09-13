import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { AlertStripe, Hovedknapp, Undertekst, Undertittel } from 'components/Nav'

const VarslerPanel = (props) => {
  const { actions, aktoerId, isInvitingPinfo, invite, sakId, sakType, t } = props

  const onInviteButtonClick = () => {
    actions.sendInvite({
      aktoerId: aktoerId,
      sakId: sakId
    })
  }

  return (
    <>
      <Undertittel>{t('pinfo:sb-send-notification-title')}</Undertittel>
      <div className='mt-3' style={{ columns: 3 }}>
        <div><label className='skjemaelement__label d-inline-block'>{t('pinfo:sb-sakId')}</label>: {sakId}</div>
        <div><label className='skjemaelement__label d-inline-block'>{t('ui:aktoerId')}</label>: {aktoerId}</div>
        <div><label className='skjemaelement__label d-inline-block'>{t('pinfo:sb-sakType')}</label>: {sakType}</div>
      </div>
      <Undertekst className='mt-3 mb-3'>{t('pinfo:sb-send-notification-description', { user: aktoerId })}</Undertekst>
      <Hovedknapp
        id='pinfo-forward-button'
        className='forwardButton mb-2 mr-3'
        disabled={isInvitingPinfo}
        spinner={isInvitingPinfo}
        onClick={onInviteButtonClick}
      >
        {isInvitingPinfo ? t('sending') : t('pinfo:sb-send-notification-button')}
      </Hovedknapp>
      {!_.isEmpty(invite) ? (
        <AlertStripe
          className='mt-4 mb-4' type={invite.status === 'ERROR' ? 'advarsel' : 'suksess'}
        >
          {t(invite.message)}
        </AlertStripe>
      ) : null}
    </>
  )
}

VarslerPanel.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  isInvitingPinfo: PT.bool,
  invite: PT.object,
  sakId: PT.string,
  sakType: PT.string,
  t: PT.func.isRequired
}

export default VarslerPanel
