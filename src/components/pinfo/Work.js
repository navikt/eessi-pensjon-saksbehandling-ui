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
import { workAndIncomeValidation } from './Validation/tests'
import './form.css'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    workIncome: state.pinfo.form.workIncome
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions), dispatch) }
}

function valueSetWorkIncome (key, value) {
  this.props.actions.setWorkIncome({ [key]: value })
}
function eventSetWorkIncome (key, event) {
  this.props.actions.setWorkIncome({ [key]: event.target.value })
}
function dateSetWorkIncome (key, date) {
  this.props.actions.setWorkIncome({ [key]: date ? date.valueOf() : null })
}
function displayErrorOff () {
  this.setState({
    displayError: false
  })
}
function displayErrorOn () {
  this.setState({
    displayError: true
  })
}

class Work extends React.Component {
  constructor (props) {
    super(props)
    this.setWorkType = eventSetWorkIncome.bind(this, 'workType')
    this.setWorkStartDate = dateSetWorkIncome.bind(this, 'workStartDate')
    this.setWorkEndDate = dateSetWorkIncome.bind(this, 'workEndDate')
    this.setWorkEstimatedRetirementDate = dateSetWorkIncome.bind(this, 'workEstimatedRetirementDate')
    this.setWorkHourPerWeek = eventSetWorkIncome.bind(this, 'workHourPerWeek')
    this.setWorkIncome = eventSetWorkIncome.bind(this, 'workIncome')
    this.setWorkIncomeCurrency = valueSetWorkIncome.bind(this, 'workIncomeCurrency')
    this.setWorkPaymentDate = dateSetWorkIncome.bind(this, 'workPaymentDate')
    this.setWorkPaymentFrequency = eventSetWorkIncome.bind(this, 'workPaymentFrequency')
    this.state = {
      displayError: true,
      error: {}
    }
    this.displayErrorSwitch = { on: displayErrorOn.bind(this), off: displayErrorOff.bind(this) }
  }

  validate() {

    const { t, workIncome } = this.props

    this.setState({
      error: {
          workType: workAndIncomeValidation.workType(workIncome, t),
          workStartDate: workAndIncomeValidation.workStartDate(workIncome, t),
          workEndDate: workAndIncomeValidation.workEndDate(workIncome, t),
          workEstimatedRetirementDate: workAndIncomeValidation.workEstimatedRetirementDate(workIncome, t),
          workHourPerWeek: workAndIncomeValidation.workHourPerWeek(workIncome, t),
          workIncome: workAndIncomeValidation.workIncome(workIncome, t),
          workIncomeCurrency: workAndIncomeValidation.workIncomeCurrency(workIncome, t),
          workPaymentDate: workAndIncomeValidation.workPaymentDate(workIncome, t),
          workPaymentFrequency: workAndIncomeValidation.workPaymentFrequency(workIncome, t)
        }

    })
  }

