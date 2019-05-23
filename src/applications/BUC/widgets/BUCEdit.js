import React, { useState } from 'react'
import * as Nav from 'components/ui/Nav'
import SedLabel from '../components/SED/SedLabel'
import SEDSearch from '../components/SED/SEDSearch'
import BUCDetail from '../components/BUCDetail/BUCDetail'
import BUCTags from '../components/BUCTags/BUCTags'
import SEDAnswer from '../components/SED/SEDAnswer'
import UserTools from '../components/User/UserTools'

import './BUCEdit.css'

const BUCEdit = (props) => {
  const { t, buc, actions, locale, seds } = props
  const [ tab, setTab ] = useState('inbox')
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
      return (search ? sed.name.matches(search) : sed) &&
        (tab === 'draft' ? sed.status === 'draft' : sed.status !== 'draft')
    }).map((sed, index) => {
      return <SedLabel className='mt-2' t={t} key={index} sed={sed} />
    }) : null
  }

  return <div className='a-buc-bucedit'>
    <div className='a-buc-buclist-buttons mb-2'>
      <Nav.ToggleGruppe defaultToggles={[
        { children: t('ui:inbox'), pressed: true, onClick: () => setTab('inbox') },
        { children: t('ui:draft'), onClick: () => setTab('draft') }
      ]} />
      <div>
        <Nav.Knapp onClick={onSEDNew}>{t('buc:form-orderNewSED')}</Nav.Knapp>
        <Nav.Knapp className='ml-2' onClick={onBUCList}>{t('buc:form-backToList')}</Nav.Knapp>
      </div>
    </div>
    <Nav.Row style={{ marginLeft: '-15px', marginRight: '-15px' }}>
      <div className='col-8'>
        <SEDSearch className='mb-2' t={t} value={search} onSearch={onSearch} />
        {renderSeds()}
      </div>
      <div className='col-4'>
        <BUCDetail className='mb-3' t={t} buc={buc} locale={locale} />
        <SEDAnswer className='mb-3' t={t} />
        <BUCTags className='mb-3' t={t} />
        <UserTools className='mb-3' t={t} />
      </div>
    </Nav.Row>
  </div>
}

export default BUCEdit
