import React, { useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { CountryData, Nav } from 'eessi-pensjon-ui'
import SEDPanel from 'applications/BUC/components/SEDPanel/SEDPanel'
import SEDSearch from 'applications/BUC/components/SEDSearch/SEDSearch'
import BUCDetail from 'applications/BUC/components/BUCDetail/BUCDetail'
import BUCTools from 'applications/BUC/components/BUCTools/BUCTools'
import moment from 'moment'
import './BUCEdit.css'

const BUCEdit = ({
  actions, aktoerId, bucs, bucsInfo, currentBuc, initialSearch, initialCountrySearch, initialStatusSearch,
  institutionNames, loading, locale, rinaUrl, setMode, t, tagList
}) => {
  const [search, setSearch] = useState(initialSearch)
  const [countrySearch, setCountrySearch] = useState(initialCountrySearch)
  const [statusSearch, setStatusSearch] = useState(initialStatusSearch)

  const onSEDNew = (sed) => {
    actions.setCurrentSed(sed ? sed.id : undefined)
    setMode('sednew')
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
      const _search = search.toLowerCase()
      match = sed.type.match(search) || _.find(sed.participants, (it) => {
        const organizationId = it.organisation.id.toLowerCase()
        const organizationName = it.organisation.name.toLowerCase()
        const countryCode = it.organisation.countryCode.toLowerCase()
        const countryName = CountryData.findByValue(locale, countryCode.toUpperCase()).label.toLowerCase()
        const creationDate = moment(sed.creationDate).format('DD.MM.YYYY')
        const lastUpdate = moment(sed.lastUpdate).format('DD.MM.YYYY')
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

  if (_.isEmpty(bucs) || !currentBuc) {
    return null
  }

  const buc = bucs[currentBuc]
  const bucInfo = bucsInfo && bucsInfo.bucs ? bucsInfo.bucs[buc.caseId] : {}

  return (
    <div className='a-buc-bucedit'>
      <div className='a-buc-bucedit__buttons mb-3'>
        <Nav.Knapp
          id='a-buc-bucedit__new-sed-button-id'
          className='a-buc-bucedit__new-sed-button'
          onClick={onSEDNew.bind(null, undefined)}
        >{t('buc:form-orderNewSED')}
        </Nav.Knapp>
      </div>
      <Nav.Row>
        <div className='col-md-8'>
          <SEDSearch
            className='mb-2'
            t={t}
            locale={locale}
            value={search}
            seds={buc.seds}
            onSearch={onSearch}
            onCountrySearch={onCountrySearch}
            onStatusSearch={onStatusSearch}
          />
          {buc.seds ? _(buc.seds)
            .filter(sed => sed.status !== 'empty')
            .filter(sedFilter)
            .orderBy(['lastUpdate', 'type'], ['desc', 'desc'])
            .value()
            .map((sed, index) => {
              return (
                <SEDPanel
                  className='mt-2'
                  locale={locale}
                  t={t}
                  key={index}
                  sed={sed}
                  followUpSeds={buc.seds.filter(_seds => _seds.parentDocumentId === sed.id)}
                  rinaUrl={rinaUrl}
                  rinaId={buc.caseId}
                  onSEDNew={() => onSEDNew(sed)}
                  institutionNames={institutionNames}
                  border='full'
                />
              )
            }) : null}
        </div>
        <div className='col-md-4'>
          <BUCDetail
            className='mb-3'
            t={t}
            buc={buc}
            bucInfo={bucInfo}
            locale={locale}
            rinaUrl={rinaUrl}
            institutionNames={institutionNames}
          />
          <BUCTools
            className='mb-3'
            t={t}
            actions={actions}
            aktoerId={aktoerId}
            buc={buc}
            bucInfo={bucInfo}
            bucsInfo={bucsInfo}
            locale={locale}
            loading={loading}
            tagList={tagList}
          />
        </div>
      </Nav.Row>
    </div>
  )
}

BUCEdit.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string.isRequired,
  bucs: PT.object.isRequired,
  bucsInfo: PT.object,
  currentBuc: PT.string.isRequired,
  initialSearch: PT.string,
  initialCountrySearch: PT.string,
  initialStatusSearch: PT.string,
  institutionNames: PT.object,
  loading: PT.object,
  locale: PT.string.isRequired,
  rinaUrl: PT.string,
  t: PT.func.isRequired,
  tagList: PT.array
}

export default BUCEdit
