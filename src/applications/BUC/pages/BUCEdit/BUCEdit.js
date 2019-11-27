import React, { useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { CountryData, Nav } from 'eessi-pensjon-ui'
import SEDPanel from 'applications/BUC/components/SEDPanel/SEDPanel'
import SEDSearch from 'applications/BUC/components/SEDSearch/SEDSearch'
import BUCDetail from 'applications/BUC/components/BUCDetail/BUCDetail'
import BUCTools from 'applications/BUC/components/BUCTools/BUCTools'
import SEDPanelHeader from 'applications/BUC/components/SEDPanelHeader/SEDPanelHeader'
import { getBucTypeLabel, sedFilter, sedSorter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import moment from 'moment'
import './BUCEdit.css'

const BUCEdit = ({
  actions, aktoerId, attachments, attachmentsError, bucs, bucsInfo, currentBuc, initialSearch, initialStatusSearch,
  institutionNames, loading, locale, rinaUrl, setMode, t, tagList
}) => {
  const [search, setSearch] = useState(initialSearch)
  const [statusSearch, setStatusSearch] = useState(initialStatusSearch)

  if (_.isEmpty(bucs) || !currentBuc) {
    return null
  }

  const onSEDNew = (sed) => {
    actions.setCurrentSed(sed ? sed.id : undefined)
    setMode('sednew')
  }

  const onStatusSearch = (statusSearch) => {
    setStatusSearch(statusSearch)
  }

  const onSearch = (search) => {
    setSearch(search)
  }

  const sedSearchFilter = (sed) => {
    let match = true
    if (match && search) {
      const _search = search.toLowerCase()
      const bucType = getBucTypeLabel({
        t: t,
        locale: locale,
        type: sed.type
      })
      match = sed.type.toLowerCase().match(_search) ||
        bucType.toLowerCase().match(_search) ||
        _.find(sed.participants, (it) => {
          const organizationId = it.organisation.id.toLowerCase()
          const organizationName = it.organisation.name.toLowerCase()
          const countryCode = it.organisation.countryCode.toLowerCase()
          const countryName = CountryData.getCountryInstance(locale).findByValue(countryCode.toUpperCase()).label.toLowerCase()
          const creationDate = moment(sed.creationDate).format('DD.MM.YYYY')
          const lastUpdate = moment(sed.lastUpdate).format('DD.MM.YYYY')
          const status = t('ui:' + sed.status).toLowerCase()
          return organizationId.match(_search) || organizationName.match(_search) ||
          countryCode.match(_search) || countryName.match(_search) || creationDate.match(_search) ||
          lastUpdate.match(_search) || status.match(_search)
        })
    }
    if (match && !_.isEmpty(statusSearch)) {
      match = _.find(statusSearch, { value: sed.status })
    }
    return match
  }

  const buc = bucs[currentBuc]
  const bucInfo = bucsInfo && bucsInfo.bucs ? bucsInfo.bucs[buc.caseId] : {}

  return (
    <div className='a-buc-p-bucedit'>
      <div className='a-buc-p-bucedit__buttons mb-3'>
        <Nav.Knapp
          id='a-buc-p-bucedit__new-sed-button-id'
          className='a-buc-p-bucedit__new-sed-button'
          onClick={onSEDNew.bind(null, undefined)}
        >{t('buc:form-orderNewSED')}
        </Nav.Knapp>
      </div>
      <Nav.Row>
        <div className='col-md-8'>
          <SEDSearch
            className='mb-2'
            t={t}
            value={search}
            onSearch={onSearch}
            onStatusSearch={onStatusSearch}
          />
          <SEDPanelHeader t={t} />
          {buc.seds ? buc.seds
            .filter(sedFilter)
            .filter(sedSearchFilter)
            .sort(sedSorter)
            .map((sed, index) => {
              return (
                <SEDPanel
                  className='mt-2'
                  actions={actions}
                  aktoerId={aktoerId}
                  attachments={attachments}
                  attachmentsError={attachmentsError}
                  style={{ animationDelay: (0.2 * index) + 's' }}
                  buc={buc}
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
  attachments: PT.array,
  attachmentsError: PT.bool,
  bucs: PT.object.isRequired,
  bucsInfo: PT.object,
  currentBuc: PT.string,
  initialSearch: PT.string,
  initialStatusSearch: PT.array,
  institutionNames: PT.object,
  loading: PT.object,
  locale: PT.string.isRequired,
  rinaUrl: PT.string,
  t: PT.func.isRequired,
  tagList: PT.array
}

export default BUCEdit
