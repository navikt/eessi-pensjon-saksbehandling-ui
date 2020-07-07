import {
  fetchBucParticipants,
  fetchBucs,
  fetchBucsInfoList,
  fetchBucsWithVedtakId,
  getRinaUrl,
  setMode
} from 'actions/buc'
import BUCEdit from 'applications/BUC/pages/BUCEdit/BUCEdit'
import BUCEmpty from 'applications/BUC/pages/BUCEmpty/BUCEmpty'
import BUCList from 'applications/BUC/pages/BUCList/BUCList'
import BUCNew from 'applications/BUC/pages/BUCNew/BUCNew'
import SEDNew from 'applications/BUC/pages/SEDNew/SEDNew'
import { VerticalSeparatorDiv } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Bucs, BucsInfo } from 'declarations/buc'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, Loading, PesysContext, RinaUrl } from 'declarations/types'
import _ from 'lodash'
import { timeDiffLogger } from 'metrics/loggers'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

export interface BUCIndexProps {
  allowFullScreen: boolean;
  onFullFocus: () => void;
  onRestoreFocus: () => void;
  waitForMount?: boolean;
}

export type BUCMode = 'buclist' | 'bucedit' | 'bucnew' | 'sednew'

export interface BUCIndexSelector {
  aktoerId: string | undefined
  bucs: Bucs | undefined
  bucsInfo: BucsInfo | undefined
  currentBuc: string | undefined
  loading: Loading
  locale: AllowedLocaleString
  mode: BUCMode
  pesysContext: PesysContext | undefined
  rinaUrl: RinaUrl | undefined
  sakId: string | undefined
  sakType: string | undefined
  vedtakId: string | undefined
}

const mapState = (state: State): BUCIndexSelector => ({
  aktoerId: state.app.params.aktoerId,
  bucs: state.buc.bucs,
  bucsInfo: state.buc.bucsInfo,
  currentBuc: state.buc.currentBuc,
  loading: state.loading,
  locale: state.ui.locale,
  mode: state.buc.mode,
  pesysContext: state.app.pesysContext,
  rinaUrl: state.buc.rinaUrl,
  sakId: state.app.params.sakId,
  sakType: state.app.params.sakType,
  vedtakId: state.app.params.vedtakId
})

const BUCIndexDiv = styled.div``

export const BUCIndex: React.FC<BUCIndexProps> = ({
  allowFullScreen, onFullFocus, onRestoreFocus, waitForMount = true
}: BUCIndexProps): JSX.Element => {
  const { aktoerId, bucs, currentBuc, loading, mode, pesysContext, rinaUrl, sakId, vedtakId }: BUCIndexSelector =
    useSelector<State, BUCIndexSelector>(mapState)
  const dispatch = useDispatch()
  const [_mounted, setMounted] = useState<boolean>(!waitForMount)
  const [_bucs, setBucs] = useState<Bucs | undefined>(undefined)

  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    if (!_mounted) {
      if (!rinaUrl) {
        dispatch(getRinaUrl())
      }
      setMounted(true)
    }
  }, [dispatch, _mounted, rinaUrl])

  useEffect(() => {
    return () => {
      timeDiffLogger('buc.mouseover', totalTimeWithMouseOver)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (aktoerId && sakId && bucs === undefined && !loading.gettingBUCs) {
      dispatch(pesysContext === 'vedtakskontekst' ? fetchBucsWithVedtakId(aktoerId, vedtakId) : fetchBucs(aktoerId))
      dispatch(fetchBucsInfoList(aktoerId))
    }
  }, [aktoerId, bucs, dispatch, loading.gettingBUCs, sakId, vedtakId])

  useEffect(() => {
    if (bucs && !_bucs) {
      Object.keys(bucs).forEach(bucId => {
        if (bucs[bucId].type && _.isNil(bucs[bucId].institusjon)) {
          dispatch(fetchBucParticipants(bucId))
        }
      })
      setBucs(bucs)
    }
  }, [bucs, _bucs, dispatch])

  const onMouseEnter = () => setMouseEnterDate(new Date())

  const onMouseLeave = () => {
    if (mouseEnterDate) {
      setTotalTimeWithMouseOver(totalTimeWithMouseOver + (new Date().getTime() - mouseEnterDate?.getTime()))
    }
  }

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
    return <WaitingPanel />
  }

  if (!sakId || !aktoerId) {
    return (
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <BUCEmpty
          aktoerId={aktoerId}
          onBUCNew={() => _setMode('bucnew')}
          sakId={sakId}
        />
      </div>
    )
  }

  if (!loading.gettingBUCs && bucs !== undefined && _.isEmpty(bucs) && mode !== 'bucnew') {
    _setMode('bucnew')
  }

  return (
    <BUCIndexDiv
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <VerticalSeparatorDiv />
      {mode === 'buclist' && <BUCList aktoerId={aktoerId} bucs={bucs!} setMode={_setMode} />}
      {mode === 'bucedit' && <BUCEdit aktoerId={aktoerId} bucs={bucs!} currentBuc={currentBuc} setMode={_setMode} />}
      {mode === 'bucnew' && <BUCNew aktoerId={aktoerId} setMode={_setMode} />}
      {mode === 'sednew' && <SEDNew aktoerId={aktoerId} bucs={bucs!} currentBuc={currentBuc!} setMode={_setMode} />}
    </BUCIndexDiv>
  )
}

BUCIndex.propTypes = {
  allowFullScreen: PT.bool.isRequired,
  onFullFocus: PT.func.isRequired,
  onRestoreFocus: PT.func.isRequired,
  waitForMount: PT.bool
}

export default BUCIndex
