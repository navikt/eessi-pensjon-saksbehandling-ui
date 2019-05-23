import React, { useState } from 'react'
import classNames from 'classnames'
import { EkspanderbartpanelBase, Input } from 'components/ui/Nav'
import MultipleSelect from 'components/ui/MultipleSelect/MultipleSelect'
import './SEDSearch.css'

const SEDSearch = (props) => {
  const [ _search, setSearch ] = useState(undefined)
  const [ _name, setName ] = useState([])
  const [ _country, setCountry ] = useState([])
  const [ _status, setStatus ] = useState([])

  const { t, onSearch, className, locale } = props

  const stopPropagation = (e) => {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  const onInputChange = (e) => {
    if (typeof onSearch === 'function') {
      setSearch(e)
      onSearch(e)
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
    heading={<Input label={null}
      className='a-buc-c-sedsearch-input'
      bredde='fullbredde'
      value={_search} onChange={onInputChange}
      placeholder={t('buc:form-filterSED')}
      onClick={stopPropagation}
    />}>
    <div>
      <MultipleSelect
        id='a-buc-sedsearch-name'
        className='multipleSelect mb-3'
        creatable
        placeholder={t('søk på navn')}
        locale={locale}
        value={_name}
        hideSelectedOptions={false}
        onChange={onNameChange}
        optionList={[]} />
      <MultipleSelect
        id='a-buc-sedsearch-country'
        className='multipleSelect mb-3'
        creatable
        placeholder={t('Søk på land')}
        locale={locale}
        value={_country}
        hideSelectedOptions={false}
        onChange={onCountryChange}
        optionList={[]} />
      <MultipleSelect
        id='a-buc-sedsearch-status'
        className='multipleSelect mb-3'
        creatable
        placeholder={t('Andre filter')}
        locale={locale}
        value={_status}
        hideSelectedOptions={false}
        onChange={onStatusChange}
        optionList={[]} />
    </div>
  </EkspanderbartpanelBase>
}

export default SEDSearch
