import {
  fetchBucParticipants,
  fetchBucs,
  fetchBucsInfoList,
  fetchBucsWithVedtakId,
  getRinaUrl,
  getSakType,
  setMode
} from 'actions/buc'
import BUCEdit from 'applications/BUC/pages/BUCEdit/BUCEdit'
import BUCEmpty from 'applications/BUC/pages/BUCEmpty/BUCEmpty'
import BUCList from 'applications/BUC/pages/BUCList/BUCList'
import classNames from 'classnames'

import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import * as constants from 'constants/constants'
import { AllowedLocaleString, Loading, PesysContext, RinaUrl } from 'declarations/app.d'
import { Bucs, BucsInfo, SakTypeValue } from 'declarations/buc'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { timeDiffLogger } from 'metrics/loggers'
import { fadeIn, fadeOut, VerticalSeparatorDiv } from 'nav-hoykontrast'
import PT from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const transition = 1000
const timeout = 1001

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
  &.middle {
    transform: translateX(20%);
  }
  &.right {
    transform: translateX(40%);
  }

  &.A_going_to_right {
    animation: ${fadeIn} ${transition}ms forwards;
    transform: translateX(0%);
  }
  &.B_going_to_right {
    animation: ${fadeOut} ${transition}ms forwards;
    transform: translateX(20%);
  }
  &.C_going_to_right {
    animation: ${fadeOut} ${transition}ms forwards;
    transform: translateX(40%);
  }

  &.alt_left {
    transform: translateX(-120%);
  }
  &.alt_middle {
    transform: translateX(-100%);
  }
  &.alt_right {
    transform: translateX(-80%);
  }

  &.A_going_to_middle {
    transform: translateX(-120%);
    animation: ${fadeOut} ${transition}ms forwards;
  }
  &.B_going_to_middle {
    animation: ${fadeIn} ${transition}ms forwards;
    transform: translateX(-100%);
  }
  &.C_going_to_middle {
    animation: ${fadeIn} ${transition}ms forwards;
    transform: translateX(-100%);
  }

  &.super_alt_left {
    transform: translateX(-240%);
  }
  &.super_alt_middle {
    transform: translateX(-220%);
  }
  &.super_alt_right {
    transform: translateX(-200%);
  }

  &.A_going_to_left {
    transform: translateX(-240%);
    animation: ${fadeOut} ${transition}ms forwards;
  }
  &.B_going_to_left {
    animation: ${fadeIn} ${transition}ms forwards;
    transform: translateX(-220%);
  }
  &.C_going_to_left {
    animation: ${fadeIn} ${transition}ms forwards;
    transform: translateX(-200%);
  }

`
export const ContainerDiv = styled.div`
  width: 100%;
  display: block;
  overflow: hidden;
`
const WaitingPanelDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`
export const WindowDiv = styled.div`
  width: 300%;
  display: flex;
  overflow: hidden;
`

export interface BUCIndexProps {
  allowFullScreen: boolean
  onFullFocus: () => void
  onRestoreFocus: () => void
  waitForMount?: boolean
}

export type BUCMode = 'buclist' | 'bucedit' | 'bucnew' | 'sednew' | 'p5000'

export interface BUCIndexSelector {
  aktoerId: string | undefined
  bucs: Bucs | undefined
  bucsInfo: BucsInfo | undefined
  currentBuc: string | undefined
  loading: Loading
  locale: AllowedLocaleString
  pesysContext: PesysContext | undefined
  rinaUrl: RinaUrl | undefined
  sakId: string | undefined
  sakType: SakTypeValue | undefined
  vedtakId: string | undefined
}

const mapState = (state: State): BUCIndexSelector => ({
  aktoerId: state.app.params.aktoerId,
  bucs: state.buc.bucs,
  bucsInfo: state.buc.bucsInfo,
  currentBuc: state.buc.currentBuc,
  loading: state.loading,
  locale: state.ui.locale,
  pesysContext: state.app.pesysContext,
  rinaUrl: state.buc.rinaUrl,
  sakId: state.app.params.sakId,
  sakType: state.app.params.sakType as SakTypeValue,
  vedtakId: state.app.params.vedtakId
})

