import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import moment from 'moment'
import { Icons, Nav } from 'eessi-pensjon-ui'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import './SEDHeader.css'

const SEDHeader = ({ border = 'none', buc, className, institutionNames, locale, onSEDNew, sed, followUpSeds, t }) => {
  const institutionList = sed.participants ? sed.participants.map(participant => {
    return {
      country: participant.organisation.countryCode,
      institution: participant.organisation.name
    }
  }) : []

  let sedLabel = t('buc:buc-' + sed.type)
  if (sedLabel === 'buc:buc-' + sed.type) {
    sedLabel = undefined
  }

  return (
    <Nav.PanelBase
      className={classNames('a-buc-c-sedrow', 'w-100', 'p-0', className)}
    >
      <div className={classNames('a-buc-c-sedrow__content pt-2 pb-2', 'a-buc-c-sedrow__border-' + border)}>
        <div className='a-buc-c-sedrow__column a-buc-c-sedrow__name col-4'>
          <Nav.Element>{sed.type}{sedLabel ? ' - ' + sedLabel : ''}</Nav.Element>
        </div>
        <div className='a-buc-c-sedrow__column a-buc-c-sedrow__status col-3'>
          <SEDStatus t={t} className='col-auto' status={sed.status} />
          <Nav.Normaltekst className='pl-2'>
            {moment(sed.creationDate).format('D.M.Y')}
            {sed.lastUpdate && sed.status !== 'received' && sed.status !== 'sent'
              ? ' - ' + moment(sed.creationDate).format('D.M.Y') : ''}
          </Nav.Normaltekst>
        </div>
        <div className='a-buc-c-sedrow__column a-buc-c-sedrow__institutions col-3'>
          <InstitutionList
            t={t}
            institutionNames={institutionNames}
            locale={locale}
            type='separated'
            institutions={institutionList}
          />
        </div>
        <div className='a-buc-c-sedrow__column a-buc-c-sedrow__actions col-2'>
          {!_.isEmpty(sed.attachments) ? (
            <div
              className='a-buc-c-sedrow__actions-attachments'
              title={t('buc:form-youHaveXAttachmentsInSed', { attachments: sed.attachments.length })}
            >
              <Icons kind='paperclip' />
            </div>
          ) : null}
          {(!_.isEmpty(followUpSeds) && sed.status === 'received')
            ? (
              <Nav.Flatknapp
                mini
                className='a-buc-c-sedrow__actions-answer-button'
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

SEDHeader.propTypes = {
  border: PT.string.isRequired,
  buc: PT.object,
  className: PT.string,
  institutionNames: PT.object,
  locale: PT.string.isRequired,
  onSEDNew: PT.func.isRequired,
  sed: PT.object.isRequired,
  t: PT.func.isRequired
}

export default SEDHeader
