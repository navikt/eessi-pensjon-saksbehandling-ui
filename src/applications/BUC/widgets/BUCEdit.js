import React, { useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { Knapp, Row } from 'components/ui/Nav'
import SEDRow from '../components/SEDRow/SEDRow'
import SEDSearch from '../components/SEDSearch/SEDSearch'
import BUCDetail from '../components/BUCDetail/BUCDetail'
import BUCTools from '../components/BUCTools/BUCTools'
import SEDTools from '../components/SEDTools/SEDTools'
import UserTools from '../components/User/UserTools'
import CountryData from 'components/ui/CountryData/CountryData'
import { connect, bindActionCreators } from 'store'
import * as bucActions from 'actions/buc'
import './BUCEdit.css'
import { getDisplayName } from 'utils/displayName'

const mapStateToProps = (state) => {
  return {
    institutionNames: state.buc.institutionNames
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(bucActions, dispatch)
  }
}

const BUCEdit = (props) => {
  const { t, buc, bucsInfo, actions, rinaUrl, locale, seds, institutionNames } = props
  const [ search, setSearch ] = useState(undefined)
  const [ countrySearch, setCountrySearch ] = useState(undefined)
  const [ statusSearch, setStatusSearch ] = useState(undefined)

  const onSEDNew = () => {
    actions.setMode('newsed')
  }

  const onBUCList = () => {
    actions.resetBuc()
    actions.setMode('list')
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

        return organizationId.match(_search) || organizationName.match(_search) || countryCode.match(_search) ||
        countryName.match(_search) || creationDate.match(_search) || lastUpdate.match(_search) || status.match(_search)
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
      .filter(sedFilter)
      .sortBy(['creationDate', 'type'])
      .value()
      .map((sed, index) => {
        return <SEDRow className='mt-2' locale={locale} t={t} key={index} sed={sed} rinaUrl={rinaUrl} rinaId={buc.caseId} />
      }) : null
  }

  const bucId = buc.type + '-' + buc.caseId
  const bucInfo = bucsInfo && bucsInfo.bucs ? bucsInfo.bucs[bucId] : {}

  return <div className='a-buc-bucedit'>
    <div className='a-buc-buclist__buttons mt-3 mb-3'>
      <Knapp onClick={onBUCList}>{t('ui:back')}</Knapp>
      <Knapp onClick={onSEDNew}>{t('buc:form-orderNewSED')}</Knapp>
    </div>
    <Row style={{ marginLeft: '-15px', marginRight: '-15px' }}>
      <div className='col-8'>
        <SEDSearch className='mb-2' t={t} locale={locale} value={search} seds={seds}
          onSearch={onSearch} onCountrySearch={onCountrySearch} onStatusSearch={onStatusSearch} />
        {renderSeds()}
      </div>
      <div className='col-4'>
        <BUCDetail className='mb-3' t={t} buc={buc} bucInfo={bucInfo} locale={locale} />
        <BUCTools className='mb-3' t={t} buc={buc} bucInfo={bucInfo} locale={locale} />
        <SEDTools className='mb-3' t={t} />
        <UserTools className='mb-3' t={t} />
      </div>
    </Row>
  </div>
}

BUCEdit.propTypes = {
  t: PT.func.isRequired,
  bucs: PT.array,
  actions: PT.object.isRequired,
  rinaUrl: PT.string,
  seds: PT.array.isRequired,
  locale: PT.string.isRequired
}

const ConnectedBUCEdit = connect(mapStateToProps, mapDispatchToProps)(BUCEdit)

ConnectedBUCEdit.displayName = `Connect(${getDisplayName(BUCEdit)})`

export default ConnectedBUCEdit
