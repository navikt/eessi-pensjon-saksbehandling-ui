import React, { useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import { useStore } from '../../store'
import * as actions from '../../actions/buc'
import * as types from '../../constants/actionTypes'

import BUCList from './BUCList/BUCList'
import BUCNew from './BUCNew/BUCNew'

const BUC = (props) => {
  const { t } = props
  const [ state, dispatch ] = useStore()

  const fetchData = async () => {
    const response = await actions.fetchBucList()
    dispatch({
      type: types.BUC_LIST_SET,
      payload: response
    })
  }

  useEffect(() => {
    if (!state.buc.list) {
      fetchData()
    }
  }, [])

  return <div className='a-buc'>
    {state.buc.mode === 'new' ? <BUCNew t={t} /> : null}
    {state.buc.mode === 'list' ? <BUCList t={t} /> : null}
  </div>
}

export default withTranslation()(BUC)
