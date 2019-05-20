import React from 'react'
import classNames from 'classnames'

import Flag from './Flag'

const FlagList = (props) => {

  const { className, countries, overflowLimit, flagPath, extention } = props
  return <div className={classNames('d-flex', className)}>
    {countries.map((country, index) => (
      (index > overflowLimit - 1)
        ? null
        : <Flag data-qa='FlagList-Flag' key={index} flagPath={flagPath} country={country} extention={extention} />
    ))}
    {countries.length > overflowLimit
      ? <span data-qa='FlagList-overflow' className='pt-2'>+{countries.length - 2}</span>
      : null
    }
  </div>
}

FlagList.defaultProps = {
  countries: [],
  overflowLimit: 2,
  flagPath: '',
  extention: ''
}

export default FlagList
