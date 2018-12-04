import React from 'react'
import PT from 'prop-types'
import moment from 'moment'
import ReactDatePicker from 'react-datepicker'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'
import CountrySelect from '../ui/CountrySelect/CountrySelect'
import * as pinfoActions from '../../actions/pinfo'
import * as Nav from '../ui/Nav'
import { workValidation } from './Validation/singleTests'

import './form.css'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    work: state.pinfo.work
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions), dispatch) }
}

class Work extends React.Component {

  state = {
    error: {}
  }

  constructor (props) {
    super(props)
    this.setWorkType = this.eventSetProperty.bind(this, 'workType', workValidation.workType)
    this.setWorkStartDate = this.dateSetProperty.bind(this, 'workStartDate', workValidation.workStartDate)
    this.setWorkEndDate = this.dateSetProperty.bind(this, 'workEndDate', workValidation.workEndDate)
    this.setWorkEstimatedRetirementDate = this.dateSetProperty.bind(this, 'workEstimatedRetirementDate', workValidation.workEstimatedRetirementDate)
    this.setWorkHourPerWeek = this.eventSetProperty.bind(this, 'workHourPerWeek', workValidation.setWorkHourPerWeek)
    this.setWorkIncome = this.eventSetProperty.bind(this, 'workIncome', workValidation.setWorkIncome)
    this.setWorkIncomeCurrency = this.valueSetProperty.bind(this, 'workIncomeCurrency', workValidation.setWorkIncomeCurrency)
    this.setWorkPaymentDate = this.dateSetProperty.bind(this, 'workPaymentDate', workValidation.setWorkPaymentDate)
    this.setWorkPaymentFrequency = this.eventSetProperty.bind(this, 'workPaymentFrequency', workValidation.setWorkPaymentFrequency)
  }

  eventSetProperty (key, validateFunction, event) {
    this.valueSetProperty(key, validateFunction, event.target.value)
  }

  dateSetProperty (key, validateFunction, date) {
    this.valueSetProperty(key, validateFunction, date ? date.valueOf() : null)
  }

  valueSetProperty (key, validateFunction, value) {
    const { actions } = this.props
    actions.setWork({ [key]: value })
    this.setState({
      error: {
        ...this.state.error,
        [key]: validateFunction(value)
      }
    })
  }

