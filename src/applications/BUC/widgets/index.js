import React, { useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import { connect, bindActionCreators } from 'store'
import * as bucActions from 'actions/buc'

import BUCList from './BUCList'
import BUCNew from './BUCNew'
import SEDNew from './SEDNew'
import BUCEdit from './BUCEdit'

import './index.css'

const mapStateToProps = (state) => {
  return {
    mode: state.buc.mode,
    bucs: state.buc.bucs,
    bucsInfo: state.buc.bucsInfo,
    buc: state.buc.buc,
    seds: state.buc.seds,
    gettingBUCs: state.loading.gettingBUCs,
    locale: state.ui.locale,
    aktoerId: state.app.params.aktoerId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(bucActions, dispatch)
  }
}

export const BUCWidgetIndex = (props) => {
  const { mode } = props

  return <div className='a-buc-widget'>
    {mode === 'newbuc' ? <BUCNew {...props} /> : null}
    {mode === 'newsed' ? <SEDNew {...props} /> : null}
    {mode === 'list' ? <BUCList {...props} /> : null}
    {mode === 'edit' ? <BUCEdit {...props} /> : null}
  </div>
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BUCWidgetIndex))
