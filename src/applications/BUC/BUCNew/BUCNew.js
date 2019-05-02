import React from 'react'

import { Store } from '../index'
import * as constants from '../constants'

import { Hovedknapp, Panel, Ingress } from '../../../components/ui/Nav'

const BUCNew = (props) => {

  const { state, dispatch } = React.useContext(Store)
  const { t } = props

  const onBUCList = () => {
    dispatch({
      type: constants.BUC_MODE_SET,
      payload: 'list'
    })
  }

  return <div>
    <div className='text-right'>
      <Hovedknapp onClick={onBUCList}>{t('buc:backToList')}</Hovedknapp>
    </div>
    <Panel>
      <Ingress>{t('buc:startNewBUC')}</Ingress>
      <hr/>

    </Panel>
  </div>
}

export default BUCNew