  render () {
    const { t, work, locale } = this.props
    const { error } = this.state

    return <div>
      <h2 className='typo-undertittel ml-0 mb-4 appDescription'>{t('pinfo:work-title')}</h2>
      <div className='mt-3'>
        <Nav.Row className='mb-4'>
          <div className='col-md-8'>
            <Nav.Select
              label={t('pinfo:work-type')}
              value={work.workType || ''}
              onChange={this.setWorkType}
              feil={error.workType ? { feilmelding: t(error.workType) } : null}>
              <option value=''>{t('ui:choose')}</option>
              <option value='01'>{t('pinfo:work-type-option-01')}</option>
              <option value='02'>{t('pinfo:work-type-option-02')}</option>
              <option value='03'>{t('pinfo:work-type-option-03')}</option>
              <option value='04'>{t('pinfo:work-type-option-04')}</option>
              <option value='05'>{t('pinfo:work_type-option-05')}</option>
              <option value='06'>{t('pinfo:work-type-option-06')}</option>
              <option value='07'>{t('pinfo:work-type-option-07')}</option>
              <option value='08'>{t('pinfo:work-type-option-08')}</option>
            </Nav.Select>
          </div>
          <div className='col-md-4'>
            <Nav.Input label={t('pinfo:work-hour-per-week')} value={work.workHourPerWeek || ''}
              onChange={this.setWorkHourPerWeek}
              feil={error.workHourPerWeek ? { feilmelding: t(error.workHourPerWeek) } : null}
            />
          </div>
        </Nav.Row>
        <Nav.Row className='mb-4'>
          <div className='col-md-4'>
            <label>{t('pinfo:work-start-date')}</label>
            <ReactDatePicker
              className={classNames(
                'skjemaelement__input input--fullbredde',
                { 'skjemaelement__input--harFeil': error.workStartDate })}
              selected={work.workStartDate}
              dateFormat='dd.MM.yyyy'
              placeholderText={t('ui:dateFormat')}
              showYearDropdown
              showMonthDropdown
              dropdownMode='select'
              locale={locale}
              onChange={this.setWorkStartDate}
            />
            {error.workStartDate ? <div role='alert' aria-live='assertive'>
              <div class='skjemaelement__feilmelding'>{t(error.workStartDate)}</div>
            </div> : null}
          </div>
          <div className='col-md-4'>
            <label>{t('pinfo:work-end-date')}</label>
            <ReactDatePicker
              className={classNames(
                  'skjemaelement__input input--fullbredde',
                  { 'skjemaelement__input--harFeil': error.workEndDate })}
              selected={work.workEndDate}
              dateFormat='dd.MM.yyyy'
              placeholderText={t('ui:dateFormat')}
              showYearDropdown
              showMonthDropdown
              dropdownMode='select'
              locale={locale}
              onChange={this.setWorkEndDate}
            />
            { error.workEndDate ? <div role='alert' aria-live='assertive'>
              <div class='skjemaelement__feilmelding'>{t(error.workEndDate)}</div>
            </div> : null }
          </div>
          <div className='col-md-4'>
            <label>{t('pinfo:work-estimated-retirement-date')}</label>
            <ReactDatePicker
              className={classNames(
                'skjemaelement__input input--fullbredde',
                { 'skjemaelement__input--harFeil': error.workEstimatedRetirementDate })}
              selected={work.workEstimatedRetirementDate}
              dateFormat='dd.MM.yyyy'
              placeholderText={t('ui:dateFormat')}
              showYearDropdown
              showMonthDropdown
              dropdownMode='select'
              locale={locale}
              onChange={this.setWorkEstimatedRetirementDate}
            />
            { error.workEstimatedRetirementDate ? <div role='alert' aria-live='assertive'>
              <div class='skjemaelement__feilmelding'>{t(error.workEstimatedRetirementDate)}</div>
            </div> : null }
          </div>
        </Nav.Row>

        <Nav.Row className='mb-4'>
          <div className='col-md-6'>
            <Nav.Input label={t('pinfo:work-income')} value={work.workIncome || ''}
              onChange={this.setWorkIncome}
              feil={error.workIncome ? { feilmelding: t(error.workIncome) } : null}
            />
          </div>
          <div className='col-md-6'>
            <label>{t('pinfo:work-income-currency')}</label>
            <CountrySelect locale={locale} type={'currency'}
              value={work.workIncomeCurrency || null}
              onSelect={this.setWorkIncomeCurrency}
              error={error.workIncomeCurrency}
              errorMessage={error.workIncomeCurrency}
            />
          </div>
        </Nav.Row>

        <Nav.Row className='mb-4'>
          <div className='col-md-6'>
            <label>{t('pinfo:work-payment-date')}</label>

            <ReactDatePicker
              className={classNames(
                'skjemaelement__input input--fullbredde',
                { 'skjemaelement__input--harFeil': error.workPaymentDate })}
              selected={work.workPaymentDate ? moment(work.workPaymentDate) : undefined}
              dateFormat='dd.MM.yyyy'
              placeholderText={t('ui:dateFormat')}
              showYearDropdown
              showMonthDropdown
              dropdownMode='select'
              locale={locale}
              onChange={this.setWorkPaymentDate}
            />
            { error.workPaymentDate ? <div role='alert' aria-live='assertive'>
              <div class='skjemaelement__feilmelding'>{t(error.workPaymentDate)}</div>
            </div> : null }
          </div>
          <div className='col-md-6'>
            <Nav.Select label={t('pinfo:work-payment-frequency')} value={work.workPaymentFrequency || ''}
              onChange={this.setWorkPaymentFrequency}
              feil={error.workPaymentFrequency ? { feilmelding: t(error.workPaymentFrequency) } : null}
            >
              <option value=''>{t('ui:choose')}</option>
              <option value='01'>{t('pinfo:workPayment-frequency-option-01')}</option>
              <option value='02'>{t('pinfo:workPayment-frequency-option-02')}</option>
              <option value='03'>{t('pinfo:workPayment-frequency-option-03')}</option>
              <option value='04'>{t('pinfo:workPayment-frequency-option-04')}</option>
              <option value='05'>{t('pinfo:workPayment-frequency-option-05')}</option>
              <option value='06'>{t('pinfo:workPayment-frequency-option-06')}</option>
              <option value='99'>{t('pinfo:workPayment-frequency-option-99')}</option>
            </Nav.Select>
          </div>
        </Nav.Row>
      </div>
    </div>
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(Work)
)

Work.propTypes = {
  work: PT.object,
  action: PT.func,
  t: PT.func,
  locale: PT.string
}
