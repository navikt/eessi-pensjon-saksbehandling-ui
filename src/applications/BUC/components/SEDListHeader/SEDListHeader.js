import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import moment from 'moment'

import { Icons, Nav } from 'eessi-pensjon-ui'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import './SEDListHeader.css'

const SEDListHeader = ({ border = 'none', buc, className, institutionNames, locale, onSEDNew, sed, followUpSeds, t }) => {
  const institutionSenderList = sed.participants ? sed.participants
    .filter(participant => participant.role === 'Sender')
    .map(participant => {
      return {
        country: participant.organisation.countryCode,
        institution: participant.organisation.name
      }
    }) : []

  const institutionReceiverList = sed.participants ? sed.participants
    .filter(participant => participant.role === 'Receiver')
    .map(participant => {
      return {
        country: participant.organisation.countryCode,
        institution: participant.organisation.name
      }
    }) : []

  const sedLabel = getBucTypeLabel({
    t: t,
    type: sed.type,
    locale: locale
  })

  return (
    <Nav.PanelBase
      className={classNames('a-buc-c-sedheader', 'w-100', 'p-0', className)}
    >
      <div className={classNames('a-buc-c-sedheader__content pt-2 pb-2', 'a-buc-c-sedheader__border-' + border)}>
        <div className='a-buc-c-sedheader__column a-buc-c-sedheader__name col-4'>
          <Nav.Element>{sed.type}{sedLabel ? ' - ' + sedLabel : ''}</Nav.Element>
          <div className='a-buc-c-sedheader__status'>
            <SEDStatus t={t} className='col-auto' status={sed.status} />
            <div className='pl-2'>
              <Nav.Normaltekst data-tip={t('ui:lastUpdate')}>
                {sed.lastUpdate ? moment(sed.lastUpdate).format('DD.MM.YYYY') : null}
              </Nav.Normaltekst>
              {sed.version ? <Nav.Normaltekst>{t('ui:version')}{': '}{sed.version || '-'}</Nav.Normaltekst> : null}
            </div>
          </div>
        </div>
        <div className='a-buc-c-sedheader__column a-buc-c-sedheader__institutions col-3'>
          <InstitutionList
            t={t}
            institutionNames={institutionNames}
            locale={locale}
            type='separated'
            institutions={institutionSenderList}
          />
        </div>
        <div className='a-buc-c-sedheader__column a-buc-c-sedheader__institutions col-3'>
          <InstitutionList
            t={t}
            institutionNames={institutionNames}
            locale={locale}
            type='separated'
            institutions={institutionReceiverList}
          />
        </div>
        <div className='a-buc-c-sedheader__column a-buc-c-sedheader__actions col-2'>
          {!_.isEmpty(sed.attachments) ? (
            <div
              className='a-buc-c-sedheader__actions-attachments'
              data-tip={t('buc:form-youHaveXAttachmentsInSed', { attachments: sed.attachments.length })}
            >
              <Icons kind='paperclip' />
            </div>
          ) : null}
          {(!_.isEmpty(followUpSeds) && sed.status === 'received')
            ? (
              <Nav.Flatknapp
                mini
                className='a-buc-c-sedheader__actions-answer-button'
                onClick={() => onSEDNew(buc, sed)}
              >
                {t('buc:form-answerSED')}
              </Nav.Flatknapp>
            )
            : null}
        </div>
      </div>
    </Nav.PanelBase>
  )
}

SEDListHeader.propTypes = {
  border: PT.string,
  buc: PT.object,
  className: PT.string,
  institutionNames: PT.object,
  locale: PT.string.isRequired,
  onSEDNew: PT.func.isRequired,
  sed: PT.object.isRequired,
  t: PT.func.isRequired
}

export default SEDListHeader
