import React from 'react'
import PT from 'prop-types'

const CountryValue = (props) => {

  const { selectProps, data, innerProps } = props
  const flagImageUrl = selectProps.selectProps.flagImagePath + data.value + '.png'
  const _type = selectProps.selectProps.type || 'country'
  const _label = _type === 'country' ? data.label : (data.currency ? data.currency + ' - ' : '') + data.currencyLabel

  return <div className='c-countryValue' {...innerProps}>
    <img src={flagImageUrl} alt={data.label} />
    {_label}
  </div>
}

CountryValue.propTypes = {
  data: PT.object,
  innerProps: PT.object,
  selectProps: PT.object
}

export default CountryValue
