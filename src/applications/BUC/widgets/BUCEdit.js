import React, { useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import * as Nav from 'components/ui/Nav'
import SEDRow from '../components/SEDRow/SEDRow'
import SEDSearch from '../components/SEDSearch/SEDSearch'
import BUCDetail from '../components/BUCDetail/BUCDetail'
import BUCTags from '../components/BUCTags/BUCTags'
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
  const { t, buc, actions, rinaUrl, locale, seds, statusFilter } = props
  const [ search, setSearch ] = useState(undefined)

  const onSEDNew = () => {
    actions.setMode('newsed')
  }

  const onBUCList = () => {
    actions.setMode('list')
  }

  const onSearch = (search) => {
    setSearch(setSearch)
  }

  const renderSeds = () => {
    return seds ? seds.filter(sed => {
      return (search ? sed.name.match(search) : true)
    }).filter(sed => {
      return statusFilter ? statusFilter.indexOf(sed.status) >= 0 : true
    })
    .map((sed, index) => {
      return <SEDRow className='mt-2' locale={locale} t={t} key={index} sed={sed} rinaUrl={rinaUrl} rinaId={buc.caseId} />
    }) : null
  }

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
        <SEDSearch className='mb-2' t={t} locale={locale} value={search} onSearch={onSearch} />
        {renderSeds()}
      </div>
      <div className='col-4'>
        <BUCDetail className='mb-3' t={t} buc={buc} locale={locale} />
        <SEDTools className='mb-3' t={t} />
        <BUCTags className='mb-3' t={t} buc={buc} />
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
