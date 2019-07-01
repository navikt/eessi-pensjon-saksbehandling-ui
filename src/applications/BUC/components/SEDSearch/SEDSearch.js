import React, { useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import { Panel, Input } from 'components/ui/Nav'
import CountryData from 'components/ui/CountryData/CountryData'
import MultipleSelect from 'components/ui/MultipleSelect/MultipleSelect'

import './SEDSearch.css'

const SEDSearch = (props) => {
  const [ _query, setQuery ] = useState(undefined)
  const [ _country, setCountry ] = useState([])
  const [ _status, setStatus ] = useState([])

  const { t, className, locale, onSearch, onCountrySearch, onStatusSearch, seds } = props

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

  const onStatusChange = (statusList) => {
    if (typeof onStatusSearch === 'function') {
      onStatusSearch(statusList)
      setStatus(statusList)
    }
  }

  const availableStatuses = [{
    label: t('ui:empty'),
    value: null
  }, {
    label: t('ui:new'),
    value: 'new'
  }, {
    label: t('ui:cancelled'),
    value: 'cancelled'
  }, {
    label: t('ui:received'),
    value: 'received'
  }, {
    label: t('ui:sent'),
    value: 'sent'
  }]

  const availableCountries = []
  if (seds) {
    seds.forEach(sed => {
      sed.participants.forEach(it => {
        if (!_.find(availableCountries, { value: it.organisation.countryCode })) {
          const country = CountryData.findByValue(locale, it.organisation.countryCode)
          availableCountries.push({
            label: country ? country.label : it.organisation.countryCode,
            value: it.organisation.countryCode
          })
        }
      })
    })
  }

  return <Panel
    className={classNames('a-buc-c-sedsearch', 'p-2', className)}
    id='a-buc-c-sedsearch__panel-id'>
    <Input
      className='a-buc-c-sedsearch__query pl-1 pr-1'
      label={''}
      bredde='fullbredde'
      value={_query} onChange={onQueryChange}
      placeholder={t('buc:form-filterSED')}
      onClick={stopPropagation}
    />
    <MultipleSelect
      id='a-buc-c-sedsearch__status-id'
      className='a-buc-c-sedsearch__status multipleSelect pl-1 pr-1'
      placeholder={t('buc:form-searchForStatus')}
      locale={locale}SE
      value={_status}
      hideSelectedOptions={false}
      onChange={onStatusChange}
      optionList={availableStatuses} />
    <MultipleSelect
      id='a-buc-c-sedsearch__country-id'
      className='a-buc-c-sedsearch__country multipleSelect pl-1 pr-1'
      placeholder={t('buc:form-searchForCountry')}
      locale={locale}
      value={_country}
      hideSelectedOptions={false}
      onChange={onCountryChange}
      optionList={availableCountries} />
  </Panel>
}

SEDSearch.propTypes = {
  t: PT.func.isRequired,
  onSearch: PT.func.isRequired,
  onCountrySearch: PT.func.isRequired,
  onStatusSearch: PT.func.isRequired,
  className: PT.string,
  locale: PT.string.isRequired
}

export default SEDSearch
