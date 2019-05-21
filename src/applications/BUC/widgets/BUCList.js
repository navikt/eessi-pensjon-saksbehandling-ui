import React, { useState } from 'react'

import BUCPanel from './BUCPanel'
import { Hovedknapp } from '../../../components/ui/Nav'

import './BUCList.css'

const BUCList = (props) => {
  const { t, list, actions, locale } = props

  const onBUCNew = () => {
    actions.setMode('new')
  }

  return <React.Fragment>
    <div className='a-buc-buclist-buttons mb-2'>
      <div></div>
      <Hovedknapp onClick={onBUCNew}>{t('buc:widget-createNewCase')}</Hovedknapp>
    </div>
    {list ? list.map((buc, index) => (
      <BUCPanel t={t} key={index} buc={buc} locale={locale}/>
    )) : null}

  </React.Fragment>
}

export default BUCList
