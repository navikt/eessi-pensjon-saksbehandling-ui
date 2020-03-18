import { setStatusParam } from 'actions/app'
import { fetchAvdodBucs, fetchBucParticipants, fetchBucs, fetchBucsInfoList, getRinaUrl, setMode } from 'actions/buc'
import BUCCrumbs from 'applications/BUC/components/BUCCrumbs/BUCCrumbs'
import BUCEdit from 'applications/BUC/pages/BUCEdit/BUCEdit'
import BUCEmpty from 'applications/BUC/pages/BUCEmpty/BUCEmpty'
import BUCList from 'applications/BUC/pages/BUCList/BUCList'
import BUCNew from 'applications/BUC/pages/BUCNew/BUCNew'
import SEDNew from 'applications/BUC/pages/SEDNew/SEDNew'
import BUCWebSocket from 'applications/BUC/websocket/WebSocket'
import { Bucs, BucsInfo } from 'declarations/buc'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, Loading, Person, RinaUrl } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import './index.css'

export interface BUCIndexProps {
  allowFullScreen: boolean;
  onFullFocus: () => void;
  onRestoreFocus: () => void;
  waitForMount?: boolean;
}

export type BUCMode = 'buclist' | 'bucedit' | 'bucnew' | 'sednew'

export interface BUCIndexSelector {
  aktoerId: string | undefined;
  avdodfnr: string | undefined;
  avdodBucs: Bucs | undefined;
  bucs: Bucs | undefined;
  bucsInfo: BucsInfo | undefined;
  currentBuc: string | undefined;
  loading: Loading;
  locale: AllowedLocaleString;
  mode: BUCMode;
  person: Person | undefined;
  rinaUrl: RinaUrl | undefined;
  sakId: string | undefined;
  sakType: string | undefined
}

const mapState = (state: State): BUCIndexSelector => ({
  aktoerId: state.app.params.aktoerId,
  avdodfnr: state.app.params.avdodfnr,
  avdodBucs: state.buc.avdodBucs,
  bucs: state.buc.bucs,
  bucsInfo: state.buc.bucsInfo,
  currentBuc: state.buc.currentBuc,
  loading: state.loading,
  locale: state.ui.locale,
  mode: state.buc.mode,
  person: state.app.person,
  rinaUrl: state.buc.rinaUrl,
  sakId: state.app.params.sakId,
  sakType: state.app.params.sakType
})

