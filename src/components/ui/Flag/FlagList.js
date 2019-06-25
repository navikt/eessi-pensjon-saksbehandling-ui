import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import countryList from 'components/ui/CountrySelect/CountrySelectData'
import _ from 'lodash'
import Flag from './Flag'

import './Flag.css'

const FlagList = (props) => {
  const { className, locale, size, items, overflowLimit } = props

  return <div className={classNames('c-ui-flaglist', className)}>
    {items.map((item, index) => {
      if (index > overflowLimit - 1) {
        return null
      }
      let _label = item.label || _.find(countryList[locale], { value: item.country }).label
      return <Flag size={size} className={classNames('m-2')} data-qa='FlagList-Flag' key={index} country={item.country} label={_label} />
    })}
    {items.length > overflowLimit
      ? <span data-qa='FlagList-overflow' className='pt-2'>+{items.length - overflowLimit}</span>
      : null
    }
  </div>
}

FlagList.defaultProps = {
  items: [],
  overflowLimit: 2
}

FlagList.propTypes = {
  className: PT.string,
  locale: PT.string,
  size: PT.string,
  items: PT.array.isRequired,
  overflowLimit: PT.number
}

export default FlagList
