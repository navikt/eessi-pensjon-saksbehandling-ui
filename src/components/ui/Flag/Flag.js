import React from 'react'
import classnames from 'classnames'
import './Flag.css'

const Flag = (props) => {
  return <div className='c-ui-flag m-1' title={props.label}>
    <img alt={props.label} data-qa='Flag-img' className={classnames(props.className, 'flag-image')} src={''.concat(props.flagPath, props.country, props.extention)} />
  </div>
}

Flag.defaultProps = {
  flagPath: '',
  country: '',
  extention: ''
}

export default Flag
