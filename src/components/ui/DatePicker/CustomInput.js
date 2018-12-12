import React, { Component } from 'react'
import PT from 'prop-types'

class CustomInput extends Component {
  render () {
    const { onClick, onChange, value, placeholder, id } = this.props
    return <div className='input-group' onClick={onClick}>
      <input
        id={id}
        type='text'
        className='form-control'
        placeholder={placeholder}
        onChange={onChange}
        value={value} />
      <div className='input-group-append'>
        <span role='img' aria-label='date' className='input-group-text'>📅</span>
      </div>
    </div>
  }
}

CustomInput.propTypes = {
  onClick: PT.func,
  value: PT.string
}

export default CustomInput
