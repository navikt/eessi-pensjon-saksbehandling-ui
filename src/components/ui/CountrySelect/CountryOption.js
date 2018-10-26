import React, { Component } from 'react'
import PT from 'prop-types'

class CountryOption extends Component {
  render () {
    const { value, label, selectProps, data, innerProps, isSelected, isFocused } = this.props
    const flagImageUrl = selectProps.selectProps.flagImagePath + value + '.png'
    const _type = selectProps.selectProps.type || 'country'
    const _label = _type === 'country' ? label : (data.currency ? data.currency + ' - ' : '') + data.currencyLabel
    const divStyle = {
      padding: 5
    }

    if (isSelected) {
      divStyle.backgroundColor = 'lightblue'
    }
    if (isFocused) {
      divStyle.backgroundColor = 'aliceblue'
    }

    return <div style={divStyle} {...innerProps}>
      <img src={flagImageUrl}
        alt={label}
        style={{
          width: 50,
          height: 30
        }}
        onError={selectProps.selectProps.onImageError}
      />
      {_label}
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
