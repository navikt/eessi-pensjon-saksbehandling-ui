import React, { useState, useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import { connect, bindActionCreators } from 'store'
import * as bucActions from 'actions/buc'
import * as appActions from 'actions/app'
import * as uiActions from 'actions/ui'
import BUCList from 'applications/BUC/widgets/BUCList/BUCList'
import BUCNew from 'applications/BUC/widgets/BUCNew/BUCNew'
import SEDNew from 'applications/BUC/widgets/SEDNew/SEDNew'
import BUCEdit from 'applications/BUC/widgets/BUCEdit/BUCEdit'
import BUCCrumbs from 'applications/BUC/components/BUCCrumbs/BUCCrumbs'
import WebSocket from 'applications/BUC/websocket/WebSocket'
import { Knapp, Input } from 'components/Nav'
import { WEBSOCKET_URL } from 'constants/urls'
import { getDisplayName } from 'utils/displayName'

import './index.css'

const mapStateToProps = (state) => {
  return {
    aktoerId: state.app.params.aktoerId,
    sakId: state.app.params.sakId,
    vedtakId: state.app.params.vedtakId,
    bucParam: state.app.params.buc,
    currentBUC: state.buc.currentBUC,
    mode: state.buc.mode,
    bucs: state.buc.bucs,
    buc: state.buc.buc,
    subjectAreaList: state.buc.subjectAreaList,
    bucList: state.buc.bucList,
    tagList: state.buc.tagList,
    bucsInfo: state.buc.bucsInfo,
    bucsInfoList: state.buc.bucsInfoList,
    institutionList: state.buc.institutionList,
    institutionNames: state.buc.institutionNames,
    rinaId: state.buc.rinaId,
    rinaUrl: state.buc.rinaUrl,
    seds: state.buc.seds,
    loading: state.loading,
    locale: state.ui.locale,
    sakType: state.app.params.sakType,
    avdodId: state.app.params.avdodId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...bucActions, ...appActions, ...uiActions }, dispatch)
  }
}

export const BUCWidgetIndex = (props) => {
  const { actions, aktoerId, bucs, buc, loading, mode, rinaUrl, sakId, t, waitForMount = true, sakType, avdodId } = props
  const [mounted, setMounted] = useState(!waitForMount)
  const [enableWebsocket, setEnableWebsocket] = useState(false)
  const [_avdodId, setAvdodId] = useState('')

  useEffect(() => {
    if (!mounted && !rinaUrl) {
      actions.getRinaUrl()
      setMounted(true)
    }
  }, [actions, mounted, rinaUrl, waitForMount])

  useEffect(() => {
    if (bucs === undefined && aktoerId && sakId && !loading.gettingBUCs) {
      actions.fetchBucs(aktoerId)
      actions.fetchBucsInfoList(aktoerId)
    }
  }, [actions, aktoerId, bucs, loading, sakId])

  useEffect( () => {
    if(!sakType && sakId && aktoerId){
      actions.getSakType(sakId, aktoerId)
    }
  },[sakType, sakId, aktoerId])

  const onSedUpdate = (data) => {
    actions.sedUpdate(data)
  }

  if (!mounted) {
    return <div />
  }

  return <div className='a-buc-widget'>
    <div className='a-buc-widget__header mb-3'>
      <BUCCrumbs
        actions={actions}
        t={t}
        buc={buc}
        mode={mode}
      />
      {enableWebsocket
        ? <WebSocket onSedUpdate={onSedUpdate} url={WEBSOCKET_URL} />
        : <Knapp mini
          id='a-buc__enable-websocket-button-id'
          className='a-buc__enable-websocket'
          style={{ pading: '0px' }}
          onClick={() => setEnableWebsocket(true)}>Websocket</Knapp> }
    </div>
    {sakType === 'Gjenlevendeytelse' && !avdodId
      ? <div className='d-flex flex-row'>
          <Input bredde={'S'} label={t('buc:app-avdodIdInput')} value={_avdodId} onChange={(e)=>setAvdodId(e.target.value)}/>
          <Knapp mini={true} onClick={() => actions.setStatusParam('avdodId', _avdodId)}>{t('buc:app-avdodIdButton')}</Knapp>
      </div>
      : null
    }
    {mode === 'buclist' ? <BUCList {...props} /> : null}
    {mode === 'bucedit' ? <BUCEdit {...props} /> : null}
    {mode === 'bucnew' ? <BUCNew {...props} /> : null}
    {mode === 'sednew' ? <SEDNew {...props} /> : null}
  </div>
}

const ConnectedBUCWidgetIndex = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BUCWidgetIndex))
ConnectedBUCWidgetIndex.displayName = `Connect(${getDisplayName(withTranslation()(BUCWidgetIndex))})`
export default ConnectedBUCWidgetIndex
