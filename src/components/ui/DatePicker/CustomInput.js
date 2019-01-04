import React, { Component } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'

class CustomInput extends Component {
  render () {
    const { onClick, error, className } = this.props
    return <div className={className}>
      <input {...this.props} autocomplete='off' className={classNames(className, 'form-control')} />
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
