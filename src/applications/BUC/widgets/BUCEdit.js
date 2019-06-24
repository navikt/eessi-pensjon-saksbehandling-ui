import React, { useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import * as Nav from 'components/ui/Nav'
import SEDRow from '../components/SEDRow/SEDRow'
import SEDSearch from '../components/SEDSearch/SEDSearch'
import BUCDetail from '../components/BUCDetail/BUCDetail'
import BUCTools from '../components/BUCTools/BUCTools'
import SEDTools from '../components/SEDTools/SEDTools'
import UserTools from '../components/User/UserTools'
import SEDStatusSelect from 'applications/BUC/components/SEDStatusSelect/SEDStatusSelect'
import { connect, bindActionCreators } from 'store'
import * as bucActions from 'actions/buc'
import './BUCEdit.css'

const mapStateToProps = (state) => {
  return {
    statusFilter: state.buc.statusFilter
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(bucActions, dispatch)
  }
}

const BUCEdit = (props) => {
  const { t, buc, bucsInfo, actions, rinaUrl, locale, seds, statusFilter } = props
  const [ search, setSearch ] = useState(undefined)
  const [ countrySearch, setCountrySearch ] = useState(undefined)
  const [ statusSearch, setStatusSearch ] = useState(undefined)

  const onSEDNew = () => {
    actions.setMode('newsed')
  }

  const onBUCList = () => {
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
      match = sed.type.match(search) || _.find(sed.participants, (it) => {
        return it.organisation.id.match(search)
      })
    }
    if (match && countrySearch) {
      match = _.find(sed.participants, (it) => {
        return _.find(countrySearch, {value: it.organisation.countryCode})
      })
    }
    if (match && statusFilter) {
      if (statusFilter.length > 1) { // multiple
        match = statusFilter.indexOf(sed.status) >= 0
      } else { // single
        switch (statusFilter[0]) {
          case 'inbox':
          match = sed.status !== null && sed.status !== 'empty' && sed.status !== 'new'
          break
          default:
          match = sed.status === null || sed.status === 'new'
          break
        }
      }
    }
    if (match && statusSearch) {
      match = _.find(statusSearch, {value: sed.status})
    }
    return match
  }

  const renderSeds = () => {
    return seds ? seds
    .filter(sedFilter)
    .map((sed, index) => {
      return <SEDRow className='mt-2' locale={locale} t={t} key={index} sed={sed} rinaUrl={rinaUrl} rinaId={buc.caseId} />
    }) : null
  }

  const bucId = buc.type + '-' + buc.caseId
  const bucInfo = bucsInfo && bucsInfo.bucs ? bucsInfo.bucs[bucId] : {}

  return <div className='a-buc-bucedit'>
    <div className='a-buc-buclist-buttons mb-2'>
      <SEDStatusSelect t={t}/>
      <div>
        <Nav.Knapp onClick={onSEDNew}>{t('buc:form-orderNewSED')}</Nav.Knapp>
        <Nav.Knapp className='ml-2' onClick={onBUCList}>{t('buc:form-backToList')}</Nav.Knapp>
      </div>
    </div>
    <Nav.Row style={{ marginLeft: '-15px', marginRight: '-15px' }}>
      <div className='col-8'>
        <SEDSearch className='mb-2' t={t} locale={locale} value={search} seds={seds}
        onSearch={onSearch} onCountrySearch={onCountrySearch} onStatusSearch={onStatusSearch}/>
        {renderSeds()}
      </div>
      <div className='col-4'>
        <BUCDetail className='mb-3' t={t} buc={buc} bucInfo={bucInfo} locale={locale} />
        <BUCTools className='mb-3' t={t} buc={buc} bucInfo={bucInfo} locale={locale}/>
        <SEDTools className='mb-3' t={t} />
        <UserTools className='mb-3' t={t} />
      </div>
    </Nav.Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(BUCEdit)
