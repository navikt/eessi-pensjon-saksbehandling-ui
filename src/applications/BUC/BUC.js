import React, { useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import { Store } from './index'
import * as constants from './constants'
import * as actions from './actions'

import BUCList from './BUCList/BUCList'
import BUCNew from './BUCNew/BUCNew'

const BUC = (props) => {
  const { t } = props
  const { state, dispatch } = React.useContext(Store)

  const fetchData = async () => {
    const response = await actions.fetchBucList()
    dispatch({
      type: constants.BUC_LIST_SET,
      payload: response
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return <React.Fragment>
    {state.mode === 'new' ? <BUCNew t={t} /> : null}
    {state.mode === 'list' ? <BUCList t={t} /> : null}
  </React.Fragment>
}

export default withTranslation()(BUC)
