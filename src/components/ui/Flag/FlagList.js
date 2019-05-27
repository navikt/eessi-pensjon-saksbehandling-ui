import React from 'react'
import classNames from 'classnames'
import countryList from 'components/ui/CountrySelect/CountrySelectData'
import _ from 'lodash'
import Flag from './Flag'

import './Flag.css'

const FlagList = (props) => {
  const { className, locale, items, overflowLimit, flagPath, extention } = props
  return <div className={classNames('c-ui-flaglist', className)}>
    {items.map((item, index) => {
      if (index > overflowLimit - 1) {
        return null
      }
      let _label = item.label || _.find(countryList[locale], { value: item.country })
      return <Flag data-qa='FlagList-Flag' key={index} flagPath={flagPath} country={item.country} label={_label} extention={extention} />
    })}
    {items.length > overflowLimit
      ? <span data-qa='FlagList-overflow' className='pt-2'>+{items.length - overflowLimit}</span>
      : null
    }
  </div>
}

FlagList.defaultProps = {
  items: [],
  overflowLimit: 2,
  flagPath: '../../../../flags/',
  extention: '.png'
}

export default FlagList
