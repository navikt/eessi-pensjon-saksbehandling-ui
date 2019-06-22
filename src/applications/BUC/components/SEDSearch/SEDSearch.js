import React, { useState } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { Panel, Input } from 'components/ui/Nav'
import MultipleSelect from 'components/ui/MultipleSelect/MultipleSelect'
import './SEDSearch.css'

const SEDSearch = (props) => {
  const [ _query, setQuery ] = useState(undefined)
  const [ _country, setCountry ] = useState([])

  const { t, onSearch, onCountrySearch, className, locale } = props

  const stopPropagation = (e) => {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  const onQueryChange = (e) => {
    if (typeof onSearch === 'function') {
      setQuery(e.target.value)
      onSearch(e.target.value)
    }
  }

  const onCountryChange = (countryList) => {
    if (typeof onCountrySearch === 'function') {
      onCountrySearch(countryList)
      setCountry(countryList)
    }
  }

  return <Panel
    className={classNames('a-buc-c-sedsearch', 'p-2', className)}
    id='a-buc-c-sedsearch__panel-id'>
     <Input
      className='a-buc-c-sedsearch__query'
      label={''}
      bredde='fullbredde'
      value={_query} onChange={onQueryChange}
      placeholder={t('buc:form-filterSED')}
      onClick={stopPropagation}
    />
    <MultipleSelect
      id='a-buc-c-sedsearch__country-id'
      className='a-buc-c-sedsearch__country multipleSelect'
      creatable
      placeholder={t('buc:form-searchForCountry')}
      locale={locale}
      value={_country}
      hideSelectedOptions={false}
      onChange={onCountryChange}
      optionList={[]} />
    </Panel>
}

SEDSearch.propTypes = {
  t: PT.func.isRequired,
  onSearch: PT.func,
  onCountrySearch: PT.func,
  className: PT.string,
  locale: PT.string.isRequired
}

export default SEDSearch
