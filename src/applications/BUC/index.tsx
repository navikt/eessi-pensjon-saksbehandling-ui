import {
  fetchBucParticipants,
  fetchBucs,
  fetchBucsInfoList,
  fetchBucsWithVedtakId,
  getRinaUrl,
  setCurrentBuc,
  setMode
} from 'actions/buc'
import BUCEdit from 'applications/BUC/pages/BUCEdit/BUCEdit'
import BUCEmpty from 'applications/BUC/pages/BUCEmpty/BUCEmpty'
import BUCList from 'applications/BUC/pages/BUCList/BUCList'
import BUCNew from 'applications/BUC/pages/BUCNew/BUCNew'
import SEDNew from 'applications/BUC/pages/SEDNew/SEDNew'
import classNames from 'classnames'
import { VerticalSeparatorDiv } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import * as constants from 'constants/constants'
import { Bucs, BucsInfo } from 'declarations/buc'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, FeatureToggles, Loading, PesysContext, RinaUrl } from 'declarations/types'
import _ from 'lodash'
import { timeDiffLogger } from 'metrics/loggers'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { keyframes } from 'styled-components'

const transition = 0
const timeout = 1
const zoomOutTransition = 0

const ContainerDiv = styled.div`
  width: 100%;
  display: block;
  overflow: hidden;
  will-change: transform;
  &.donotshrink {
    transform: scale(0.96);
    transform-origin: center center;
    transition: transform ${zoomOutTransition}s ease-in;
  }
  &:not(.donotshrink) {
    transform: scale(1);
    transform-origin: center center;
    transition: transform ${zoomOutTransition}s ease-out;
  }
`
const WindowDiv = styled.div`
  width: 200%;
  display: flex;
  overflow: hidden;
`
const fadeIn = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 1; }
`
const fadeOut = keyframes`
  0% { opacity: 1; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`
const AnimatableDiv = styled.div`
  flex: 1;
  background: inherit;
  &.animate {
    will-change: transform, opacity;
    pointer-events: none;
    * {
      pointer-events: none;
    }
    transition: transform ${transition}ms ease-in-out;
  }
  &.left {
    transform: translateX(0%);
  }
  &.right {
    transform: translateX(20%);
  }
  &.alt_left {
    transform: translateX(-120%);
  }
  &.alt_right {
    transform: translateX(-100%);
  }
  &.A_going_to_left {
    transform: translateX(-120%);
    animation: ${fadeOut} ${transition}ms forwards;
  }
  &.A_going_to_right {
    animation: ${fadeIn} ${transition}ms forwards;
    transform: translateX(0%);
  }
  &.B_going_to_left {
    animation: ${fadeIn} ${transition}ms forwards;
    transform: translateX(-100%);
  }
  &.B_going_to_right {
    animation: ${fadeOut} ${transition}ms forwards;
    transform: translateX(20%);
  }
`

const WaitingPanelDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`

export interface BUCIndexProps {
  allowFullScreen: boolean
  onFullFocus: () => void
  onRestoreFocus: () => void
  waitForMount?: boolean
}

export type BUCMode = 'buclist' | 'bucedit' | 'bucnew' | 'sednew'

export interface BUCIndexSelector {
  aktoerId: string | undefined
  bucs: Bucs | undefined
  bucsInfo: BucsInfo | undefined
  currentBuc: string | undefined
  featureToggles: FeatureToggles
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
  featureToggles: state.app.featureToggles,
  loading: state.loading,
  locale: state.ui.locale,
  mode: state.buc.mode,
  pesysContext: state.app.pesysContext,
  rinaUrl: state.buc.rinaUrl,
  sakId: state.app.params.sakId,
  sakType: state.app.params.sakType,
  vedtakId: state.app.params.vedtakId
})

export enum Slide {
  LEFT,
  RIGHT,
  ALT_LEFT,
  ALT_RIGHT,
  A_GOING_TO_LEFT,
  A_GOING_TO_RIGHT,
  B_GOING_TO_LEFT,
  B_GOING_TO_RIGHT
}

const BUCIndexDiv = styled.div``

