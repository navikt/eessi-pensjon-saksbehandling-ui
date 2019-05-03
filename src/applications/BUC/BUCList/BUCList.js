import React, { useState } from 'react'

import { ToggleGruppe } from 'nav-frontend-toggle'

import { useStore } from '../../../store'
import * as types from '../../../constants/actionTypes'

import BUCPanel from '../BUCPanel/BUCPanel'
import { Hovedknapp } from '../../../components/ui/Nav'

import './BUCList.css'

const BUCList = (props) => {
  const [tab, setTab] = useState('ONGOING')
  const { t } = props
  const [ state, dispatch ] = useStore()

  const onBUCNew = () => {
    dispatch({
      type: types.BUC_MODE_SET,
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
    {state.buc.list ? state.buc.list[tab].map((buc, index) => (
      <BUCPanel t={t} key={index} buc={buc} />
    )) : null}

  </React.Fragment>
}

export default BUCList
