import React, { Component } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'

import CustomInput from './CustomInput'

import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.min.css'
import './DatePicker.css'

class DatePicker extends Component {
  render () {
    const { placeholder, selected, className, locale, error, errorMessage, onChange, id } = this.props

    return <React.Fragment>
      <ReactDatePicker
        id={id}
        placeholderText={placeholder}
        customInput={<CustomInput error={error !== undefined} {...this.props} />}
        selected={selected}
        dateFormat='dd.MM.yyyy'
        className={classNames('input-group', 'c-ui-datePicker', className)}
        showYearDropdown
        showMonthDropdown
        dropdownMode='select'
        locale={locale}
        onChange={onChange}
      />
      {error ? <div className='skjemaelement__feilmelding'>{errorMessage}</div> : null}
    </React.Fragment>
  }
}

DatePicker.propTypes = {
  selected: PT.object,
  className: PT.string,
  locale: PT.string,
  error: PT.string,
  errorMessage: PT.string,
  onChange: PT.func.isRequired,
  id: PT.string
}

export default DatePicker
