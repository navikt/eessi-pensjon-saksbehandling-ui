import React, { Component } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'

import { Input } from '../Nav'

import './DatePicker.css'

class DatePicker extends Component {
  state = {
    errors: {}
  }

  constructor (props) {
    super(props)

    this.maxLengthDay = this.maxLength.bind(this, 2)
    this.maxLengthMonth = this.maxLength.bind(this, 2)
    this.maxLengthYear = this.maxLength.bind(this, 4)
    this.onChangeday = this.dateChange.bind(this, 'day')
    this.onChangeMonth = this.dateChange.bind(this, 'month')
    this.onChangeYear = this.dateChange.bind(this, 'year')
  }

  maxLength (limit, event) {
    const target = event.target
    if (target.value.length > limit) {
      target.value = target.value.slice(0, limit)
    }
  }

  dateChange (key, event) {
    const { values, onChange } = this.props

    const value = event.target.value

    let newDate

    if (!value) {
      let newValues = Object.assign({}, values)
      delete newValues[key]
      newDate = Object.assign({}, newValues)
    } else {
      newDate = Object.assign({}, values, { [key]: value })
    }

    this.setState({
      errors: this.checkValidity(newDate)
    })
    onChange(newDate)
  }

  checkValidity (newDate) {
    return Object.assign(
      {},
      this.inValidDay(newDate),
      this.inValidMonth(newDate),
      this.inValidYear(newDate)
    )
  }

  inValidDay (date) {
    const day = date.day
    let monthInteger = parseInt(date.month, 10) - 1
    let yearInteger = parseInt(date.year, 10)
    if (isNaN(monthInteger) || monthInteger < 0 || monthInteger > 11) {
      monthInteger = 0
    }
    if (isNaN(yearInteger)) {
      yearInteger = 0
    }
    if (!moment({ year: (yearInteger || 0), month: (monthInteger || 0), day: day }).isValid()) {
      return { day: true }
    }
    return undefined
  }

  inValidMonth (date) {
    if (!date.month) {
      return undefined
    }
    const monthInteger = parseInt(date.month, 10)
    if (isNaN(monthInteger) || monthInteger < 1 || monthInteger > 12) {
      return { month: true }
    }
    return undefined
  }

  inValidYear (date) {
    if (!date.year) {
      return undefined
    }
    const yearInteger = parseInt(date.year, 10)
    if (isNaN(yearInteger)) {
      return { year: true }
    }
    return undefined
  }

  render () {
    const { className, labels = {}, ids = {}, placeholders = {}, values = {}, feil } = this.props
    const { errors } = this.state
    return (
      <div className={classNames('datePicker', className)} onBlur={this._onBlur} onFocus={this._onFocus}>
        <div className={'row pr-2 mb-3'}>
          <div className={'col pl-2 pr-1'}>
            <Input
              className={'DatePickerDayInput'}
              label={labels.day || 'dag'}
              id={ids.day || ''}
              placeholder={placeholders.day}
              type='number'
              min='1'
              max='31'
              value={(values.day !== undefined) ? values.day : ''}
              onInput={this.maxLengthDay}
              onChange={this.onChangeday}
              feil={(errors.day || feil) ? { feilmelding: '' } : null}
            />
          </div>
          <div className={'col pl-1 pr-1'}>
            <Input
              className={'DatePickerMonthInput'}
              label={labels.month || 'måned'}
              id={ids.month || ''}
              placeholder={placeholders.month}
              type='number'
              min='1'
              max='12'
              value={values.month !== undefined ? values.month : ''}
              onInput={this.maxLengthMonth}
              onChange={this.onChangeMonth}
              feil={errors.month || feil ? { feilmelding: '' } : null}
            />
          </div>
          <div className={'col col pl-1 pr-0'}>
            <Input
              className={'DatePickerYearInput'}
              label={labels.year || 'år'}
              id={ids.year || ''}
              placeholder={placeholders.year}
              type='number'
              min='1900'
              value={values.year !== undefined ? values.year : ''}
              onInput={this.maxLengthYear}
              onChange={this.onChangeYear}
              feil={errors.year || feil ? { feilmelding: '' } : null}
            />
          </div>
        </div>
        {feil ? <div role='alert' aria-live='assertive'>
          <div className='skjemaelement__feilmelding'>
            {feil.feilmelding}
          </div>
        </div>
          : null}
      </div>
    )
  }
}

DatePicker.propTypes = {
  required: PT.object,
  ids: PT.object,
  values: PT.object,
  feil: PT.object,
  labels: PT.object,
  onChange: PT.func.isRequired
}

export default DatePicker
