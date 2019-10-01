import React, { useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import { CountryData, MultipleSelect, Nav } from 'eessi-pensjon-ui'

import './SEDSearch.css'

const SEDSearch = ({ className, locale, onCountrySearch, onSearch, onStatusSearch, seds, t }) => {
  const [_query, setQuery] = useState(undefined)
  const [_country, setCountry] = useState([])
  const [_status, setStatus] = useState([])

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
      if (_.isArray(sed.participants)) {
        sed.participants.forEach(it => {
          if (!_.find(availableCountries, { value: it.organisation.countryCode })) {
            const country = CountryData.findByValue(locale, it.organisation.countryCode)
            availableCountries.push({
              label: country ? country.label : it.organisation.countryCode,
              value: it.organisation.countryCode
            })
          }
        })
      }
    })
  }

  return (
    <Nav.Panel
      id='a-buc-c-sedsearch__panel-id'
      className={classNames('a-buc-c-sedsearch', 'p-2', 's-border', className)}
    >
      <Nav.Input
        id='a-buc-c-sedsearch__query-input-id'
        className='a-buc-c-sedsearch__query-input pl-1 pr-1'
        label=''
        bredde='fullbredde'
        value={_query || ''}
        onChange={onQueryChange}
        placeholder={t('buc:form-filterSED')}
        onClick={stopPropagation}
      />
      <MultipleSelect
        id='a-buc-c-sedsearch__status-select-id'
        className='a-buc-c-sedsearch__status-select multipleSelect pl-1 pr-1'
        placeholder={t('buc:form-searchForStatus')}
        locale={locale}
        values={_status}
        hideSelectedOptions={false}
        onChange={onStatusChange}
        optionList={availableStatuses}
      />
      <MultipleSelect
        id='a-buc-c-sedsearch__country-select-id'
        className='a-buc-c-sedsearch__country-select multipleSelect pl-1 pr-1'
        placeholder={t('buc:form-searchForCountry')}
        locale={locale}
        values={_country}
        hideSelectedOptions={false}
        onChange={onCountryChange}
        optionList={availableCountries}
      />
    </Nav.Panel>
  )
}

SEDSearch.propTypes = {
  className: PT.string,
  locale: PT.string.isRequired,
  onSearch: PT.func.isRequired,
  onCountrySearch: PT.func.isRequired,
  onStatusSearch: PT.func.isRequired,
  seds: PT.array,
  t: PT.func.isRequired
}

export default SEDSearch
