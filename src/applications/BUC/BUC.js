import React from 'react'
import { withTranslation } from 'react-i18next'
import { Store } from './index'

import BUCList from './BUCList'
import BUCNew from './BUCNew'

const BUC = (props) => {
  const { t } = props
  const { state, dispatch } = React.useContext(Store)

  console.log(state, dispatch)
  return <React.Fragment>
    {state.mode === 'new' ? <BUCNew t={t} /> : null}
    {state.mode === 'list' ? <BUCList t={t} /> : null}
  </React.Fragment>
}

export default withTranslation()(BUC)
