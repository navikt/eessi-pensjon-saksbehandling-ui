import React, { useState, useContext } from 'react'

import { ToggleGruppe } from 'nav-frontend-toggle'

import { Store } from '../index'
import * as constants from '../constants'

import BUCPanel from '../BUCPanel/BUCPanel'
import { Hovedknapp } from '../../../components/ui/Nav'

import './BUCList.css'


const BUCList = (props) => {
  const [tab, setTab] = useState('ONGOING')
  const { t } = props
  const { state, dispatch } = useContext(Store)

  const onBUCNew = () => {
    dispatch({
      type: constants.BUC_MODE_SET,
      payload: 'new'
    })
  }

  return <React.Fragment>
    <div className='a-buc-buclist-buttons mb-2'>
      <ToggleGruppe
        defaultToggles={[
          { children: t('ui:ongoing'), pressed: true, onClick: () => setTab('ONGOING') },
          { children: t('ui:other'), onClick: () => setTab('OTHER') }
        ]}
      />
      <Hovedknapp onClick={onBUCNew}>{t('buc:startNewCase')}</Hovedknapp>
    </div>
    {state.list ? state.list[tab].map((buc, index) => (
       <BUCPanel t={t} key={index} buc={buc}/>
    )) : null}

  </React.Fragment>
}

export default BUCList
