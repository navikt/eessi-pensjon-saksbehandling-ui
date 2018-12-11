import React, { Component } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'

import CustomInput from './CustomInput'

import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.min.css'

class DatePicker extends Component {
  render () {
    const { selected, className, locale, error, onChange, placeholder } = this.props

    return <React.Fragment>
      <ReactDatePicker
        customInput={<CustomInput {...this.props} />}
        selected={selected}
        className={classNames('input-group', className)}
        dateFormat='dd.MM.yyyy'
        showYearDropdown
        showMonthDropdown
        dropdownMode='select'
        locale={locale}
        onChange={onChange} />
      {error ? <div>{error}</div> : null}
    </React.Fragment>
  }
}

DatePicker.propTypes = {

}

export default DatePicker
