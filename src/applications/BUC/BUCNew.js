import React from 'react'

import { Store } from './index'
import * as constants from './constants'

import { Hovedknapp } from '../../components/ui/Nav'

const BUCNew = (props) => {

  const { state, dispatch } = React.useContext(Store)

  const onBUCList = () => {
    dispatch({
      type: constants.BUC_MODE,
      payload: 'list'
    })
  }

  return <div>
    <Hovedknapp onClick={onBUCList}>List</Hovedknapp>
  </div>
}

export default BUCNew
