import React, { Component } from 'react'
import Select from 'react-select'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { countries } from './CountrySelectData'
import _ from 'lodash'
import classNames from 'classnames'
import CountryOption from './CountryOption'
import CountryValue from './CountryValue'
import CountryErrorStyle from './CountryErrorStyle'

class CountrySelect extends Component {

    onChange (val) {
      const { onSelect } = this.props
      if (typeof onSelect === 'function') {
        onSelect(val)
      }
    }

  filter (selectedCountries, allCountries) {
    return _.filter(allCountries, country => {
      return selectedCountries.indexOf(country.value) >= 0
    })
  }

  render () {
    const { t, value, locale, type, list, className, styles = {}, error = false } = this.props

      let optionList = countries[locale]
      let options = (list ? this.filter(list, optionList) : optionList)
      let defValue = value
      if (defValue && !defValue.label) {
        defValue = _.find(options, { value: defValue.value ? defValue.value : defValue })
      }
      return <div className={classNames('c-ui-countrySelect', className)}>
        <Select placeholder={t('ui:searchCountry')}
          value={defValue || null}
          options={options}
          id={this.props.id}
          components={{
            Option: CountryOption,
            SingleValue: CountryValue,
            ...this.props.components }}
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
              {this.props.errorMessage}
            </div>
          </div>
          : null
        }
      </div>
    }
}
CountrySelect.propTypes = {
  onSelect: PT.func.isRequired,
  value: PT.oneOfType([PT.object, PT.string]).isRequired,
  t: PT.func.isRequired,
  locale: PT.string.isRequired,
  style: PT.object,
  list: PT.array,
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

export default withNamespaces()(CountrySelect)
