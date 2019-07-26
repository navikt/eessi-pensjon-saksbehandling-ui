import React from 'react'
import PT from 'prop-types'
import classnames from 'classnames'

import './Flag.css'

const Flag = (props) => {
  const { className, country, extension = '.png', flagPath = '../../../../flags/', label, size = 'M' } = props

  return <div
    className={classnames(className, 'c-flag', 'c-flag__size-' + size)}
    title={label}>
    <img
      alt={label}
      src={''.concat(flagPath, country, extension)} />
  </div>
}

Flag.propTypes = {
  className: PT.string,
  country: PT.string.isRequired,
  extension: PT.string,
  flagPath: PT.string,
  label: PT.string.isRequired,
  size: PT.string
}

export default Flag
