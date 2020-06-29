import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'
import classNames from 'classnames'
import Icons from 'components/Icons/Icons'
import { Buc, Institutions, Participant, Sed, Seds } from 'declarations/buc'
import { BucPropType, SedPropType, SedsPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString } from 'declarations/types'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import moment from 'moment'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Panel from 'nav-frontend-paneler'
import { Element, Normaltekst } from 'nav-frontend-typografi'
import { Flatknapp } from 'nav-frontend-knapper'
import './SEDHeader.css'

export interface SEDHeaderProps {
  buc: Buc;
  className ?: string;
  followUpSeds: Seds;
  onSEDNew: (buc: Buc, sed: Sed) => void;
  sed: Sed;
  style?: React.CSSProperties;
}

export interface SEDHeaderSelector {
  locale: AllowedLocaleString
}

const mapState = (state: State): SEDHeaderSelector => ({
  locale: state.ui.locale
})

const SEDHeader: React.FC<SEDHeaderProps> = ({
  buc, className, followUpSeds, onSEDNew, sed, style
}: SEDHeaderProps): JSX.Element => {
  const institutionList: Institutions = sed.participants
    ? sed.participants.filter((participant) => {
      return (sed.status === 'received') ? participant.role === 'Sender'
        : (sed.status !== 'draft') ? participant.role !== 'Sender'
          : participant.organisation.countryCode === 'NO'
    })
      .map((participant: Participant) => ({
        country: participant.organisation.countryCode,
        institution: participant.organisation.name
      })) : []
  const { locale }: SEDHeaderSelector = useSelector<State, SEDHeaderSelector>(mapState)
  const { t } = useTranslation()
  const sedLabel: string = getBucTypeLabel({
    t: t,
    type: sed.type,
    locale: locale
  })

  return (
    <Panel
      style={style}
      className={classNames('a-buc-c-sedheader', 'w-100', 'p-0', className)}
    >
      <div className={classNames('a-buc-c-sedheader__content pt-2 pb-2')}>
        <div className='a-buc-c-sedheader__column a-buc-c-sedheader__name col-4'>
          <Element>{sed.type}{sedLabel ? ' - ' + sedLabel : ''}</Element>
        </div>
        <div className='a-buc-c-sedheader__column a-buc-c-sedheader__status col-3'>
          <div className='a-buc-c-sedheader__status-item'>
            <SEDStatus className='col-auto' status={sed.status} />
            <div className='pl-2'>
              <Normaltekst className='a-buc-c-sedheader__lastUpdate' data-tip={t('ui:lastUpdate')}>
                {sed.lastUpdate ? moment(sed.lastUpdate).format('DD.MM.YYYY') : null}
              </Normaltekst>
              {sed.version ? <Normaltekst className='a-buc-c-sedheader__version'>{t('ui:version')}{': '}{sed.version || '-'}</Normaltekst> : null}
            </div>
          </div>
          {sed.version !== '1' ? (
            <div className='a-buc-c-sedheader__status-item'>
              <SEDStatus className='col-auto' status={'first_' + sed.status} />
              <div className='pl-2'>
                <Normaltekst className='a-buc-c-sedheader__firstSend' data-tip={t('ui:status-first')}>
                  {sed.firstVersion ? moment(sed.firstVersion.date).format('DD.MM.YYYY') : null}
                </Normaltekst>
              </div>
            </div>
          ) : null}
        </div>
        <div className='a-buc-c-sedheader__column a-buc-c-sedheader__institutions col-3'>
          <InstitutionList
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
              <Icons kind='paperclip' />
            </div>
          ) : null}
          {(!_.isEmpty(followUpSeds) && sed.status === 'received')
            ? (
              <Flatknapp
                mini
                data-amplitude='buc.list.besvarSed'
                className='a-buc-c-sedheader__actions-answer-button'
                onClick={(e: React.MouseEvent) => {
                  buttonLogger(e)
                  onSEDNew(buc, sed)
                }}
              >
                {t('buc:form-answerSED')}
              </Flatknapp>
            )
            : null}
        </div>
      </div>
    </Panel>
  )
}

SEDHeader.propTypes = {
  buc: BucPropType.isRequired,
  className: PT.string,
  followUpSeds: SedsPropType.isRequired,
  onSEDNew: PT.func.isRequired,
  sed: SedPropType.isRequired,
  style: PT.object
}

export default SEDHeader
