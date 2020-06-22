import 'applications/BUC/components/SEDP4000/Period/Period.css'
import { Period } from 'declarations/period'
import classNames from 'classnames'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React from 'react'
import Flag from 'flagg-ikoner'
import { useTranslation } from 'react-i18next'
import P4000Payload from '../P4000Payload'

export interface PeriodViewProps {
  first?: boolean;
  last?: boolean;
  mode: string;
  period: Period;
  removePeriodRequest: (p: Period) => void;
  requestEditPeriod: (p: Period) => void;
}

const PeriodView: React.FC<PeriodViewProps> = ({
  first, last, mode, period, removePeriodRequest, requestEditPeriod
}: PeriodViewProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Ui.Nav.Row className={classNames('a-buc-c-sedp4000-period', mode)}>
      <div className={classNames('col-12', { 'col-md-6': mode === 'view' })}>
        <div id={'' + period.id} className='a-buc-c-sedp4000-period__existingPeriod'>
          <div className='a-buc-c-sedp4000-period__existingPeriod-icon mr-3 ml-3'>
            <div className={classNames('topHalf', { line: !first })} />
            <div className={classNames('bottomHalf', { line: !last })} />
            <Ui.Icons className='iconsvg' kind={'nav-' + period.type} size={32} />
          </div>
          <div className='a-buc-c-sedp4000-period__existingPeriod-description'>
            <div className='a-buc-c-sedp4000-period__existingPeriod-type'>
              <Ui.Nav.UndertekstBold className='pr-2'>
                {t('buc:p4000-label-category-' + period.type)}
              </Ui.Nav.UndertekstBold>
              <Flag label={period.country.label} country={period.country.value} size='M' />
              <Ui.Nav.Normaltekst className='pl-2'>{period.country.label}</Ui.Nav.Normaltekst>
            </div>
            <div className='a-buc-c-sedp4000-period__existingPeriod-dates'>
              <Ui.Nav.UndertekstBold className='mr-2'>{t('buc:p4000-label-period') + ': '}</Ui.Nav.UndertekstBold>
              <Ui.Nav.Normaltekst>
                {P4000Payload.renderDate(period.startDate, t)}{' - '}{P4000Payload.renderDate(period.endDate, t)}
                {period.uncertainDate ? ' (?)' : ''}
              </Ui.Nav.Normaltekst>
            </div>
            {period.type === 'work'
              ? (
                <>
                  <div className='a-buc-c-sedp4000-period__existingPeriod-workActivity'>
                    <Ui.Nav.UndertekstBold className='mr-2'>{t('buc:p4000-label-work-activity2') + ': '}</Ui.Nav.UndertekstBold>
                    <Ui.Nav.Normaltekst>{period.workActivity}</Ui.Nav.Normaltekst>
                  </div>
                  <div className='existingPeriodPlace d-flex align-items-center'>
                    <Ui.Nav.UndertekstBold className='mr-2'>{t('buc:p4000-label-place') + ': '}</Ui.Nav.UndertekstBold>
                    <Ui.Nav.Normaltekst>{period.workCity}</Ui.Nav.Normaltekst>
                  </div>
                </>
              ) : null}
            {period.type === 'learn'
              ? (
                <div className='a-buc-c-sedp4000-period__existingPeriod-learnInstitution'>
                  <Ui.Nav.UndertekstBold className='mr-2'>{t('buc:p4000-label-learn-institution') + ': '}</Ui.Nav.UndertekstBold>
                  <Ui.Nav.Normaltekst>{period.learnInstitution}</Ui.Nav.Normaltekst>
                </div>
              ) : null}
            {period.type === 'child'
              ? (
                <div className='a-buc-c-sedp4000-period__existingPeriod-childName'>
                  <Ui.Nav.UndertekstBold className='mr-2'>{t('buc:p4000-label-childname') + ': '}</Ui.Nav.UndertekstBold>
                  <Ui.Nav.Normaltekst>{period.childLastName}{', '}{period.childFirstName}</Ui.Nav.Normaltekst>
                </div>
              ) : null}
            {period.type === 'daily' || period.type === 'sick'
              ? (
                <div className='a-buc-c-sedp4000-period__existingPeriod-payingInstitution'>
                  <Ui.Nav.UndertekstBold className='mr-2'>{t('buc:p4000-label-paying-institution') + ': '}</Ui.Nav.UndertekstBold>
                  <Ui.Nav.Normaltekst>{period.payingInstitution}</Ui.Nav.Normaltekst>
                </div>
              ) : null}
            {period.type === 'other'
              ? (
                <div className='a-buc-c-sedp4000-period__existingPeriod-otherType'>
                  <Ui.Nav.UndertekstBold className='mr-2'>{t('buc:p4000-label-otherType') + ': '}</Ui.Nav.UndertekstBold>
                  <Ui.Nav.Normaltekst>{period.otherType}</Ui.Nav.Normaltekst>
                </div>
              ) : null}
            {period.attachments && !_.isEmpty(period.attachments)
              ? (
                <div className='a-buc-c-sedp4000-period__existingPeriod-attachments'>
                  <Ui.Nav.UndertekstBold className='mr-2'>{t('buc:p4000-label-attachments') + ': '}</Ui.Nav.UndertekstBold>
                  <Ui.Nav.Normaltekst>{period.attachments.map((att: any) => att.name).join(', ')}</Ui.Nav.Normaltekst>
                </div>
              ) : null}
          </div>
        </div>
      </div>
      {mode === 'view' ? (
        <div className='col-md-6 col-12 a-buc-c-sedp4000-period__existingPeriod-buttons'>
          <Ui.Nav.Knapp className='a-buc-c-sedp4000-period__existingPeriod-button change mr-3 ' onClick={() => requestEditPeriod(period)}>
            {t('ui:change')}
          </Ui.Nav.Knapp>
          <Ui.Nav.Knapp className='a-buc-c-sedp4000-period__existingPeriod-button remove' onClick={() => removePeriodRequest(period)}>
            <Ui.Icons className='mr-3' kind='bigclose' size={18} color='#0067C5' />
            {t('ui:remove')}
          </Ui.Nav.Knapp>
        </div>
      ) : null}
    </Ui.Nav.Row>
  )
}

PeriodView.propTypes = {
  first: PT.bool,
  last: PT.bool,
  mode: PT.string.isRequired,
  period: PT.any.isRequired,
  removePeriodRequest: PT.func.isRequired,
  requestEditPeriod: PT.func.isRequired
}

export default PeriodView
