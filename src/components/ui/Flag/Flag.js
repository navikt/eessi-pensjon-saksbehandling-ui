import React from 'react'
import PT from 'prop-types'
import classnames from 'classnames'

import './Flag.css'

const Flag = (props) => {
  const { label, className, flagPath, country, extension } = props
  return <div className={classnames(className, 'c-ui-flag')} title={label}>
    <img alt={label} data-qa='Flag-img' className='flag-image' src={''.concat(flagPath, country, extension)} />
  </div>
}

Flag.defaultProps = {
  flagPath: '../../../../flags/',
  country: '',
  extension: '.png'
}

Flag.propTypes = {
  label: PT.string.isRequired,
  className: PT.string,
  flagPath: PT.string.isRequired,
  country: PT.string.isRequired,
  extension: PT.string.isRequired
}

export default Flag
