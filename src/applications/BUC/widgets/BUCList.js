import React, { useState } from 'react'

import BUCPanel from './BUCPanel'
import { Hovedknapp, ToggleGruppe } from '../../../components/ui/Nav'

import './BUCList.css'

const BUCList = (props) => {
  const [tab, setTab] = useState('ONGOING')
  const { t, list, actions } = props

  const onBUCNew = () => {
    actions.setMode('new')
  }

  return <React.Fragment>
    <div className='a-buc-buclist-buttons mb-2'>
      <ToggleGruppe
        defaultToggles={[
          { children: t('ui:ongoing'), pressed: true, onClick: () => setTab('ONGOING') },
          { children: t('ui:other'), onClick: () => setTab('OTHER') }
        ]}
      />
      <Hovedknapp onClick={onBUCNew}>{t('buc:widget-createNewCase')}</Hovedknapp>
    </div>
    {list ? list[tab].map((buc, index) => (
      <BUCPanel t={t} key={index} buc={buc} />
    )) : null}

  </React.Fragment>
}

export default BUCList
