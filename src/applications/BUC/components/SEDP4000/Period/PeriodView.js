import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import classNames from 'classnames'
import Flag from 'components/Flag/Flag'
import Icons from 'components/Icons'
import { pinfoDateToDate } from 'utils/Date'
import { Knapp, Normaltekst, Row, UndertekstBold } from 'components/Nav'

import 'applications/BUC/components/SEDP4000/Period/Period.css'

const PeriodView = (props) => {
  const { first, last, mode, period, removePeriodRequest, requestEditPeriod, t } = props

  return (
    <Row className={classNames('a-buc-c-sedp4000-period', mode)}>
      <div className={classNames('col-12', { 'col-md-6': mode === 'view' })}>
        <div id={period.id} className='a-buc-c-sedp4000-period__existingPeriod'>
          <div className='a-buc-c-sedp4000-period__existingPeriod-icon mr-3 ml-3'>
            <div className={classNames('topHalf', { line: !first })} />
            <div className={classNames('bottomHalf', { line: !last })} />
            <Icons className='iconsvg' kind={'nav-' + period.type} size={32} />
          </div>
          <div className='a-buc-c-sedp4000-period__existingPeriod-description'>
            <div className='a-buc-c-sedp4000-period__existingPeriod-type'>
              <UndertekstBold className='pr-2'>
                {t('buc:p4000-label-category-' + period.type)}
              </UndertekstBold>
              <Flag label={period.country.label} country={period.country.value} size='M' />
              <Normaltekst className='pl-2'>{period.country.label}</Normaltekst>
            </div>
            <div className='a-buc-c-sedp4000-period__existingPeriod-dates'>
              <UndertekstBold className='mr-2'>{t('buc:p4000-label-period') + ': '}</UndertekstBold>
              <Normaltekst>
                {moment(pinfoDateToDate(period.startDate)).format('DD.MM.YYYY')}{' - '}
                {period.endDate ? moment(pinfoDateToDate(period.endDate)).format('DD.MM.YYYY') : t('ui:unknown')}
                {period.uncertainDate ? ' (?)' : ''}
              </Normaltekst>
            </div>
            {period.type === 'work'
              ? (
                <>
                  <div className='a-buc-c-sedp4000-period__existingPeriod-workActivity'>
                    <UndertekstBold className='mr-2'>{t('buc:p4000-label-work-activity2') + ': '}</UndertekstBold>
                    <Normaltekst>{period.workActivity}</Normaltekst>
                  </div>
                  <div className='existingPeriodPlace d-flex align-items-center'>
                    <UndertekstBold className='mr-2'>{t('buc:p4000-label-place') + ': '}</UndertekstBold>
                    <Normaltekst>{period.workCity}</Normaltekst>
                  </div>
                </>
              ) : null}
            {period.type === 'learn'
              ? (
                <div className='a-buc-c-sedp4000-period__existingPeriod-learnInstitution'>
                  <UndertekstBold className='mr-2'>{t('buc:p4000-label-learn-institution') + ': '}</UndertekstBold>
                  <Normaltekst>{period.learnInstitution}</Normaltekst>
                </div>
              ) : null}
            {period.type === 'child'
              ? (
                <div className='a-buc-c-sedp4000-period__existingPeriod-childName'>
                  <UndertekstBold className='mr-2'>{t('buc:p4000-label-childname') + ': '}</UndertekstBold>
                  <Normaltekst>{period.childLastName}{', '}{period.childFirstName}</Normaltekst>
                </div>
              ) : null}
            {period.type === 'daily' || period.type === 'sick'
              ? (
                <div className='a-buc-c-sedp4000-period__existingPeriod-payingInstitution'>
                  <UndertekstBold className='mr-2'>{t('buc:p4000-label-paying-institution') + ': '}</UndertekstBold>
                  <Normaltekst>{period.payingInstitution}</Normaltekst>
                </div>
              ) : null}
            {period.type === 'other'
              ? (
                <div className='a-buc-c-sedp4000-period__existingPeriod-otherType'>
                  <UndertekstBold className='mr-2'>{t('buc:p4000-label-otherType') + ': '}</UndertekstBold>
                  <Normaltekst>{period.otherType}</Normaltekst>
                </div>
              ) : null}
            {period.attachments && !_.isEmpty(period.attachments)
              ? (
                <div className='a-buc-c-sedp4000-period__existingPeriod-attachments'>
                  <UndertekstBold className='mr-2'>{t('buc:p4000-label-attachments') + ': '}</UndertekstBold>
                  <Normaltekst>{period.attachments.map(att => att.name).join(', ')}</Normaltekst>
                </div>
              ) : null}
          </div>
        </div>
      </div>
      {mode === 'view' ? (
        <div className='col-md-6 col-12 a-buc-c-sedp4000-period__existingPeriod-buttons'>
          <Knapp className='a-buc-c-sedp4000-period__existingPeriod-button change mr-3 ' onClick={() => requestEditPeriod(period)}>
            {t('ui:change')}
          </Knapp>
          <Knapp className='a-buc-c-sedp4000-period__existingPeriod-button remove' onClick={() => removePeriodRequest(period)}>
            <Icons className='mr-3' kind='bigclose' size={18} color='#0067C5' />
            {t('ui:remove')}
          </Knapp>
        </div>
      ) : null}
    </Row>
  )
}

PeriodView.propTypes = {
  first: PT.bool,
  last: PT.bool,
  mode: PT.string.isRequired,
  period: PT.object,
  removePeriodRequest: PT.func,
  requestEditPeriod: PT.func,
  t: PT.func.isRequired
}

export default PeriodView
