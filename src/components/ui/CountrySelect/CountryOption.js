import React, { Component } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'

class CountryOption extends Component {
  render () {
    const { value, label, selectProps, data, innerProps, isSelected, isFocused } = this.props
    const flagImageUrl = selectProps.selectProps.flagImagePath + value + '.png'
    const _type = selectProps.selectProps.type || 'country'
    const _label = _type === 'country' ? label : (data.currency ? data.currency + ' - ' : '') + data.currencyLabel
    return <div id={selectProps.id + '-' + data.value}>
      <div className={classNames('c-ui-countryOption', {
        selected: isSelected,
        focused: isFocused
      })} {...innerProps}>
        <img src={flagImageUrl}
          alt={label}
          onError={selectProps.selectProps.onImageError}
        />
        <span className='c-ui-countryOption-label'>{_label}</span>
      </div>
    </div>
  }
}

CountryOption.propTypes = {
  value: PT.string,
  label: PT.string,
  selectProps: PT.object,
  data: PT.object,
  innerProps: PT.object,
  isSelected: PT.bool,
  isFocused: PT.bool
}

export default CountryOption
