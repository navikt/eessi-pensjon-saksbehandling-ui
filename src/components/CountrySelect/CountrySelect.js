import React from 'react'
import Select from 'react-select'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import CountryData from 'components/CountryData/CountryData'
import CountryOption from 'components/CountrySelect/CountryOption'
import CountryValue from 'components/CountrySelect/CountryValue'
import CountryErrorStyle from 'components/CountrySelect/CountryErrorStyle'

import './CountrySelect.css'

const CountrySelect = (props) => {
  const { className, components, error = false, errorMessage, excludeList, id } = props
  const { includeList, locale, onSelect, placeholder, type, styles = {}, value } = props

  const include = (selectedCountries, allCountries) => {
    return _(allCountries).filter(country => {
      return selectedCountries.indexOf(country.value) >= 0
    })
  }

  const exclude = (selectedCountries, allCountries) => {
    return _(allCountries).filter(country => {
      return selectedCountries.indexOf(country.value) < 0
    })
  }

  const optionList = CountryData.getData(locale)
  let options = (includeList ? include(includeList, optionList) : optionList)
  options = (excludeList ? exclude(excludeList, options) : options)

  let defValue = value
  if (defValue && !defValue.label) {
    defValue = _(options).find({ value: defValue.value ? defValue.value : defValue })
  }

  return <div
    id={id}
    className={classNames('c-countrySelect', className, { 'skjemaelement__feilmelding': error })}>
    <Select
      placeholder={placeholder}
      value={defValue || null}
      options={options}
      id={id ? id + '-select' : null}
      components={{
        Option: CountryOption,
        SingleValue: CountryValue,
        ...components
      }}
      selectProps={{
        type: type,
        flagImagePath: '../../../../../flags/'
      }}
      className='c-countrySelect__select'
      classNamePrefix='c-countrySelect__select'
      onChange={onSelect}
      styles={{
        ...styles,
        ...CountryErrorStyle(error)
      }}
      tabSelectsValue={false}
      multi={false}
    />
    {error
      ? <div role='alert' aria-live='assertive' className='skjemaelement__feilmelding'>
        {errorMessage}
      </div>
      : null }
  </div>
}

CountrySelect.propTypes = {
  className: PT.string,
  components: PT.object,
  error: PT.bool,
  errorMessage: PT.string,
  excludeList: PT.array,
  id: PT.string,
  includeList: PT.array,
  locale: PT.string.isRequired,
  onSelect: PT.func.isRequired,
  placeholder: PT.string,
  type: PT.string,
  styles: PT.object,
  value: PT.oneOfType([PT.object, PT.string])
}

export default CountrySelect
