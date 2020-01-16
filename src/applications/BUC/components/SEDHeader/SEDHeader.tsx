import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'
import classNames from 'classnames'
import { Buc, InstitutionNames, Institutions, Participant, Sed, Seds } from 'declarations/buc'
import { BucPropType, InstitutionNamesPropType, SedPropType, SedsPropType } from 'declarations/buc.pt'
import { AllowedLocaleString, T } from 'declarations/types'
import { AllowedLocaleStringPropType, TPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import moment from 'moment'
import PT from 'prop-types'
import React from 'react'
import './SEDHeader.css'

export interface SEDHeaderProps {
  buc: Buc;
  className ?: string;
  followUpSeds: Seds;
  institutionNames: InstitutionNames;
  locale: AllowedLocaleString;
  onSEDNew: (buc: Buc, sed: Sed) => void;
  sed: Sed;
  style?: React.CSSProperties;
  t: T;
}

const SEDHeader: React.FC<SEDHeaderProps> = ({
  buc, className, followUpSeds, institutionNames, locale, onSEDNew, sed, style, t
}: SEDHeaderProps): JSX.Element => {
  const institutionList: Institutions = sed.participants ? sed.participants.map((participant: Participant) => ({
    country: participant.organisation.countryCode,
    institution: participant.organisation.name
  })) : []

  const sedLabel: string = getBucTypeLabel({
    t: t,
    type: sed.type,
    locale: locale
  })

  return (
    <Ui.Nav.PanelBase
      style={style}
      className={classNames('a-buc-c-sedheader', 'w-100', 'p-0', className)}
    >
      <div className={classNames('a-buc-c-sedheader__content pt-2 pb-2')}>
        <div className='a-buc-c-sedheader__column a-buc-c-sedheader__name col-4'>
          <Ui.Nav.Element>{sed.type}{sedLabel ? ' - ' + sedLabel : ''}</Ui.Nav.Element>
        </div>
        <div className='a-buc-c-sedheader__column a-buc-c-sedheader__status col-3'>
          <SEDStatus t={t} className='col-auto' status={sed.status} />
          <div className='pl-2'>
            <Ui.Nav.Normaltekst className='a-buc-c-sedheader__lastUpdate' data-tip={t('ui:lastUpdate')}>
              {sed.lastUpdate ? moment(sed.lastUpdate).format('DD.MM.YYYY') : null}
            </Ui.Nav.Normaltekst>
            {sed.version ? <Ui.Nav.Normaltekst className='a-buc-c-sedheader__version'>{t('ui:version')}{': '}{sed.version || '-'}</Ui.Nav.Normaltekst> : null}
          </div>
        </div>
        <div className='a-buc-c-sedheader__column a-buc-c-sedheader__institutions col-3'>
          <InstitutionList
            t={t}
            institutionNames={institutionNames}
            locale={locale}
            type='separated'
            institutions={institutionList}
          />
        </div>
        <div className='a-buc-c-sedheader__column a-buc-c-sedheader__actions col-2'>
          {!_.isEmpty(sed.attachments) ? (
            <div
              className='a-buc-c-sedheader__actions-attachments'
              data-tip={t('buc:form-youHaveXAttachmentsInSed', { attachments: sed.attachments.length })}
            >
              <Ui.Icons kind='paperclip' />
            </div>
          ) : null}
          {(!_.isEmpty(followUpSeds) && sed.status === 'received')
            ? (
              <Ui.Nav.Flatknapp
                mini
                className='a-buc-c-sedheader__actions-answer-button'
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

SEDHeader.propTypes = {
  buc: BucPropType.isRequired,
  className: PT.string,
  followUpSeds: SedsPropType.isRequired,
  institutionNames: InstitutionNamesPropType.isRequired,
  locale: AllowedLocaleStringPropType.isRequired,
  onSEDNew: PT.func.isRequired,
  sed: SedPropType.isRequired,
  style: PT.object,
  t: TPropType.isRequired
}

export default SEDHeader
