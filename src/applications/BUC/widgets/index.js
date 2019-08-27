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
import BUCWebSocket from 'applications/BUC/websocket/WebSocket'
import BUCCrumbs from 'applications/BUC/components/BUCCrumbs/BUCCrumbs'
import { Knapp, Input } from 'components/Nav'
import { getDisplayName } from 'utils/displayName'

import './index.css'

const mapStateToProps = (state) => {
  return {
    aktoerId: state.app.params.aktoerId,
    sakId: state.app.params.sakId,
    vedtakId: state.app.params.vedtakId,
    avdodfnr: state.app.params.avdodfnr,
    bucParam: state.app.params.buc,
    currentBuc: state.buc.currentBuc,
    mode: state.buc.mode,
    bucs: state.buc.bucs,
    avdodBucs: state.buc.avdodBucs,
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
    sakType: state.app.params.sakType
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...bucActions, ...appActions, ...uiActions }, dispatch)
  }
}

export const BUCWidgetIndex = (props) => {
  const { actions, aktoerId, avdodBucs, bucs, currentBuc, loading, mode, rinaUrl, sakId, t, waitForMount = true, sakType, avdodfnr } = props
  const [mounted, setMounted] = useState(!waitForMount)
  const [_avdodfnr, setAvdodfnr] = useState('')
  const combinedBucs = { ...avdodBucs, ...bucs }

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

  useEffect(() => {
    if (avdodfnr && sakId && avdodBucs === undefined && !loading.gettingAvdodBUCs) {
      actions.fetchAvdodBucs(avdodfnr)
    }
  }, [actions, avdodfnr, sakId])

  useEffect(() => {
    if (!sakType && !loading.gettingSakType && sakId && aktoerId) {
      actions.getSakType(sakId, aktoerId)
    }
  }, [actions, sakType, sakId, aktoerId])

  if (!mounted) {
    return <div />
  }

  return (
    <div className='a-buc-widget'>
      <div className='a-buc-widget__header mb-3'>
        <BUCCrumbs
          actions={actions}
          t={t}
          bucs={combinedBucs}
          currentBuc={currentBuc}
          mode={mode}
        />
        <BUCWebSocket actions={actions} aktoerId={aktoerId} avdodfnr={avdodfnr}/>
      </div>
      {sakType === 'Gjenlevendeytelse' && !avdodfnr
        ? (
          <div className='d-flex flex-row'>
            <Input bredde='S' label={t('buc:app-avdodfnrInput')} value={_avdodfnr} onChange={(e) => setAvdodfnr(e.target.value)} />
            <Knapp mini onClick={() => actions.setStatusParam('avdodfnr', _avdodfnr)}>{t('buc:app-avdodfnrButton')}</Knapp>
          </div>
        )
        : null}
      {mode === 'buclist' ? <BUCList {...props} bucs={combinedBucs} /> : null}
      {mode === 'bucedit' ? <BUCEdit {...props} bucs={combinedBucs} /> : null}
      {mode === 'bucnew' ? <BUCNew {...props} bucs={combinedBucs} /> : null}
      {mode === 'sednew' ? <SEDNew {...props} bucs={combinedBucs} /> : null}

    </div>
  )
}

const ConnectedBUCWidgetIndex = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BUCWidgetIndex))
ConnectedBUCWidgetIndex.displayName = `Connect(${getDisplayName(withTranslation()(BUCWidgetIndex))})`
export default ConnectedBUCWidgetIndex
