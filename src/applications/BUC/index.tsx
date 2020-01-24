import { getSakType, setStatusParam } from 'actions/app'
import { fetchAvdodBucs, fetchBucs, fetchBucsInfoList, getRinaUrl, setMode } from 'actions/buc'
import BUCCrumbs from 'applications/BUC/components/BUCCrumbs/BUCCrumbs'
import BUCEdit from 'applications/BUC/pages/BUCEdit/BUCEdit'
import BUCEmpty from 'applications/BUC/pages/BUCEmpty/BUCEmpty'
import BUCList from 'applications/BUC/pages/BUCList/BUCList'
import BUCNew from 'applications/BUC/pages/BUCNew/BUCNew'
import SEDNew from 'applications/BUC/pages/SEDNew/SEDNew'
import BUCWebSocket from 'applications/BUC/websocket/WebSocket'
import { Bucs } from 'declarations/buc'
import { Loading, RinaUrl } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'declarations/reducers'
import './index.css'

export interface BUCIndexProps {
  allowFullScreen?: boolean;
  onFullFocus?: () => void;
  onRestoreFocus?: () => void;
  waitForMount?: boolean;
}

export interface BUCIndexSelector {
  aktoerId: string | undefined;
  avdodfnr: string | undefined;
  avdodBucs: Bucs | undefined;
  bucs: Bucs | undefined;
  currentBuc: string | undefined;
  loading: Loading;
  mode: string;
  person: any;
  rinaUrl: RinaUrl | undefined;
  sakId: string | undefined,
  sakType: string | undefined
}

const mapState = (state: State): BUCIndexSelector => ({
  aktoerId: state.app.params.aktoerId,
  avdodfnr: state.app.params.avdodfnr,
  avdodBucs: state.buc.avdodBucs,
  bucs: state.buc.bucs,
  currentBuc: state.buc.currentBuc,
  loading: state.loading,
  mode: state.buc.mode,
  person: state.app.person,
  rinaUrl: state.buc.rinaUrl,
  sakId: state.app.params.sakId,
  sakType: state.app.params.sakType
})

export const BUCIndex: React.FC<BUCIndexProps> = ({
  allowFullScreen, onFullFocus, onRestoreFocus, waitForMount = true
}: BUCIndexProps): JSX.Element => {
  const [mounted, setMounted] = useState(!waitForMount)
  const [_avdodfnr, setAvdodfnr] = useState('')
  const [show, setShow] = useState(false)
  const { aktoerId, avdodfnr, avdodBucs, bucs, currentBuc, loading, mode, person, rinaUrl, sakId, sakType }: BUCIndexSelector = useSelector<State, BUCIndexSelector>(mapState)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const combinedBucs = { ...avdodBucs, ...bucs }

  useEffect(() => {
    if (!mounted) {
      if (!rinaUrl) {
        dispatch(getRinaUrl())
      }
      setMounted(true)
    }
  }, [mounted, rinaUrl])

  useEffect(() => {
    if (aktoerId && sakId && bucs === undefined && !loading.gettingBUCs) {
      dispatch(fetchBucs(aktoerId))
      dispatch(fetchBucsInfoList(aktoerId))
    }
  }, [aktoerId, bucs, loading.gettingBUCs, sakId])

  useEffect(() => {
    if (avdodfnr && sakId && avdodBucs === undefined && !loading.gettingAvdodBUCs) {
      dispatch(fetchAvdodBucs(avdodfnr))
    }
  }, [avdodBucs, avdodfnr, loading.gettingAvdodBUCs, sakId])

  useEffect(() => {
    if (!sakType && !loading.gettingSakType && sakId && aktoerId) {
      dispatch(getSakType(sakId, aktoerId))
    }
  }, [aktoerId, loading.gettingSakType, sakType, sakId])

  const _setMode = useCallback((mode) => {
    dispatch(setMode(mode))
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
  }, [allowFullScreen, onRestoreFocus, onFullFocus])

  useEffect(() => {
    if (loading.gettingBUCs && mode !== 'buclist') {
      _setMode('buclist')
    }
  }, [loading.gettingBUCs, mode, _setMode])

  if (!mounted) {
    return <Ui.WaitingPanel />
  }

  if (!sakId || !aktoerId) {
    return (
      <BUCEmpty
        aktoerId={aktoerId}
        onBUCNew={() => _setMode('bucnew')}
        rinaUrl={rinaUrl}
        sakId={sakId}
        t={t}
      />
    )
  }

  return (
    <div className='a-buc-widget'>
      <div className='a-buc-widget__header mb-3'>
        <BUCCrumbs
          t={t}
          bucs={combinedBucs}
          currentBuc={currentBuc}
          mode={mode}
          setMode={_setMode}
        />
        <BUCWebSocket fnr={_.get(person, 'aktoer.ident.ident')} avdodfnr={avdodfnr} />
      </div>
      {sakType === 'Gjenlevendeytelse' && !avdodfnr
        ? (
          show ? (
            <div className='d-flex flex-row align-items-end'>
              <Ui.Nav.Input bredde='S' label={t('buc:form-avdodfnrInput')} value={_avdodfnr} onChange={(e: ChangeEvent<HTMLInputElement>) => setAvdodfnr(e.target.value)} />
              <Ui.Nav.Knapp mini className='ml-2 mb-3' onClick={() => dispatch(setStatusParam('avdodfnr', _avdodfnr))}>{t('buc:form-avdodfnrButton')}</Ui.Nav.Knapp>
            </div>
          ) : (
            <Ui.Nav.Knapp mini onClick={() => setShow(true)}>{t('buc:form-avdodfnr')}</Ui.Nav.Knapp>
          )
        )
        : null}
      {mode === 'buclist' ? <BUCList aktoerId={aktoerId} bucs={combinedBucs} setMode={_setMode} t={t} /> : null}
      {mode === 'bucedit' ? <BUCEdit aktoerId={aktoerId} bucs={combinedBucs} setMode={_setMode} t={t} /> : null}
      {mode === 'bucnew' ? <BUCNew aktoerId={aktoerId} setMode={_setMode} t={t} /> : null}
      {mode === 'sednew' ? <SEDNew t={t} bucs={combinedBucs} setMode={_setMode} /> : null}
    </div>
  )
}

BUCIndex.propTypes = {
  allowFullScreen: PT.bool,
  onFullFocus: PT.func,
  onRestoreFocus: PT.func,
  waitForMount: PT.bool
}

export default BUCIndex
