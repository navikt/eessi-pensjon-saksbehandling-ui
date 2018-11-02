import React from 'react'
import PT from 'prop-types'
import moment from 'moment'
import ReactDatePicker from 'react-datepicker'
import classNames from 'classnames'
import _ from 'lodash'
import { connect } from 'react-redux'

import CountrySelect from '../ui/CountrySelect/CountrySelect'
import { setWorkIncome } from '../../actions/pinfo'
import * as Nav from '../ui/Nav'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    workIncome: _.pick(state.pinfo.form.workIncome,
      [
        'workType',
        'workStartDate',
        'workEndDate',
        'workEstimatedRetirementDate',
        'workHourPerWeek',
        'workIncome',
        'workIncomeCurrency',
        'workPaymentDate',
        'workPaymentFrequency'
      ]
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setWorkIncome: (key, payload) => { dispatch(setWorkIncome({ [key]: payload })) },
    setWorkIncomeEvent: (key, event) => { dispatch(setWorkIncome({ [key]: event.target.value })) },
    setWorkIncomeDate: (key, date) => { dispatch(setWorkIncome({ [key]: date ? date.valueOf() : null })) }
  }
}
class Work extends React.Component {
  constructor (props) {
    super(props)
    this.setWorkType = this.props.setWorkIncomeEvent.bind(null, 'workType')
    this.setWorkStartDate = this.props.setWorkIncomeDate.bind(null, 'workStartDate')
    this.setWorkEndDate = this.props.setWorkIncomeDate.bind(null, 'workEndDate')
    this.setWorkEstimatedRetirementDate = this.props.setWorkIncomeDate.bind(null, 'workEstimatedRetirementDate')
    this.setWorkHourPerWeek = this.props.setWorkIncomeEvent.bind(null, 'workHourPerWeek')
    this.setWorkIncome = this.props.setWorkIncomeEvent.bind(null, 'workIncome')
    this.setWorkIncomeCurrency = this.props.setWorkIncome.bind(null, 'workIncomeCurrency')
    this.setWorkPaymentDate = this.props.setWorkIncomeDate.bind(null, 'workPaymentDate')
    this.setWorkPaymentFrequency = this.props.setWorkIncomeEvent.bind(null, 'workPaymentFrequency')
  }

  render () {
    const { t, workIncome } = this.props
    return (
      <div className='mt-3'>
        <Nav.Row className='mb-4'>
          <div className='col-md-6'>

            <Nav.Select
              label={t('pinfo:form-workType') + ' *'}
              value={workIncome.workType || ''}
              onChange={this.setWorkType}
            >
              <option value=''>{t('pinfo:form-workType-select-option')}</option>
              <option value='01'>{t('pinfo:form-workType-option-01')}</option>
              <option value='02'>{t('pinfo:form-workType-option-02')}</option>
              <option value='03'>{t('pinfo:form-workType-option-03')}</option>
              <option value='04'>{t('pinfo:form-workType-option-04')}</option>
              <option value='05'>{t('pinfo:form-workType-option-05')}</option>
              <option value='06'>{t('pinfo:form-workType-option-06')}</option>
              <option value='07'>{t('pinfo:form-workType-option-07')}</option>
              <option value='08'>{t('pinfo:form-workType-option-08')}</option>
            </Nav.Select>
          </div>
        </Nav.Row>
        <Nav.Row className='mb-4'>
          <div className='col-md-4'>
            <label>{t('pinfo:form-workStartDate') + ' *'}</label>
            <ReactDatePicker
              className={
                classNames(
                  'skjemaelement__input input--fullbredde'
                )
              }
              selected={workIncome.workStartDate ? moment(workIncome.workStartDate) : undefined}
              dateFormat='DD.MM.YYYY'
              placeholderText={t('ui:dateFormat')}
              showYearDropdown
              showMonthDropdown
              dropdownMode='select'
              locale={this.props.locale}
              onMonthChange={this.setWorkStartDate}
              onYearChange={this.setWorkStartDate}
              onChange={this.setWorkStartDate}
            />
          </div>
          <div className='col-md-4'>
            <label>{t('pinfo:form-workEndDate') + ' *'}</label>
            <ReactDatePicker
              className={
                classNames(
                  'skjemaelement__input input--fullbredde'
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
          </div>
          <div className='col-md-4'>
            <label>{t('pinfo:form-workEstimatedRetirementDate') + ' *'}</label>
            <ReactDatePicker
              className={
                classNames(
                  'skjemaelement__input input--fullbredde'
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
          </div>
        </Nav.Row>
        <Nav.Row className='mb-4'>
          <div className='col-md-6'>
            <Nav.Input label={t('pinfo:form-workHourPerWeek') + ' *'} value={workIncome.workHourPerWeek || ''}
              onChange={this.setWorkHourPerWeek}
            />

          </div>
        </Nav.Row>
        <Nav.Row className='mb-4'>
          <div className='col-md-6'>
            <Nav.Input label={t('pinfo:form-workIncome') + ' *'} value={workIncome.workIncome || ''}
              onChange={this.setWorkIncome}
            />
          </div>
          <div className='col-md-6'>
            <label>{t('pinfo:form-workIncomeCurrency') + ' *'}</label>
            <CountrySelect locale={this.props.locale} type={'currency'}
              value={workIncome.workIncomeCurrency || null}
              onSelect={this.setWorkIncomeCurrency}
            />

          </div>
        </Nav.Row>
        <Nav.Row className='mb-4'>
          <div className='col-md-6'>
            <label>{t('pinfo:form-workPaymentDate') + ' *'}</label>
            <ReactDatePicker
              className={
                classNames(
                  'skjemaelement__input input--fullbredde'
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
          </div>
          <div className='col-md-6'>
            <Nav.Select label={t('pinfo:form-workPaymentFrequency') + ' *'} value={workIncome.workPaymentFrequency || ''}
              onChange={this.setWorkPaymentFrequency}
            >
              <option value=''>{t('pinfo:form-workPaymentFrequency-choose-option')}</option>
              <option value='01'>{t('pinfo:form-workPaymentFrequency-option-01')}</option>
              <option value='02'>{t('pinfo:form-workPaymentFrequency-option-02')}</option>
              <option value='03'>{t('pinfo:form-workPaymentFrequency-option-03')}</option>
              <option value='04'>{t('pinfo:form-workPaymentFrequency-option-04')}</option>
              <option value='05'>{t('pinfo:form-workPaymentFrequency-option-05')}</option>
              <option value='06'>{t('pinfo:form-workPaymentFrequency-option-06')}</option>
              <option value='99'>{t('pinfo:form-workPaymentFrequency-option-99')}</option>
            </Nav.Select>
          </div>
        </Nav.Row>
      </div>
    )
  }
}
Work.propTypes = {
  work: PT.object,
  action: PT.func,
  t: PT.func,
  locale: PT.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Work)
