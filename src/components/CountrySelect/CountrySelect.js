import React, { Component } from 'react'
import Select from 'react-select'
import PT from 'prop-types'
import CountryData from '../CountryData/CountryData'
import _ from 'lodash'
import classNames from 'classnames'
import CountryOption from './CountryOption'
import CountryValue from './CountryValue'
import CountryErrorStyle from './CountryErrorStyle'

import './CountrySelect.css'

class CountrySelect extends Component {
  onChange (val) {
    const { onSelect } = this.props
    if (typeof onSelect === 'function') {
      onSelect(val)
    }
  }

  include (selectedCountries, allCountries) {
    return _.filter(allCountries, country => {
      return selectedCountries.indexOf(country.value) >= 0
    })
  }

  exclude (selectedCountries, allCountries) {
    return _.filter(allCountries, country => {
      return selectedCountries.indexOf(country.value) < 0
    })
  }

  render () {
    const {
      id,
      placeholder,
      value,
      locale,
      type,
      includeList,
      excludeList,
      className,
      styles = {},
      error = false,
      components,
      errorMessage
    } = this.props

    let optionList = CountryData.getData(locale)
    let options = (includeList ? this.include(includeList, optionList) : optionList)
    options = (excludeList ? this.exclude(excludeList, options) : options)

    let defValue = value
    if (defValue && !defValue.label) {
      defValue = _.find(options, { value: defValue.value ? defValue.value : defValue })
    }
    return <div id={id} className={classNames('c-countrySelect', className, { 'skjemaelement__feilmelding': error })}>
      <Select placeholder={placeholder}
        value={defValue || null}
        options={options}
        id={id ? id + '-select' : null}
        components={{
          Option: CountryOption,
          SingleValue: CountryValue,
          ...components }}
        selectProps={{
          type: type,
          flagImagePath: '../../../../../flags/'
        }}
        className='CountrySelect'
        classNamePrefix='CountrySelect'
        onChange={this.onChange.bind(this)}
        styles={{ ...styles, ...CountryErrorStyle(error) }}
        tabSelectsValue={false}
        multi={false}
      />
      {error
        ? <div role='alert' aria-live='assertive'>
          <div className='skjemaelement__feilmelding'>
            {errorMessage}
          </div>
        </div>
        : null
      }
    </div>
  }
}
CountrySelect.propTypes = {
  onSelect: PT.func.isRequired,
  value: PT.oneOfType([PT.object, PT.string]),
  locale: PT.string.isRequired,
  style: PT.object,
  includeList: PT.array,
  excludeList: PT.array,
  type: PT.string,
  className: PT.string,
  required: PT.string,
  id: PT.string,
  inputProps: PT.object,
  customInputProps: PT.object,
  errorMessage: PT.string,
  styles: PT.object,
  error: PT.bool,
  components: PT.object
}

export default CountrySelect
