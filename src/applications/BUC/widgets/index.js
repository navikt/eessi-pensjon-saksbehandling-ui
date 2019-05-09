import React, { useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import { connect, bindActionCreators } from 'store'
import * as bucActions from 'actions/buc'

import BUCList from './BUCList'
import BUCNew from './BUCNew'

import './index.css'

const mapStateToProps = (state) => {
  return {
    mode: state.buc.mode,
    list: state.buc.list,
    step: state.buc.step
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(bucActions, dispatch)
  }
}

export const BUCWidgetIndex = (props) => {
  const { mode, list, actions } = props

  useEffect(() => {
    if (!list) {
      actions.fetchBucList()
    }
  }, [list, actions])

  return <div className='a-buc-widget'>
    {mode === 'new' ? <BUCNew {...props} /> : null}
    {mode === 'list' ? <BUCList {...props} /> : null}
  </div>
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BUCWidgetIndex))
