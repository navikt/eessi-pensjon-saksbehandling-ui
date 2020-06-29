import classNames from 'classnames'
import _ from 'lodash'
import moment from 'moment'
import PT from 'prop-types'
import React, { useState } from 'react'
import { Feilmelding } from 'nav-frontend-typografi'
import { Input } from 'nav-frontend-skjema'
import './DatePicker.css'

type DateElement = 'day' |'month' | 'year'
type Labels = {[K in DateElement]?: string}
const LabelsPropType = PT.shape({
  day: PT.string.isRequired,
  month: PT.string.isRequired,
  year: PT.string.isRequired
})
export type DateValues = {[K in DateElement]?: string | undefined | null}
const DateValuesPropType = PT.shape({
  day: PT.string,
  month: PT.string,
  year: PT.string
})
type DateError = {[K in DateElement]?: boolean}

const defaultLabels: Labels = { day: 'Dag', month: 'Måned', year: 'År' }
const defaultPlaceholders: Labels = { day: 'DD', month: 'MM', year: 'ÅÅÅÅ' }

export interface DatePickerProps {
  className ?: string;
  disabled ?: boolean;
  error ?: string | undefined;
  id?: string;
  ids?: Labels;
  initialValues?: DateValues;
  labels?: Labels;
  onBlur?: (e: React.FocusEvent) => void;
  onChange?: (d: DateValues) => void;
  onFocus?: (e: React.FocusEvent) => void;
  placeholders?: Labels;
}

const DatePicker: React.FC<DatePickerProps> = ({
  className, disabled = false, error, id, ids, initialValues = {}, labels, onBlur, onChange, onFocus, placeholders
}: DatePickerProps): JSX.Element => {
  const _labels: Labels = { ...defaultLabels, ...labels }
  const _placeholders: Labels = { ...defaultPlaceholders, ...placeholders }
  const [values, setValues] = useState<DateValues>(initialValues)
  const [errors, setErrors] = useState<DateError>({})
  const [_timeoutID, setTimeoutID] = useState<any>(null)
  const [focus, setFocus] = useState<boolean>(false)

  const handleOnBlur = (event: React.FocusEvent): void => {
    event.persist()
    setTimeoutID(
      setTimeout(() => {
        setFocus(false)
        if (typeof onBlur === 'function') {
          onBlur(event)
        }
      }, 0)
    )
  }

  const handleOnFocus = (event: React.FocusEvent): void => {
    clearTimeout(_timeoutID)
    if (!focus) {
      setFocus(true)
      if (typeof onFocus === 'function') {
        onFocus(event)
      }
    }
  }

  const maxLength = (limit: number, event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target
    if (target.value.length > limit) {
      target.value = target.value.slice(0, limit)
    }
  }

  const invalidDay = (date: DateValues): DateError | undefined => {
    const day = date.day!
    let monthInteger: number = parseInt(date.month!, 10) - 1
    let yearInteger: number = parseInt(date.year!, 10)
    if (isNaN(monthInteger) || monthInteger < 0 || monthInteger > 11) {
      monthInteger = 0
    }
    if (isNaN(yearInteger)) {
      yearInteger = 0
    }

    if (!moment({ year: (yearInteger || 0), month: (monthInteger || 0), day: parseInt(day, 10) }).isValid()) {
      return { day: true } as DateError
    }

    return undefined
  }

  const invalidMonth = (date: DateValues): DateError | undefined => {
    if (!date.month) {
      return undefined
    }
    const monthInteger = parseInt(date.month, 10)

    if (isNaN(monthInteger) || monthInteger < 1 || monthInteger > 12) {
      return { month: true }
    }
    return undefined
  }

  const invalidYear = (date: DateValues): DateError | undefined => {
    if (!date.year) {
      return undefined
    }
    const yearInteger = parseInt(date.year, 10)
    if (isNaN(yearInteger)) {
      return { year: true }
    }
    return undefined
  }

  const checkValidity = (newDate: DateValues): DateError => {
    return Object.assign(
      {},
      invalidDay(newDate),
      invalidMonth(newDate),
      invalidYear(newDate)
    )
  }

  const dateChange = (key: DateElement, event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value
    let newDate

    if (!value) {
      const newValues: DateValues = Object.assign({}, values)
      delete newValues[key]
      newDate = Object.assign({}, newValues)
    } else {
      newDate = Object.assign({}, values, { [key]: value })
    }
    setValues(newDate)
    setErrors(checkValidity(newDate))
    if (_.isFunction(onChange)) {
      onChange(newDate)
    }
  }

  const handleMaxLengthDay = (e: React.ChangeEvent<HTMLInputElement>) => { maxLength(2, e) }
  const handleMaxLengthMonth = (e: React.ChangeEvent<HTMLInputElement>) => { maxLength(2, e) }
  const handleMaxLengthYear = (e: React.ChangeEvent<HTMLInputElement>) => { maxLength(4, e) }
  const handleChangeDay = (e: React.ChangeEvent<HTMLInputElement>) => { dateChange('day', e) }
  const handleChangeMonth = (e: React.ChangeEvent<HTMLInputElement>) => { dateChange('month', e) }
  const handleChangeYear = (e: React.ChangeEvent<HTMLInputElement>) => { dateChange('year', e) }

  return (
    <div
      id={id}
      className={classNames('c-datePicker', className)}
      onBlur={handleOnBlur}
      onFocus={handleOnFocus}
    >
      <div className='row no-gutters pr-2'>
        <div className='col pl-2 pr-1'>
          <Input
            className='DatePickerDayInput'
            label={_labels.day || 'dag'}
            id={ids ? ids.day : ''}
            placeholder={_placeholders.day}
            type='number'
            min='1'
            max='31'
            disabled={disabled}
            value={!_.isNil(values.day) ? values.day : ''}
            onInput={handleMaxLengthDay}
            onChange={handleChangeDay}
            feil={(errors.day || error) ? <span /> : false}
          />
        </div>
        <div className='col pl-1 pr-1'>
          <Input
            className='DatePickerMonthInput'
            label={_labels.month || 'måned'}
            id={ids ? ids.month : ''}
            placeholder={_placeholders.month}
            type='number'
            min='1'
            max='12'
            disabled={disabled}
            value={!_.isNil(values.month) ? values.month : ''}
            onInput={handleMaxLengthMonth}
            onChange={handleChangeMonth}
            feil={errors.month || error ? <span /> : false}
          />
        </div>
        <div className='col col pl-1 pr-0'>
          <Input
            className='DatePickerYearInput'
            label={_labels.year || 'år'}
            id={ids ? ids.year : ''}
            placeholder={_placeholders.year}
            type='number'
            min='1900'
            disabled={disabled}
            value={!_.isNil(values.year) ? values.year : ''}
            onInput={handleMaxLengthYear}
            onChange={handleChangeYear}
            feil={errors.year || error ? <span /> : false}
          />
        </div>
      </div>
      {error ? (
        <div role='alert' aria-live='assertive' className='feilmelding skjemaelement__feilmelding'>
          <Feilmelding>{error}</Feilmelding>
        </div>
      )
        : null}
    </div>
  )
}

DatePicker.propTypes = {
  className: PT.string,
  disabled: PT.bool,
  error: PT.string,
  ids: LabelsPropType,
  initialValues: DateValuesPropType,
  labels: LabelsPropType,
  onBlur: PT.func,
  onFocus: PT.func,
  onChange: PT.func,
  placeholders: LabelsPropType
}
DatePicker.displayName = 'DatePicker'
export default DatePicker
