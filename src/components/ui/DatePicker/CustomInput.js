import React, { Component } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'

class CustomInput extends Component {
  render () {
    const { onClick, onChange, value, placeholder, error, id } = this.props
    return <div className='input-group'>
      <input
        id={id}
        type='text'
        className={classNames('form-control', { 'skjemaelement__input--harFeil': error })}
        placeholder={placeholder}
        onChange={onChange}
        value={value} />
      <div style={{ cursor: 'pointer' }} className='input-group-append' onClick={onClick}>
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
