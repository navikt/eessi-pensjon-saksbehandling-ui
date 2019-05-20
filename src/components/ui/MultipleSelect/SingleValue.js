import React from 'react'
import PT from 'prop-types'

const SingleValue = (props) => {

  const { selectProps, value, innerProps } = props

  return <div className='c-ui-singleValue' {...innerProps}>
    {value}
  </div>
}

SingleValue.propTypes = {
  selectProps: PT.object,
  value: PT.object,
  innerProps: PT.object
}

export default SingleValue
