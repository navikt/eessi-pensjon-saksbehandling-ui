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
import { Knapp, Input } from 'components/Nav'
import { getDisplayName } from 'utils/displayName'
import {connectToWebSocket} from '../../../utils/websocket'


import './index.css'

const mapStateToProps = (state) => {
  return {
    aktoerId: state.app.params.aktoerId,
    sakId: state.app.params.sakId,
    vedtakId: state.app.params.vedtakId,
    bucParam: state.app.params.buc,
    currentBuc: state.buc.currentBuc,
    mode: state.buc.mode,
    bucs: state.buc.bucs,
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
    avdodfnr: state.app.params.avdodfnr
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...bucActions, ...appActions, ...uiActions }, dispatch)
  }
}

export const BUCWidgetIndex = (props) => {
  const { actions, aktoerId, bucs, currentBuc, loading, mode, rinaUrl, sakId, t, waitForMount = true, sakType, avdodfnr } = props
  const [mounted, setMounted] = useState(!waitForMount)
  const [websocketConnection, setWebsocketConnection] = useState(undefined)
  const [websocketReady, setWebsocketReady] = useState(false)
  const [_avdodfnr, setAvdodfnr] = useState('')

  const onBucUpdate = (e) => {
    try {
      const data = JSON.parse(e.data)
      if (data.bucUpdated) {
        actions.fetchSingleBuc(data.bucUpdated)
      }
    } catch (err) {
      console.error('Invalid JSON', e.data)
    }
  }

  useEffect( () => {
    if(!websocketConnection) {
      setWebsocketConnection(
        connectToWebSocket(
          ()=>setWebsocketReady(true),
          onBucUpdate,
          ()=>setWebsocketReady(false),
          ()=>setWebsocketReady(false)
        )
      )
    }
  }, [websocketReady])


  useEffect(() => {
    if (!mounted && !rinaUrl) {
      actions.getRinaUrl()
      setMounted(true)
    }
  }, [actions, mounted, rinaUrl, waitForMount])

  useEffect(() => {
    if (aktoerId && sakId && bucs === undefined && !loading.gettingBUCs) {
      actions.fetchBucs(aktoerId)
      actions.fetchBucsInfoList(aktoerId)
    }
  }, [actions, aktoerId, sakId])

  useEffect( ()=> {
    if(avdodfnr && sakId){
      actions.fetchBucs(avdodfnr)
    }
  }, [actions, avdodfnr, sakId])

  useEffect( () => {
    if(!sakType && sakId && aktoerId){
      actions.getSakType(sakId, aktoerId)
    }
  },[actions, sakType, sakId, aktoerId])

  if (!mounted) {
    return <div />
  }

  return <div className='a-buc-widget'>
    <div className='a-buc-widget__header mb-3'>
      <BUCCrumbs
        actions={actions}
        t={t}
        bucs={bucs}
        currentBuc={currentBuc}
        mode={mode}
      />
    </div>
    {sakType === 'Gjenlevendeytelse' && !avdodfnr
      ? <div className='d-flex flex-row'>
          <Input bredde={'S'} label={t('buc:app-avdodfnrInput')} value={_avdodfnr} onChange={(e)=>setAvdodfnr(e.target.value)}/>
          <Knapp mini={true} onClick={() => actions.setStatusParam('avdodfnr', _avdodfnr)}>{t('buc:app-avdodfnrButton')}</Knapp>
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
