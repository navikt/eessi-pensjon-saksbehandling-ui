import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'

const CountryOption = (props) => {
  const { data, innerProps, isSelected, isFocused, label, selectProps, value } = props
  const flagImageUrl = selectProps.selectProps.flagImagePath + value + '.png'
  const _type = selectProps.selectProps.type || 'country'
  const _label = _type === 'country' ? label : (data.currency ? data.currency + ' - ' : '') + data.currencyLabel
  return <div id={selectProps.id + '-' + data.value}>
    <div className={classNames('c-countryOption', {
      selected: isSelected,
      focused: isFocused
    })} {...innerProps}>
      <img
        src={flagImageUrl}
        alt={label}
        onError={selectProps.selectProps.onImageError}
      />
      <span className='c-countryOption__label'>{_label}</span>
    </div>
  </div>
}

CountryOption.propTypes = {
  data: PT.object,
  innerProps: PT.object,
  isSelected: PT.bool,
  isFocused: PT.bool,
  label: PT.string,
  selectProps: PT.object,
  value: PT.string
}

export default CountryOption
