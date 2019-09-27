import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import { Flag, Icons, Nav } from 'eessi-pensjon-ui'
import Util from '../Util'

import 'applications/BUC/components/SEDP4000/Period/Period.css'

const PeriodView = (props) => {
  const { first, last, mode, period, removePeriodRequest, requestEditPeriod, t } = props
  const util = new Util({}, t)
  return (
    <Nav.Row className={classNames('a-buc-c-sedp4000-period', mode)}>
      <div className={classNames('col-12', { 'col-md-6': mode === 'view' })}>
        <div id={period.id} className='a-buc-c-sedp4000-period__existingPeriod'>
          <div className='a-buc-c-sedp4000-period__existingPeriod-icon mr-3 ml-3'>
            <div className={classNames('topHalf', { line: !first })} />
            <div className={classNames('bottomHalf', { line: !last })} />
            <Icons className='iconsvg' kind={'nav-' + period.type} size={32} />
          </div>
          <div className='a-buc-c-sedp4000-period__existingPeriod-description'>
            <div className='a-buc-c-sedp4000-period__existingPeriod-type'>
              <Nav.UndertekstBold className='pr-2'>
                {t('buc:p4000-label-category-' + period.type)}
              </Nav.UndertekstBold>
              <Flag label={period.country.label} country={period.country.value} size='M' />
              <Nav.Normaltekst className='pl-2'>{period.country.label}</Nav.Normaltekst>
            </div>
            <div className='a-buc-c-sedp4000-period__existingPeriod-dates'>
              <Nav.UndertekstBold className='mr-2'>{t('buc:p4000-label-period') + ': '}</Nav.UndertekstBold>
              <Nav.Normaltekst>
                {util.renderDate(period.startDate)}{' - '}{util.renderDate(period.endDate)}
                {period.uncertainDate ? ' (?)' : ''}
              </Nav.Normaltekst>
            </div>
            {period.type === 'work'
              ? (
                <>
                  <div className='a-buc-c-sedp4000-period__existingPeriod-workActivity'>
                    <Nav.UndertekstBold className='mr-2'>{t('buc:p4000-label-work-activity2') + ': '}</Nav.UndertekstBold>
                    <Nav.Normaltekst>{period.workActivity}</Nav.Normaltekst>
                  </div>
                  <div className='existingPeriodPlace d-flex align-items-center'>
                    <Nav.UndertekstBold className='mr-2'>{t('buc:p4000-label-place') + ': '}</Nav.UndertekstBold>
                    <Nav.Normaltekst>{period.workCity}</Nav.Normaltekst>
                  </div>
                </>
              ) : null}
            {period.type === 'learn'
              ? (
                <div className='a-buc-c-sedp4000-period__existingPeriod-learnInstitution'>
                  <Nav.UndertekstBold className='mr-2'>{t('buc:p4000-label-learn-institution') + ': '}</Nav.UndertekstBold>
                  <Nav.Normaltekst>{period.learnInstitution}</Nav.Normaltekst>
                </div>
              ) : null}
            {period.type === 'child'
              ? (
                <div className='a-buc-c-sedp4000-period__existingPeriod-childName'>
                  <Nav.UndertekstBold className='mr-2'>{t('buc:p4000-label-childname') + ': '}</Nav.UndertekstBold>
                  <Nav.Normaltekst>{period.childLastName}{', '}{period.childFirstName}</Nav.Normaltekst>
                </div>
              ) : null}
            {period.type === 'daily' || period.type === 'sick'
              ? (
                <div className='a-buc-c-sedp4000-period__existingPeriod-payingInstitution'>
                  <Nav.UndertekstBold className='mr-2'>{t('buc:p4000-label-paying-institution') + ': '}</Nav.UndertekstBold>
                  <Nav.Normaltekst>{period.payingInstitution}</Nav.Normaltekst>
                </div>
              ) : null}
            {period.type === 'other'
              ? (
                <div className='a-buc-c-sedp4000-period__existingPeriod-otherType'>
                  <Nav.UndertekstBold className='mr-2'>{t('buc:p4000-label-otherType') + ': '}</Nav.UndertekstBold>
                  <Nav.Normaltekst>{period.otherType}</Nav.Normaltekst>
                </div>
              ) : null}
            {period.attachments && !_.isEmpty(period.attachments)
              ? (
                <div className='a-buc-c-sedp4000-period__existingPeriod-attachments'>
                  <Nav.UndertekstBold className='mr-2'>{t('buc:p4000-label-attachments') + ': '}</Nav.UndertekstBold>
                  <Nav.Normaltekst>{period.attachments.map(att => att.name).join(', ')}</Nav.Normaltekst>
                </div>
              ) : null}
          </div>
        </div>
      </div>
      {mode === 'view' ? (
        <div className='col-md-6 col-12 a-buc-c-sedp4000-period__existingPeriod-buttons'>
          <Nav.Knapp className='a-buc-c-sedp4000-period__existingPeriod-button change mr-3 ' onClick={() => requestEditPeriod(period)}>
            {t('ui:change')}
          </Nav.Knapp>
          <Nav.Knapp className='a-buc-c-sedp4000-period__existingPeriod-button remove' onClick={() => removePeriodRequest(period)}>
            <Icons className='mr-3' kind='bigclose' size={18} color='#0067C5' />
            {t('ui:remove')}
          </Nav.Knapp>
        </div>
      ) : null}
    </Nav.Row>
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
