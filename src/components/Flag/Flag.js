import React from 'react'
import PT from 'prop-types'
import classnames from 'classnames'

import './Flag.css'

const Flag = (props) => {
  const { label, className, size, flagPath, country, extension } = props
  let _size = size || 'M'

  return <div className={classnames(className, 'c-ui-flag', 'c-ui-flag__size-' + _size)} title={label}>
    <img alt={label} data-qa='Flag-img' src={''.concat(flagPath, country, extension)} />
  </div>
}

Flag.defaultProps = {
  flagPath: '../../../../flags/',
  country: '',
  extension: '.png'
}

Flag.propTypes = {
  size: PT.string,
  label: PT.string.isRequired,
  className: PT.string,
  flagPath: PT.string.isRequired,
  country: PT.string.isRequired,
  extension: PT.string.isRequired
}

export default Flag
