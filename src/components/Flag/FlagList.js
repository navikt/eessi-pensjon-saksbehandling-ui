import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import CountryData from 'components/CountryData/CountryData'
import { Normaltekst } from 'components/Nav'
import Flag from './Flag'

import './Flag.css'

const FlagList = (props) => {
  const { className, items, locale, overflowLimit = 2, size } = props

  return <div
    className={classNames('c-flaglist', className)}>
    {items.map((item, index) => {
      if (index > overflowLimit - 1) {
        return null
      }
      let label = item.label || CountryData.findByValue(locale, item.country).label
      return <Flag
        className='m-2'
        size={size}
        key={index}
        country={item.country}
        label={label} />
    })}
    {items.length > overflowLimit
      ? <Normaltekst className='pt-2'>+{items.length - overflowLimit}</Normaltekst>
      : null}
  </div>
}

FlagList.propTypes = {
  className: PT.string,
  locale: PT.string.isRequired,
  items: PT.array.isRequired,
  overflowLimit: PT.number,
  size: PT.string
}

export default FlagList
