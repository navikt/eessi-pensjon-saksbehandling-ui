import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'
import classNames from 'classnames'
import { Buc, Institutions, Participant, Sed, Seds } from 'declarations/buc'
import { BucPropType, SedPropType, SedsPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import moment from 'moment'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import './SEDListHeader.css'

export interface SEDListHeaderProps {
  buc: Buc;
  className ?: string;
  onSEDNew: (buc: Buc, sed: Sed) => void;
  sed: Sed;
  style?: React.CSSProperties;
  followUpSeds: Seds;
}

export interface SEDListSelector {
  locale: AllowedLocaleString
}

const mapState = (state: State): SEDListSelector => ({
  locale: state.ui.locale
})

const SEDListHeader: React.FC<SEDListHeaderProps> = ({
  buc, className, followUpSeds, onSEDNew, sed, style
}: SEDListHeaderProps): JSX.Element => {
  const { locale }: SEDListSelector = useSelector<State, SEDListSelector>(mapState)
  const { t } = useTranslation()
  const institutionSenderList: Institutions = sed.participants ? sed.participants
    .filter((participant: Participant) => participant.role === 'Sender')
    .map((participant: Participant) => ({
      country: participant.organisation.countryCode,
      institution: participant.organisation.name
    })) : []

  const institutionReceiverList: Institutions = sed.participants ? sed.participants
    .filter((participant: Participant) => participant.role === 'Receiver')
    .map((participant: Participant) => ({
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
      className={classNames('a-buc-c-sedlistheader', 'w-100', 'p-0', className)}
    >
      <div className={classNames('a-buc-c-sedlistheader__content pt-2 pb-2')}>
        <div className='a-buc-c-sedlistheader__column a-buc-c-sedlistheader__name col-4'>
          <Ui.Nav.Element>{sed.type}{sedLabel ? ' - ' + sedLabel : ''}</Ui.Nav.Element>
          <div className='a-buc-c-sedlistheader__status'>
            <div className='a-buc-c-sedlistheader__status-item'>
              <SEDStatus className='col-auto' status={sed.status} />
              <div className='pl-2'>
                <Ui.Nav.Normaltekst className='a-buc-c-sedlistheader__lastUpdate' data-tip={t('ui:lastUpdate')}>
                  {sed.lastUpdate ? moment(sed.lastUpdate).format('DD.MM.YYYY') : null}
                </Ui.Nav.Normaltekst>
                {sed.version ? <Ui.Nav.Normaltekst className='a-buc-c-sedlistheader__version'>{t('ui:version')}{': '}{sed.version || '-'}</Ui.Nav.Normaltekst> : null}
              </div>
            </div>
            {sed.version !== '1' ? (
              <div className='a-buc-c-sedlistheader__status-item'>
                <SEDStatus className='col-auto' status={'first_' + sed.status} />
                <div className='pl-2'>
                  <Ui.Nav.Normaltekst className='a-buc-c-sedlistheader__firstSend' data-tip={t('ui:status-first')}>
                    {sed.firstVersion ? moment(sed.firstVersion.date).format('DD.MM.YYYY') : null}
                  </Ui.Nav.Normaltekst>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className='a-buc-c-sedlistheader__column a-buc-c-sedlistheader__institutions col-3'>
          <InstitutionList
            locale={locale}
            type='separated'
            institutions={institutionSenderList}
          />
        </div>
        <div className='a-buc-c-sedlistheader__column a-buc-c-sedlistheader__institutions col-3'>
          <InstitutionList
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
  buc: BucPropType.isRequired,
  className: PT.string,
  onSEDNew: PT.func.isRequired,
  sed: SedPropType.isRequired,
  style: PT.object,
  followUpSeds: SedsPropType.isRequired
}

export default SEDListHeader
