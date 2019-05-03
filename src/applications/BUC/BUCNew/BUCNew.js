import React from 'react'

import { useStore } from '../../../store'
import * as types from '../../../constants/actionTypes'

import { Hovedknapp, Panel, Ingress } from '../../../components/ui/Nav'

const BUCNew = (props) => {
  const [ state, dispatch ] = useStore()
  const { t } = props

  const onBUCList = () => {
    dispatch({
      type: types.BUC_MODE_SET,
      payload: 'list'
    })
  }

  return <div>
    <div className='text-right'>
      <Hovedknapp onClick={onBUCList}>{t('buc:backToList')}</Hovedknapp>
    </div>
    <Panel>
      <Ingress>{t('buc:startNewBUC')}</Ingress>
      <hr />

    </Panel>
  </div>
}

export default BUCNew