export const BUCIndex: React.FC<BUCIndexProps> = ({
//  allowFullScreen, onFullFocus, onRestoreFocus,
  waitForMount = true
}: BUCIndexProps): JSX.Element => {
  const { aktoerId, bucs, featureToggles, loading, mode, pesysContext, rinaUrl, sakId, vedtakId }: BUCIndexSelector =
    useSelector<State, BUCIndexSelector>(mapState)
  const dispatch = useDispatch()
  const [_mounted, setMounted] = useState<boolean>(!waitForMount)
  const [_bucs, setBucs] = useState<Bucs | undefined>(undefined)
  const [positionA, setPositionA] = useState<Slide>(Slide.LEFT)
  const [positionB, setPositionB] = useState<Slide>(Slide.RIGHT)
  const [contentA, setContentA] = useState<any>(null)
  const [contentB, setContentB] = useState<any>(null)
  const [animating, setAnimating] = useState<boolean>(false)
  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)

  const onMouseEnter = () => setMouseEnterDate(new Date())

  const onMouseLeave = () => {
    if (mouseEnterDate) {
      setTotalTimeWithMouseOver(totalTimeWithMouseOver + (new Date().getTime() - mouseEnterDate?.getTime()))
    }
  }

  const WaitingDiv = (
    <WaitingPanelDiv>
      <WaitingPanel />
    </WaitingPanelDiv>
  )

  const EmptyBuc = (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <BUCEmpty
        aktoerId={aktoerId}
        sakId={sakId}
      />
    </div>
  )

  const _setMode = useCallback((newMode: BUCMode, from: string, callback?: any) => {
    if (animating) {
      return
    }
    if (newMode === 'buclist' || newMode === 'bucnew') {
      if (!from || from === 'none') {
        setPositionA(Slide.LEFT)
        setPositionB(Slide.RIGHT)
        if (callback) {
          callback()
        }
        // setOnTransitionA(() => {})
      }
      if (from === 'back') {
        setPositionA(Slide.A_GOING_TO_RIGHT)
        setPositionB(Slide.B_GOING_TO_RIGHT)
        setAnimating(true)
        setTimeout(() => {
          console.log('Timeout end')
          setPositionA(Slide.LEFT)
          setPositionB(Slide.RIGHT)
          setAnimating(false)
          if (callback) {
            callback()
          }
        }, timeout)
      }

      if (newMode === 'bucnew') {
        setContentA(<BUCList setMode={_setMode} initialBucNew />)
      }
      if (newMode === 'buclist') {
        setContentA(<BUCList setMode={_setMode} />)
      }
    }
    if (newMode === 'bucedit' || newMode === 'sednew') {
      if (!from || from === 'none') {
        setPositionA(Slide.ALT_LEFT)
        setPositionB(Slide.ALT_RIGHT)
        if (callback) {
          callback()
        }
        // setOnTransitionB(() => {})
      }
      if (from === 'forward') {
        setPositionA(Slide.A_GOING_TO_LEFT)
        setPositionB(Slide.B_GOING_TO_LEFT)
        setAnimating(true)
        setTimeout(() => {
          console.log('Timeout end')
          setPositionA(Slide.ALT_LEFT)
          setPositionB(Slide.ALT_RIGHT)
          setAnimating(false)
          if (callback) {
            callback()
          }
        }, timeout)
      }
      if (newMode === 'bucedit') {
        setContentB(<BUCEdit setMode={_setMode} />)
      }
      if (newMode === 'sednew') {
        setContentB(<BUCEdit setMode={_setMode} initialSedNew />)
      }
    }
    /*
    if (allowFullScreen) {
      if (newMode === 'bucnew' || newMode === 'sednew') {
        onFullFocus()
      } else {
        onRestoreFocus()
      }
    } */
    dispatch(setMode(newMode))
  }, [animating, dispatch])//, allowFullScreen, onFullFocus, onRestoreFocus])

  useEffect(() => {
    if (!_mounted) {
      if (!rinaUrl) {
        dispatch(getRinaUrl())
      }
      setContentA(WaitingDiv)
      setMounted(true)
      if (!aktoerId || !sakId) {
        setContentA(EmptyBuc)
      } else {
        _setMode('buclist', 'none')
      }
    }
  }, [dispatch, aktoerId, EmptyBuc, _mounted, rinaUrl, sakId, _setMode, WaitingDiv])

  useEffect(() => {
    return () => {
      timeDiffLogger('buc.mouseover', totalTimeWithMouseOver)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (aktoerId && sakId && bucs === undefined && !loading.gettingBUCs) {
      dispatch(pesysContext === constants.VEDTAKSKONTEKST ? fetchBucsWithVedtakId(aktoerId, vedtakId) : fetchBucs(aktoerId))
      dispatch(fetchBucsInfoList(aktoerId))
    }
  }, [aktoerId, bucs, dispatch, loading.gettingBUCs, pesysContext, sakId, vedtakId])

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

  useEffect(() => {
    if (featureToggles.v2_ENABLED !== true && loading.gettingBUCs && mode !== 'buclist') {
      _setMode('buclist', 'none', () => dispatch(setCurrentBuc(undefined)))
    }
  }, [dispatch, featureToggles, loading.gettingBUCs, mode, _setMode])

  if (featureToggles.v2_ENABLED !== true && !loading.gettingBUCs && bucs !== undefined && _.isEmpty(bucs) && mode !== 'bucnew') {
    _setMode('bucnew', 'none')
  }

  if (!_mounted) {
    return WaitingDiv
  }

  if (!sakId || !aktoerId) {
    return EmptyBuc
  }

  const cls = (position: Slide) => ({
    animate: ![Slide.LEFT, Slide.RIGHT, Slide.ALT_LEFT, Slide.ALT_RIGHT].includes(position),
    A_going_to_left: Slide.A_GOING_TO_LEFT === position,
    A_going_to_right: Slide.A_GOING_TO_RIGHT === position,
    B_going_to_left: Slide.B_GOING_TO_LEFT === position,
    B_going_to_right: Slide.B_GOING_TO_RIGHT === position,
    alt_left: Slide.ALT_LEFT === position,
    alt_right: Slide.ALT_RIGHT === position,
    right: Slide.RIGHT === position,
    left: Slide.LEFT === position
  })

  return (
    <BUCIndexDiv
      key='bucIndexDiv'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <VerticalSeparatorDiv />
      {featureToggles.v2_ENABLED !== true ? (
        <>
          {mode === 'buclist' && <BUCList setMode={_setMode} />}
          {mode === 'bucedit' && <BUCEdit setMode={_setMode} />}
          {mode === 'bucnew' && <BUCNew setMode={_setMode} />}
          {mode === 'sednew' && <SEDNew setMode={_setMode} />}
        </>
      ) : (
        <>
          <ContainerDiv className={classNames({ shrink: animating })}>
            <WindowDiv>
              <AnimatableDiv
                key='animatableDivA'
                className={classNames(cls(positionA))}
              >
                {contentA}
              </AnimatableDiv>
              <AnimatableDiv
                key='animatableDivB'
                className={classNames(cls(positionB))}
              >
                {contentB}
              </AnimatableDiv>
            </WindowDiv>
          </ContainerDiv>
        </>
      )}
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
