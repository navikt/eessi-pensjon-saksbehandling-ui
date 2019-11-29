import * as appActions from 'actions/app'
import * as bucActions from 'actions/buc'
import * as uiActions from 'actions/ui'
import BUCCrumbs from 'applications/BUC/components/BUCCrumbs/BUCCrumbs'
import { P4000Info } from 'applications/BUC/declarations/period'
import BUCEdit from 'applications/BUC/pages/BUCEdit/BUCEdit'
import BUCEmpty from 'applications/BUC/pages/BUCEmpty/BUCEmpty'
import BUCList from 'applications/BUC/pages/BUCList/BUCList'
import BUCNew from 'applications/BUC/pages/BUCNew/BUCNew'
import SEDNew from 'applications/BUC/pages/SEDNew/SEDNew'
import BUCWebSocket from 'applications/BUC/websocket/WebSocket'
import { Nav, WaitingPanel } from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { bindActionCreators, connect } from 'store'
import { ActionCreators, AllowedLocaleString, Dispatch, Loading, RinaUrl, State, T } from 'types'
import { Bucs, BucsInfo, InstitutionListMap, InstitutionNames, RawInstitution, Sed } from './declarations/buc'
import './index.css'

export interface BUCIndexProps {
  actions: ActionCreators;
  aktoerId?: string;
  allowFullScreen?: boolean;
  attachments: Array<any>;
  avdodfnr?: string;
  avdodBucs: Bucs;
  bucs: Bucs;
  bucsInfo: BucsInfo;
  bucsInfoList: Array<string>;
  countryList: Array<string>;
  currentBuc?: string;
  institutionList: InstitutionListMap<RawInstitution>;
  institutionNames: InstitutionNames;
  loading: Loading;
  locale ?: AllowedLocaleString;
  mode: string;
  onFullFocus?: () => void;
  onRestoreFocus?: () => void;
  p4000info: P4000Info;
  person: any;
  rinaUrl?: RinaUrl;
  sakId?: string;
  sed: Sed;
  sedList: Array<string>;
  tagList: Array<string>;
  t: T;
  waitForMount: boolean;
  vedtakId: string | undefined;
  sakType?: string;
}


const mapStateToProps = /* istanbul ignore next */ (state: State) => {
  return {
    aktoerId: state.app.params.aktoerId,
    sakId: state.app.params.sakId,
    vedtakId: state.app.params.vedtakId,
    avdodfnr: state.app.params.avdodfnr,
    bucParam: state.app.params.buc,
    attachments: state.buc.attachments,
    attachmentsError: state.buc.attachmentsError,
    currentBuc: state.buc.currentBuc,
    currentSed: state.buc.currentSed,
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
    sakType: state.app.params.sakType,
    person: state.app.person
  }
}

const mapDispatchToProps = /* istanbul ignore next */ (dispatch: Dispatch) => {
  return {
    actions: bindActionCreators({ ...bucActions, ...appActions, ...uiActions }, dispatch)
  }
}

