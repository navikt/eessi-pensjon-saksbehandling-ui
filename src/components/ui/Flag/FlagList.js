import React from 'react'
import classNames from 'classnames'
import countryList from 'components/ui/CountrySelect/CountrySelectData'
import _ from 'lodash'
import Flag from './Flag'

const FlagList = (props) => {
  const { className, locale, countries, overflowLimit, flagPath, extention } = props
  return <div className={classNames('d-flex', className)}>
    {countries.map((country, index) => {
      if (index > overflowLimit - 1) {
        return null
      }
      const label = _.find(countryList[locale], { value: country })
      return <Flag data-qa='FlagList-Flag' key={index} flagPath={flagPath} country={country} label={label.label} extention={extention} />
    })}
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