export const BUCIndex: React.FC<BUCIndexProps> = ({
  allowFullScreen, onFullFocus, onRestoreFocus, waitForMount = true
}: BUCIndexProps): JSX.Element => {
  const { aktoerId, avdodfnr, avdodBucs, bucs, currentBuc, loading, mode, person, rinaUrl, sakId, sakType }: BUCIndexSelector = useSelector<State, BUCIndexSelector>(mapState)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [_avdodfnr, setAvdodfnr] = useState<string | undefined>(avdodfnr)
  const [_mounted, setMounted] = useState<boolean>(!waitForMount)
  const [_showAvdodfnr, setShowAvdodfnr] = useState<boolean>(false)
  const [_bucs, setBucs] = useState<Bucs | undefined>(bucs)
  const [_avdodBucs, setAvdodBucs] = useState<Bucs | undefined>(avdodBucs)

  const combinedBucs = { ...avdodBucs, ...bucs }

  useEffect(() => {
    if (!_mounted) {
      if (!rinaUrl) {
        dispatch(getRinaUrl())
      }
      setMounted(true)
    }
  }, [dispatch, _mounted, rinaUrl])

  useEffect(() => {
    if (aktoerId && sakId && bucs === undefined && !loading.gettingBUCs) {
      dispatch(fetchBucs(aktoerId))
      dispatch(fetchBucsInfoList(aktoerId))
    }
  }, [aktoerId, bucs, dispatch, loading.gettingBUCs, sakId])


  useEffect(() => {
    if (avdodfnr && sakId && avdodBucs === undefined && !loading.gettingAvdodBUCs) {
      dispatch(fetchAvdodBucs(avdodfnr))
    }
  }, [avdodBucs, avdodfnr, dispatch, loading.gettingAvdodBUCs, sakId])

  useEffect(() => {
    if (bucs && !_bucs) {
      Object.keys(bucs).forEach(bucId => {
        dispatch(fetchBucParticipants(bucId))
      })
      setBucs(bucs)
    }
  }, [bucs, _bucs])

  useEffect(() => {
    if (avdodBucs && !_avdodBucs) {
      Object.keys(avdodBucs).forEach(bucId => {
        dispatch(fetchBucParticipants(bucId))
      })
      setAvdodBucs(avdodBucs)
    }
  }, [avdodBucs, !_avdodBucs])

  const _setMode = useCallback((mode) => {
    dispatch(setMode(mode))
    if (allowFullScreen) {
      if (mode === 'bucnew' || mode === 'sednew') {
        onFullFocus()
      } else {
        onRestoreFocus()
      }
    }
  }, [allowFullScreen, dispatch, onFullFocus, onRestoreFocus])

  useEffect(() => {
    if (loading.gettingBUCs && mode !== 'buclist') {
      _setMode('buclist')
    }
  }, [loading.gettingBUCs, mode, _setMode])

  if (!_mounted) {
    return <Ui.WaitingPanel />
  }

  if (!sakId || !aktoerId) {
    return (
      <BUCEmpty
        aktoerId={aktoerId}
        onBUCNew={() => _setMode('bucnew')}
        sakId={sakId}
      />
    )
  }

  if (!loading.gettingBUCs && bucs !== undefined && _.isEmpty(bucs) && mode !== 'bucnew') {
    _setMode('bucnew')
  }

  return (
    <div className='a-buc-widget'>
      <div className='a-buc-widget__header mb-3'>
        <BUCCrumbs
          bucs={combinedBucs}
          currentBuc={currentBuc}
          mode={mode}
          setMode={_setMode}
        />
        <BUCWebSocket
          fnr={_.get(person, 'aktoer.ident.ident')}
          avdodfnr={avdodfnr}
        />
      </div>
      {sakType === 'Gjenlevendeytelse' && !avdodfnr
        ? (
          _showAvdodfnr ? (
            <div className='d-flex flex-row align-items-end'>
              <Ui.Nav.Input bredde='S' label={t('buc:form-avdodfnrInput')} value={_avdodfnr} onChange={(e: ChangeEvent<HTMLInputElement>) => setAvdodfnr(e.target.value)} />
              <Ui.Nav.Knapp mini className='ml-2 mb-3' onClick={() => dispatch(setStatusParam('avdodfnr', _avdodfnr))}>{t('buc:form-avdodfnrButton')}</Ui.Nav.Knapp>
            </div>
          ) : (
            <Ui.Nav.Knapp mini onClick={() => setShowAvdodfnr(true)}>{t('buc:form-avdodfnr')}</Ui.Nav.Knapp>
          )
        )
        : null}
      {mode === 'buclist' ? <BUCList aktoerId={aktoerId} bucs={combinedBucs} setMode={_setMode} /> : null}
      {mode === 'bucedit' ? <BUCEdit aktoerId={aktoerId} bucs={combinedBucs} currentBuc={currentBuc} setMode={_setMode} /> : null}
      {mode === 'bucnew' ? <BUCNew aktoerId={aktoerId} setMode={_setMode} /> : null}
      {mode === 'sednew' ? <SEDNew aktoerId={aktoerId} bucs={combinedBucs} currentBuc={currentBuc} setMode={_setMode} /> : null}
    </div>
  )
}

BUCIndex.propTypes = {
  allowFullScreen: PT.bool.isRequired,
  onFullFocus: PT.func.isRequired,
  onRestoreFocus: PT.func.isRequired,
  waitForMount: PT.bool
}

export default BUCIndex