export enum Slide {
  LEFT,
  MIDDLE,
  RIGHT,
  ALT_LEFT,
  ALT_MIDDLE,
  ALT_RIGHT,
  SUPER_ALT_LEFT,
  SUPER_ALT_MIDDLE,
  SUPER_ALT_RIGHT,
  A_GOING_TO_LEFT,
  A_GOING_TO_MIDDLE,
  A_GOING_TO_RIGHT,
  B_GOING_TO_LEFT,
  B_GOING_TO_MIDDLE,
  B_GOING_TO_RIGHT,
  C_GOING_TO_LEFT,
  C_GOING_TO_MIDDLE,
  C_GOING_TO_RIGHT
}

export const BUCIndexDiv = styled.div``

export const BUCIndex: React.FC<BUCIndexProps> = ({
//  allowFullScreen, onFullFocus, onRestoreFocus,
  waitForMount = true
}: BUCIndexProps): JSX.Element => {
  const { aktoerId, bucs, loading, pesysContext, rinaUrl, sakId, sakType, vedtakId }: BUCIndexSelector =
    useSelector<State, BUCIndexSelector>(mapState)
  const dispatch = useDispatch()
  const [_noParams, setNoParams] = useState<boolean | undefined>(undefined)
  const [_mounted, setMounted] = useState<boolean>(!waitForMount)
  const [_bucs, setBucs] = useState<Bucs | undefined>(undefined)
  const [positionA, setPositionA] = useState<Slide>(Slide.LEFT)
  const [positionB, setPositionB] = useState<Slide>(Slide.MIDDLE)
  const [positionC, setPositionC] = useState<Slide>(Slide.RIGHT)
  const [contentA, setContentA] = useState<any>(null)
  const [contentB, setContentB] = useState<any>(null)
  const [contentC, setContentC] = useState<any>(null)
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

  const _setMode = useCallback((newMode: BUCMode, from: string, callback?: () => void, content?: JSX.Element) => {
    if (animating) {
      return
    }
    if (newMode === 'bucnew') {
      setContentA(<BUCList setMode={_setMode} initialBucNew />)
    }
    if (newMode === 'buclist') {
      setContentA(<BUCList setMode={_setMode} />)
    }
    if (newMode === 'buclist' || newMode === 'bucnew') {
      if (!from || from === 'none') {
        setPositionA(Slide.LEFT)
        setPositionB(Slide.MIDDLE)
        setPositionC(Slide.RIGHT)
        if (callback) {
          callback()
        }
      }
      if (from === 'back') {
        setPositionA(Slide.A_GOING_TO_RIGHT)
        setPositionB(Slide.B_GOING_TO_RIGHT)
        setPositionC(Slide.C_GOING_TO_RIGHT)
        setAnimating(true)
        setTimeout(() => {
          console.log('Timeout end')
          setPositionA(Slide.LEFT)
          setPositionB(Slide.MIDDLE)
          setPositionC(Slide.RIGHT)
          setAnimating(false)
          if (callback) {
            callback()
          }
        }, timeout)
      }
    }
    if (newMode === 'bucedit' || newMode === 'sednew') {
      if (newMode === 'bucedit') {
        setContentB(<BUCEdit key={new Date().getTime()} setMode={_setMode} initialSedNew='none' />)
      }
      if (newMode === 'sednew') {
        setContentB(<BUCEdit key={new Date().getTime()} setMode={_setMode} initialSedNew='open' />)
      }
      if (!from || from === 'none') {
        setPositionA(Slide.ALT_LEFT)
        setPositionB(Slide.ALT_MIDDLE)
        setPositionC(Slide.ALT_RIGHT)
        if (callback) {
          callback()
        }
      }
      if (from === 'forward') {
        setPositionA(Slide.A_GOING_TO_MIDDLE)
        setPositionB(Slide.B_GOING_TO_MIDDLE)
        setPositionC(Slide.C_GOING_TO_MIDDLE)
        setAnimating(true)
        setTimeout(() => {
          console.log('Timeout end')
          setPositionA(Slide.ALT_LEFT)
          setPositionB(Slide.ALT_MIDDLE)
          setPositionC(Slide.ALT_RIGHT)
          setAnimating(false)
          if (callback) {
            callback()
          }
        }, timeout)
      }
      if (from === 'back') {
        setPositionA(Slide.A_GOING_TO_MIDDLE)
        setPositionB(Slide.B_GOING_TO_MIDDLE)
        setPositionC(Slide.C_GOING_TO_MIDDLE)
        setAnimating(true)
        setTimeout(() => {
          console.log('Timeout end')
          setPositionA(Slide.ALT_LEFT)
          setPositionB(Slide.ALT_MIDDLE)
          setPositionC(Slide.ALT_RIGHT)
          setAnimating(false)
          if (callback) {
            callback()
          }
        }, timeout)
      }
    }
    if (newMode === 'p5000') {
      setContentC(content)
      if (from === 'forward') {
        setPositionA(Slide.A_GOING_TO_LEFT)
        setPositionB(Slide.B_GOING_TO_LEFT)
        setPositionC(Slide.C_GOING_TO_LEFT)
        setAnimating(true)
        setTimeout(() => {
          console.log('Timeout end')
          setPositionA(Slide.SUPER_ALT_LEFT)
          setPositionB(Slide.SUPER_ALT_MIDDLE)
          setPositionC(Slide.SUPER_ALT_RIGHT)
          setAnimating(false)
          if (callback) {
            callback()
          }
        }, timeout)
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
        setNoParams(true)
      } else {
        setNoParams(false)
        _setMode('buclist', 'none')
      }
    }
  }, [dispatch, aktoerId, EmptyBuc, _mounted, rinaUrl, sakId, _setMode, WaitingDiv])

  useEffect(() => {
    if (_mounted && _noParams && sakId && aktoerId) {
      setNoParams(false)
      setContentA(<BUCList setMode={_setMode} />)
    }
  }, [aktoerId, sakId, _mounted, _noParams, _setMode])

  useEffect(() => {
    return () => {
      timeDiffLogger('buc.mouseover', totalTimeWithMouseOver)
    }
  }, [])

  useEffect(() => {
    if (aktoerId && sakId && bucs === undefined && !loading.gettingBUCs) {
      dispatch(pesysContext === constants.VEDTAKSKONTEKST ? fetchBucsWithVedtakId(aktoerId, vedtakId) : fetchBucs(aktoerId))
      dispatch(fetchBucsInfoList(aktoerId))
    }
  }, [aktoerId, bucs, dispatch, loading.gettingBUCs, pesysContext, sakId, vedtakId])

  useEffect(() => {
    if (aktoerId && sakId && _.isNil(sakType) && !loading.gettingSakType) {
      dispatch(getSakType(sakId, aktoerId))
    }
  }, [aktoerId, dispatch, loading.gettingSakType, sakId, sakType])

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

  if (!_mounted) {
    return WaitingDiv
  }

  if (!sakId || !aktoerId) {
    return EmptyBuc
  }

  const cls = (position: Slide) => ({
    animate: ![
      Slide.LEFT, Slide.MIDDLE, Slide.RIGHT,
      Slide.ALT_LEFT, Slide.ALT_MIDDLE, Slide.ALT_RIGHT,
      Slide.SUPER_ALT_LEFT, Slide.SUPER_ALT_MIDDLE, Slide.SUPER_ALT_RIGHT
    ].includes(position),
    A_going_to_left: Slide.A_GOING_TO_LEFT === position,
    A_going_to_middle: Slide.A_GOING_TO_MIDDLE === position,
    A_going_to_right: Slide.A_GOING_TO_RIGHT === position,
    B_going_to_left: Slide.B_GOING_TO_LEFT === position,
    B_going_to_middle: Slide.B_GOING_TO_MIDDLE === position,
    B_going_to_right: Slide.B_GOING_TO_RIGHT === position,
    C_going_to_left: Slide.C_GOING_TO_LEFT === position,
    C_going_to_middle: Slide.C_GOING_TO_MIDDLE === position,
    C_going_to_right: Slide.C_GOING_TO_RIGHT === position,
    left: Slide.LEFT === position,
    middle: Slide.MIDDLE === position,
    right: Slide.RIGHT === position,
    alt_left: Slide.ALT_LEFT === position,
    alt_middle: Slide.ALT_MIDDLE === position,
    alt_right: Slide.ALT_RIGHT === position,
    super_alt_left: Slide.SUPER_ALT_LEFT === position,
    super_alt_middle: Slide.SUPER_ALT_MIDDLE === position,
    super_alt_right: Slide.SUPER_ALT_RIGHT === position
  })

  return (
    <BUCIndexDiv
      key='bucIndexDiv'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <VerticalSeparatorDiv />
      <ContainerDiv>
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
          <AnimatableDiv
            key='animatableDivC'
            className={classNames(cls(positionC))}
          >
            {contentC}
          </AnimatableDiv>
        </WindowDiv>
      </ContainerDiv>
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
