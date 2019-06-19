import React, { useState } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { EkspanderbartpanelBase, Input } from 'components/ui/Nav'
import MultipleSelect from 'components/ui/MultipleSelect/MultipleSelect'
import './SEDSearch.css'

const SEDSearch = (props) => {
  const [ _query, setQuery ] = useState(undefined)
  const [ _name, setName ] = useState([])
  const [ _country, setCountry ] = useState([])
  const [ _status, setStatus ] = useState([])

  const { t, onSearch, className, locale } = props

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

  const onNameChange = (nameList) => {
    setName(nameList)
  }

  const onCountryChange = (countryList) => {
    setCountry(countryList)
  }

  const onStatusChange = (statusList) => {
    setStatus(statusList)
  }

  return <EkspanderbartpanelBase
    className={classNames('a-buc-c-sedsearch', className)}
    id='a-buc-c-sedsearch__panel-id'
    heading={<Input
      className='a-buc-c-sedsearch__query'
      label={''}
      bredde='fullbredde'
      value={_query} onChange={onQueryChange}
      placeholder={t('buc:form-filterSED')}
      onClick={stopPropagation}
    />}>
    <div>
      <MultipleSelect
        id='a-buc-c-sedsearch__name-id'
        className='multipleSelect mb-3'
        creatable
        placeholder={t('ui:searchForName')}
        locale={locale}
        value={_name}
        hideSelectedOptions={false}
        onChange={onNameChange}
        optionList={[]} />
      <MultipleSelect
        id='a-buc-c-sedsearch__country-id'
        className='multipleSelect mb-3'
        creatable
        placeholder={t('ui:searchForCountry')}
        locale={locale}
        value={_country}
        hideSelectedOptions={false}
        onChange={onCountryChange}
        optionList={[]} />
      <MultipleSelect
        id='a-buc-c-sedsearch__status-id'
        className='multipleSelect mb-3'
        creatable
        placeholder={t('ui:searchForStatus')}
        locale={locale}
        value={_status}
        hideSelectedOptions={false}
        onChange={onStatusChange}
        optionList={[]} />
    </div>
  </EkspanderbartpanelBase>
}

SEDSearch.propTypes = {
  t: PT.func.isRequired,
  onSearch: PT.func,
  className: PT.string,
  locale: PT.string.isRequired
}

export default SEDSearch