export const BUCIndex = (props: BUCIndexProps) => {
  const { actions, aktoerId, allowFullScreen, avdodfnr, avdodBucs, bucs, currentBuc, loading, mode } = props
  const { onFullFocus, onRestoreFocus, person, rinaUrl, sakId, t, waitForMount = true, sakType } = props
  const [mounted, setMounted] = useState(!waitForMount)
  const [_avdodfnr, setAvdodfnr] = useState('')
  const [show, setShow] = useState(false)
  const combinedBucs = { ...avdodBucs, ...bucs }

  useEffect(() => {
    if (!mounted) {
      if (!rinaUrl) {
        actions.getRinaUrl()
      }
      setMounted(true)
    }
  }, [actions, mounted, rinaUrl])

  useEffect(() => {
    if (aktoerId && sakId && bucs === undefined && !loading.gettingBUCs) {
      actions.fetchBucs(aktoerId)
      actions.fetchBucsInfoList(aktoerId)
    }
  }, [actions, aktoerId, bucs, loading.gettingBUCs, sakId])

  useEffect(() => {
    if (avdodfnr && sakId && avdodBucs === undefined && !loading.gettingAvdodBUCs) {
      actions.fetchAvdodBucs(avdodfnr)
    }
  }, [actions, avdodBucs, avdodfnr, loading.gettingAvdodBUCs, sakId])

  useEffect(() => {
    if (!sakType && !loading.gettingSakType && sakId && aktoerId) {
      actions.getSakType(sakId, aktoerId)
    }
  }, [actions, aktoerId, loading.gettingSakType, sakType, sakId])

  const setMode = useCallback((mode) => {
    actions.setMode(mode)
    if (allowFullScreen) {
      if (mode === 'bucnew' || mode === 'sednew') {
        if (_.isFunction(onFullFocus)) {
          onFullFocus()
        }
      } else {
        if (_.isFunction(onRestoreFocus)) {
          onRestoreFocus()
        }
      }
    }
  }, [actions, allowFullScreen, onRestoreFocus, onFullFocus])

  useEffect(() => {
    if (loading.gettingBUCs && mode !== 'buclist') {
      setMode('buclist')
    }
  }, [loading.gettingBUCs, mode, setMode])

  if (!mounted) {
    return <WaitingPanel />
  }

  if (!sakId || !aktoerId) {
    return (
      <BUCEmpty
        actions={actions}
        aktoerId={aktoerId}
        onBUCNew={() => setMode('bucnew')}
        rinaUrl={rinaUrl}
        sakId={sakId}
        t={t}
      />
    )
  }

  // @ts-ignore
  return (
    <div className='a-buc-widget'>
      <div className='a-buc-widget__header mb-3'>
        <BUCCrumbs
          actions={actions}
          t={t}
          bucs={combinedBucs}
          currentBuc={currentBuc}
          mode={mode}
          setMode={setMode}
        />
        <BUCWebSocket actions={actions} fnr={_.get(person, 'aktoer.ident.ident')} avdodfnr={avdodfnr} />
      </div>
      {sakType === 'Gjenlevendeytelse' && !avdodfnr
        ? (
          show ? (
            <div className='d-flex flex-row align-items-end'>
              <Nav.Input bredde='S' label={t('buc:form-avdodfnrInput')} value={_avdodfnr} onChange={(e: ChangeEvent<HTMLInputElement>) => setAvdodfnr(e.target.value)} />
              <Nav.Knapp mini className='ml-2 mb-3' onClick={() => actions.setStatusParam('avdodfnr', _avdodfnr)}>{t('buc:form-avdodfnrButton')}</Nav.Knapp>
            </div>
          ) : (
            <Nav.Knapp mini onClick={() => setShow(true)}>{t('buc:form-avdodfnr')}</Nav.Knapp>
          )
        )
        : null}
      {mode === 'buclist' ? <BUCList {...props} bucs={combinedBucs} setMode={setMode} /> : null}
      {mode === 'bucedit' ? <BUCEdit {...props} bucs={combinedBucs} setMode={setMode} /> : null}
      {mode === 'bucnew' ? <BUCNew {...props} setMode={setMode} /> : null}
      {mode === 'sednew' ? <SEDNew {...props} bucs={combinedBucs} setMode={setMode} /> : null}
    </div>
  )
}

BUCIndex.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  allowFullScreen: PT.bool,
  avdodfnr: PT.string,
  avdodBucs: PT.object,
  bucs: PT.object,
  currentBuc: PT.string,
  loading: PT.object,
  mode: PT.string.isRequired,
  onFullFocus: PT.func,
  onRestoreFocus: PT.func,
  person: PT.object,
  rinaUrl: PT.string,
  sakId: PT.string,
  t: PT.func.isRequired,
  waitForMount: PT.bool,
  sakType: PT.string
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BUCIndex))
