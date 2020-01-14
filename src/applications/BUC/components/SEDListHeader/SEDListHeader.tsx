import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'
import { Buc, Institution, InstitutionNames, Participant, Sed } from 'applications/BUC/declarations/buc.d'
import classNames from 'classnames'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import moment from 'moment'
import PT from 'prop-types'
import React from 'react'
import { AllowedLocaleString, T } from 'types.d'
import './SEDListHeader.css'

export interface SEDListHeaderProps {
  buc: Buc;
  className ?: string;
  institutionNames: InstitutionNames;
  locale: AllowedLocaleString;
  onSEDNew: (buc: Buc, sed: Sed) => void;
  sed: Sed;
  style?: React.CSSProperties;
  followUpSeds: Array<Sed>;
  t: T;
}

const SEDListHeader = ({
  buc, className, followUpSeds, institutionNames, locale, onSEDNew, sed, style, t
}: SEDListHeaderProps) => {
  const institutionSenderList: Array<Institution> = sed.participants ? sed.participants
    .filter((participant: Participant) => participant.role === 'Sender')
    .map((participant: Participant) => {
      return {
        country: participant.organisation.countryCode,
        institution: participant.organisation.name
      }
    }) : []

  const institutionReceiverList: Array<Institution> = sed.participants ? sed.participants
    .filter((participant: Participant) => participant.role === 'Receiver')
    .map((participant: Participant) => {
      return {
        country: participant.organisation.countryCode,
        institution: participant.organisation.name
      }
    }) : []

  const sedLabel: string = getBucTypeLabel({
    t: t,
    type: sed.type,
    locale: locale
  })

  return (
    <Ui.Nav.PanelBase
      style={style}
      className={classNames('a-buc-c-sedlistheader', 'w-100', 'p-0', className)}
    >
      <div className={classNames('a-buc-c-sedlistheader__content pt-2 pb-2')}>
        <div className='a-buc-c-sedlistheader__column a-buc-c-sedlistheader__name col-4'>
          <Ui.Nav.Element>{sed.type}{sedLabel ? ' - ' + sedLabel : ''}</Ui.Nav.Element>
          <div className='a-buc-c-sedlistheader__status'>
            <SEDStatus t={t} className='col-auto' status={sed.status} />
            <div className='pl-2'>
              <Ui.Nav.Normaltekst className='a-buc-c-sedlistheader__lastUpdate' data-tip={t('ui:lastUpdate')}>
                {sed.lastUpdate ? moment(sed.lastUpdate).format('DD.MM.YYYY') : null}
              </Ui.Nav.Normaltekst>
              {sed.version ? <Ui.Nav.Normaltekst className='a-buc-c-sedlistheader__version'>{t('ui:version')}{': '}{sed.version || '-'}</Ui.Nav.Normaltekst> : null}
            </div>
          </div>
        </div>
        <div className='a-buc-c-sedlistheader__column a-buc-c-sedlistheader__institutions col-3'>
          <InstitutionList
            t={t}
            institutionNames={institutionNames}
            locale={locale}
            type='separated'
            institutions={institutionSenderList}
          />
        </div>
        <div className='a-buc-c-sedlistheader__column a-buc-c-sedlistheader__institutions col-3'>
          <InstitutionList
            t={t}
            institutionNames={institutionNames}
            locale={locale}
            type='separated'
            institutions={institutionReceiverList}
          />
        </div>
        <div className='a-buc-c-sedlistheader__column a-buc-c-sedlistheader__actions col-2'>
          {!_.isEmpty(sed.attachments) ? (
            <div
              className='a-buc-c-sedlistheader__actions-attachments'
              data-tip={t('buc:form-youHaveXAttachmentsInSed', { attachments: sed.attachments.length })}
            >
              <Ui.Icons kind='paperclip' />
            </div>
          ) : null}
          {(!_.isEmpty(followUpSeds) && sed.status === 'received')
            ? (
              <Ui.Nav.Flatknapp
                mini
                className='a-buc-c-sedlistheader__actions-answer-button'
                onClick={() => onSEDNew(buc, sed)}
              >
                {t('buc:form-answerSED')}
              </Ui.Nav.Flatknapp>
            )
            : null}
        </div>
      </div>
    </Ui.Nav.PanelBase>
  )
}

SEDListHeader.propTypes = {
  buc: PT.object,
  className: PT.string,
  institutionNames: PT.object,
  locale: PT.string.isRequired,
  onSEDNew: PT.func.isRequired,
  sed: PT.object.isRequired,
  t: PT.func.isRequired
}

export default SEDListHeader
