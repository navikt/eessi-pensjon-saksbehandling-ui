import React, { useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { Knapp, Row } from 'components/Nav'
import SEDRow from 'applications/BUC/components/SEDRow/SEDRow'
import SEDSearch from 'applications/BUC/components/SEDSearch/SEDSearch'
import BUCDetail from 'applications/BUC/components/BUCDetail/BUCDetail'
import BUCTools from 'applications/BUC/components/BUCTools/BUCTools'
import CountryData from 'components/CountryData/CountryData'

import './BUCEdit.css'

const BUCEdit = (props) => {
  const { actions, aktoerId, buc, bucsInfo, institutionNames, loading, locale, rinaUrl, seds, t, tagList } = props
  const [ search, setSearch ] = useState(undefined)
  const [ countrySearch, setCountrySearch ] = useState(undefined)
  const [ statusSearch, setStatusSearch ] = useState(undefined)

  const onSEDNew = () => {
    actions.setMode('sednew')
  }

  const onCountrySearch = (countrySearch) => {
    setCountrySearch(countrySearch)
  }

  const onStatusSearch = (statusSearch) => {
    setStatusSearch(statusSearch)
  }

  const onSearch = (search) => {
    setSearch(search)
  }

  const sedFilter = (sed) => {
    let match = true
    if (match && search) {
      let _search = search.toLowerCase()
      match = sed.type.match(search) || _.find(sed.participants, (it) => {
        const organizationId = it.organisation.id.toLowerCase()
        const organizationName = institutionNames[organizationId] ? institutionNames[organizationId].toLowerCase() : ''
        const countryCode = it.organisation.countryCode.toLowerCase()
        const countryName = CountryData.findByValue(locale, countryCode.toUpperCase()).label.toLowerCase()
        const creationDate = new Date(sed.creationDate).toLocaleDateString()
        const lastUpdate = sed.lastUpdate ? new Date(sed.lastUpdate).toLocaleDateString() : ''
        const status = t('ui:' + sed.status).toLowerCase()
        return organizationId.match(_search) || organizationName.match(_search) ||
          countryCode.match(_search) || countryName.match(_search) || creationDate.match(_search) ||
          lastUpdate.match(_search) || status.match(_search)
      })
    }
    if (match && countrySearch) {
      match = _.find(sed.participants, (it) => {
        return _.find(countrySearch, { value: it.organisation.countryCode })
      })
    }
    if (match && statusSearch) {
      match = _.find(statusSearch, { value: sed.status })
    }
    return match
  }

  const renderSeds = () => {
    return seds ? _(seds)
      .filter(sed => sed.status !== 'empty')
      .filter(sedFilter)
      .sortBy(['creationDate', 'type'])
      .value()
      .map((sed, index) => {
        return <SEDRow
          className='mt-2'
          locale={locale}
          t={t}
          key={index}
          sed={sed}
          rinaUrl={rinaUrl}
          rinaId={buc.caseId}
          onSEDNew={onSEDNew}
          institutionNames={institutionNames}
          border={'full'}
        />
      }) : null
  }

  const bucId = buc.type + '-' + buc.caseId
  const bucInfo = bucsInfo && bucsInfo.bucs ? bucsInfo.bucs[bucId] : {}

  return <div className='a-buc-bucedit'>
    <div className='a-buc-bucedit__buttons mb-3'>
      <Knapp
        id='a-buc-bucedit__new-sed-button-id'
        className='a-buc-bucedit__new-sed-button'
        onClick={onSEDNew}>{t('buc:form-orderNewSED')}</Knapp>
    </div>
    <Row>
      <div className='col-md-8'>
        <SEDSearch
          className='mb-2'
          t={t}
          locale={locale}
          value={search}
          seds={seds}
          onSearch={onSearch}
          onCountrySearch={onCountrySearch}
          onStatusSearch={onStatusSearch} />
        {renderSeds()}
      </div>
      <div className='col-md-4'>
        <BUCDetail className='mb-3'
          t={t}
          buc={buc}
          bucInfo={bucInfo}
          locale={locale}
          institutionNames={institutionNames} />
        <BUCTools className='mb-3'
          t={t}
          actions={actions}
          aktoerId={aktoerId}
          buc={buc}
          bucInfo={bucInfo}
          bucsInfo={bucsInfo}
          locale={locale}
          loading={loading}
          tagList={tagList} />
      </div>
    </Row>
  </div>
}

BUCEdit.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string.isRequired,
  buc: PT.object.isRequired,
  bucsInfo: PT.object,
  institutionNames: PT.object,
  loading: PT.object,
  locale: PT.string.isRequired,
  rinaUrl: PT.string,
  seds: PT.array.isRequired,
  t: PT.func.isRequired,
  tagList: PT.array
}

export default BUCEdit