  render () {
    const { t, workIncome } = this.props
    const { error } = this.state

    return <div>
      <h2 className='typo-undertittel ml-0 mb-4 appDescription'>{t('pinfo:work-title')}</h2>
      <div className='mt-3'>
        <Nav.Row className='mb-4'>
          <div className='col-md-8'>
            <Nav.Select
              label={t('pinfo:work-type')}
              value={workIncome.workType || ''}
              onChange={this.setWorkType}
              feil={(this.state.displayError && error.workType) ? { feilmelding: error.workType } : null}
            >
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
            <Nav.Input label={t('pinfo:work-hour-per-week')} value={workIncome.workHourPerWeek || ''}
              onChange={this.setWorkHourPerWeek}
              feil={(this.state.displayError && error.workHourPerWeek) ? { feilmelding: error.workHourPerWeek } : null}
            />
          </div>
        </Nav.Row>
        <Nav.Row className='mb-4'>
          <div className='col-md-4'>
            <label>{t('pinfo:work-start-date')}</label>
            <ReactDatePicker
              className={
                classNames(
                  'skjemaelement__input input--fullbredde',
                  { 'skjemaelement__input--harFeil': this.state.displayError && error.workStartDate }
                )
              }
              selected={workIncome.workStartDate ? moment(workIncome.workStartDate) : undefined}
              dateFormat='DDMMYYYY'
              placeholderText={t('ui:dateFormat')}
              showYearDropdown
              showMonthDropdown
              dropdownMode='select'
              locale={this.props.locale}
              onMonthChange={this.setWorkStartDate}
              onYearChange={this.setWorkStartDate}
              onChange={this.setWorkStartDate}
            />
            {
              (this.state.displayError && error.workStartDate)
                ? (<div role='alert' aria-live='assertive'>
                  <div class='skjemaelement__feilmelding'>{error.workStartDate}</div>
                </div>)
                : null
            }
          </div>
          <div className='col-md-4'>
            <label>{t('pinfo:work-end-date')}</label>
            <ReactDatePicker
              className={
                classNames(
                  'skjemaelement__input input--fullbredde',
                  { 'skjemaelement__input--harFeil': this.state.displayError && error.workEndDate }
                )
              }
              selected={workIncome.workEndDate ? moment(workIncome.workEndDate) : undefined}
              dateFormat='DD.MM.YYYY'
              placeholderText={t('ui:dateFormat')}
              showYearDropdown
              showMonthDropdown
              dropdownMode='select'
              locale={this.props.locale}
              onMonthChange={this.setWorkEndDate}
              onYearChange={this.setWorkEndDate}
              onChange={this.setWorkEndDate}
            />
            {
              (this.state.displayError && error.workEndDate)
                ? (<div role='alert' aria-live='assertive'>
                  <div class='skjemaelement__feilmelding'>{error.workEndDate}</div>
                </div>)
                : null
            }
          </div>
          <div className='col-md-4'>
            <label>{t('pinfo:work-estimated-retirement-date')}</label>
            <ReactDatePicker
              className={
                classNames(
                  'skjemaelement__input input--fullbredde',
                  { 'skjemaelement__input--harFeil': this.state.displayError && error.workEstimatedRetirementDate }
                )
              }
              selected={workIncome.workEstimatedRetirementDate ? moment(workIncome.workEstimatedRetirementDate) : undefined}
              dateFormat='DD.MM.YYYY'
              placeholderText={t('ui:dateFormat')}
              showYearDropdown
              showMonthDropdown
              dropdownMode='select'
              locale={this.props.locale}
              onMonthChange={this.setWorkEstimatedRetirementDate}
              onYearChange={this.setWorkEstimatedRetirementDate}
              onChange={this.setWorkEstimatedRetirementDate}
            />
            {
              (this.state.displayError && error.workEstimatedRetirementDate)
                ? (<div role='alert' aria-live='assertive'>
                  <div class='skjemaelement__feilmelding'>{error.workEstimatedRetirementDate}</div>
                </div>)
                : null
            }
          </div>
        </Nav.Row>

        <Nav.Row className='mb-4'>
          <div className='col-md-6'>
            <Nav.Input label={t('pinfo:work-income')} value={workIncome.workIncome || ''}
              onChange={this.setWorkIncome}
              feil={(this.state.displayError && error.workIncome) ? { feilmelding: error.workIncome } : null}
            />
          </div>
          <div className='col-md-6'>
            <label>{t('pinfo:work-income-currency')}</label>
            <CountrySelect locale={this.props.locale} type={'currency'}
              value={workIncome.workIncomeCurrency || null}
              onSelect={this.setWorkIncomeCurrency}
              error={(this.state.displayError && error.workIncomeCurrency)}
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
                    { 'skjemaelement__input--harFeil': this.state.displayError && error.workPaymentDate }
                  )
                }
                selected={workIncome.workPaymentDate ? moment(workIncome.workPaymentDate) : undefined}
                dateFormat='DD.MM.YYYY'
                placeholderText={t('ui:dateFormat')}
                showYearDropdown
                showMonthDropdown
                dropdownMode='select'
                locale={this.props.locale}
                onMonthChange={this.setWorkPaymentDate}
                onYearChange={this.setWorkPaymentDate}
                onChange={this.setWorkPaymentDate}
              />
              {
                (this.state.displayError && error.workPaymentDate)
                  ? (<div role='alert' aria-live='assertive'>
                    <div class='skjemaelement__feilmelding'>{error.workPaymentDate}</div>
                  </div>)
                  : null
              }
          </div>
          <div className='col-md-6'>
            <Nav.Select label={t('pinfo:work-payment-frequency')} value={workIncome.workPaymentFrequency || ''}
              onChange={this.setWorkPaymentFrequency}
              feil={(this.state.displayError && error.workPaymentFrequency) ? { feilmelding: error.workPaymentFrequency } : null}
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
