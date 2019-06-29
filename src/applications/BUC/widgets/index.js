import React, { useState, useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import { connect, bindActionCreators } from 'store'
import * as bucActions from 'actions/buc'
import * as appActions from 'actions/app'

import BUCList from './BUCList'
import BUCNew from './BUCNew'
import SEDNew from './SEDNew'
import BUCEdit from './BUCEdit'

import './index.css'
import { getDisplayName } from '../../../utils/displayName'

const mapStateToProps = (state) => {
  return {
    mode: state.buc.mode,
    bucs: state.buc.bucs,
    buc: state.buc.buc,
    bucsInfo: state.buc.bucsInfo,
    bucsInfoList: state.buc.bucsInfoList,
    institutionList: state.buc.institutionList,
    institutionNames: state.buc.institutionNames,
    rinaUrl: state.buc.rinaUrl,
    seds: state.buc.seds,
    gettingBUCs: state.loading.gettingBUCs,
    locale: state.ui.locale,
    sakId: state.app.params.sakId,
    aktoerId: state.app.params.aktoerId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...bucActions, ...appActions }, dispatch)
  }
}

export const BUCWidgetIndex = (props) => {
  const { actions, aktoerId, bucs, gettingBUCs, mode, rinaUrl, sakId } = props
  const [ mounted, setMounted ] = useState(false)

  useEffect(() => {
    if (!mounted && !rinaUrl) {
      actions.getRinaUrl()
      setMounted(true)
    }
  }, [mounted, rinaUrl, actions])

  useEffect(() => {
    if (bucs === undefined && aktoerId && sakId && !gettingBUCs) {
      actions.fetchBucs(aktoerId)
      actions.fetchBucsInfoList(aktoerId)
    }
  }, [actions, aktoerId, bucs, gettingBUCs, sakId])

  if (!mounted) {
    return null
  }

  return <div className='a-buc-widget'>
    {mode === 'newbuc' ? <BUCNew {...props} /> : null}
    {mode === 'newsed' ? <SEDNew {...props} /> : null}
    {mode === 'list' ? <BUCList {...props} /> : null}
    {mode === 'edit' ? <BUCEdit {...props} /> : null}
  </div>
}

const ConnectedBUCWidgetIndex = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BUCWidgetIndex))

ConnectedBUCWidgetIndex.displayName = `Connect(${getDisplayName(withTranslation()(BUCWidgetIndex))})`

export default ConnectedBUCWidgetIndex
