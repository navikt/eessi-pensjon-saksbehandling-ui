import {
  endBucsFetch,
  fetchBuc,
  fetchBucParticipants,
  fetchBucsInfoList,
  fetchBucsList,
  fetchBucsListWithVedtakId,
  getRinaUrl,
  getSakType,
  setMode,
  startBucsFetch
} from 'actions/buc'
import { initP5000Storage } from 'actions/p5000'
import BUCEdit from 'applications/BUC/pages/BUCEdit/BUCEdit'
import BUCEmpty from 'applications/BUC/pages/BUCEmpty/BUCEmpty'
import BUCList from 'applications/BUC/pages/BUCList/BUCList'
import classNames from 'classnames'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import * as constants from 'constants/constants'
import { BUCMode, PesysContext, RinaUrl } from 'declarations/app.d'
import { BucListItem, Bucs, SakTypeValue } from 'declarations/buc'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { timeDiffLogger } from 'metrics/loggers'
import { VerticalSeparatorDiv } from 'nav-hoykontrast'
import PT from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const transition = 500
const timeout = 501

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
    transform: translateX(0%);
  }
  &.B_going_to_right {
    transform: translateX(20%);
  }
  &.C_going_to_right {
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
  }
  &.B_going_to_middle {
    transform: translateX(-100%);
  }
  &.C_going_to_middle {
    transform: translateX(-80%);
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
  }
  &.B_going_to_left {
    transform: translateX(-220%);
  }
  &.C_going_to_left {
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

export interface BUCIndexSelector {
  aktoerId: string | null | undefined
  bucs: Bucs | undefined
  bucsList: Array<BucListItem> | null | undefined
  gettingBucs: boolean
  gettingBucsList: boolean
  gettingSakType: boolean
  pesysContext: PesysContext | undefined
  rinaUrl: RinaUrl | undefined
  sakId: string | null | undefined
  sakType: SakTypeValue | null | undefined
  vedtakId: string | null | undefined
}

const mapState = (state: State): BUCIndexSelector => ({
  aktoerId: state.app.params.aktoerId,
  bucs: state.buc.bucs,
  bucsList: state.buc.bucsList,
  gettingBucs: state.loading.gettingBucs,
  gettingBucsList: state.loading.gettingBucsList,
  gettingSakType: state.loading.gettingSakType,
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

export const BUCIndex: React.FC<BUCIndexProps> = ({
//  allowFullScreen, onFullFocus, onRestoreFocus,
  waitForMount = true
}: BUCIndexProps): JSX.Element => {
  const { aktoerId, bucs, bucsList, gettingBucs, gettingBucsList, gettingSakType, pesysContext, rinaUrl, sakId, sakType, vedtakId }: BUCIndexSelector =
    useSelector<State, BUCIndexSelector>(mapState)
  const dispatch = useDispatch()

  const [_askSakType, _setAskSakType] = useState<boolean>(false)
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

  const changeMode = useCallback((newMode: BUCMode, from: string, callback?: () => void, content?: JSX.Element) => {
    dispatch(setMode(newMode))
    if (animating) {
      return
    }
    if (newMode === 'bucnew') {
      setContentA(<BUCList setMode={changeMode} initialBucNew />)
    }
    if (newMode === 'buclist') {
      setContentA(<BUCList setMode={changeMode} />)
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
        setContentB(<BUCEdit setMode={changeMode} initialSedNew='none' />)
      }
      if (newMode === 'sednew') {
        setContentB(<BUCEdit setMode={changeMode} initialSedNew='open' />)
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
          setPositionA(Slide.ALT_LEFT)
          setPositionB(Slide.ALT_MIDDLE)
          setPositionC(Slide.ALT_RIGHT)
          setAnimating(false)
          setContentC(<div />) // remove p5000
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
  }, [animating, dispatch])

  useEffect(() => {
    if (!_mounted) {
      dispatch(initP5000Storage('P5000'))
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
        changeMode('buclist', 'none')
      }
    }
  }, [dispatch, aktoerId, EmptyBuc, _mounted, rinaUrl, sakId, changeMode, WaitingDiv])

  useEffect(() => {
    if (_mounted && _noParams && sakId && aktoerId) {
      setNoParams(false)
      setContentA(<BUCList setMode={changeMode} />)
    }
  }, [aktoerId, sakId, _mounted, _noParams, changeMode])

  useEffect(() => {
    return () => {
      timeDiffLogger('buc.mouseover', totalTimeWithMouseOver)
    }
  }, [])

  useEffect(() => {
    if (aktoerId && sakId && bucsList === undefined && !gettingBucsList) {
      dispatch(pesysContext === constants.VEDTAKSKONTEKST
        ? fetchBucsListWithVedtakId(aktoerId, sakId, vedtakId)
        : fetchBucsList(aktoerId, sakId))
      dispatch(fetchBucsInfoList(aktoerId))
    }
  }, [aktoerId, bucs, dispatch, gettingBucsList, pesysContext, sakId, vedtakId])

  useEffect(() => {
    if (aktoerId && sakId && sakType === undefined && !gettingSakType && !_askSakType) {
      dispatch(getSakType(sakId, aktoerId))
      _setAskSakType(true)
    }
  }, [aktoerId, dispatch, gettingSakType, sakId, sakType])

  useEffect(() => {
    if (aktoerId && sakId && _.isEmpty(bucs) && !_.isEmpty(bucsList) && !gettingBucs) {
      dispatch(startBucsFetch())
      bucsList?.forEach((bucListItem) => {
        dispatch(fetchBuc(
          bucListItem.euxCaseId, bucListItem.aktoerId, bucListItem.saknr, bucListItem.avdodFnr, bucListItem.kilde
        ))
      })
    }
  }, [bucs, bucsList, gettingBucs])

  useEffect(() => {
    if (aktoerId && sakId && !_.isEmpty(bucs) && !_.isNil(bucsList) && gettingBucs) {
      if (Object.keys(bucs!).length === bucsList!.length) {
        dispatch(endBucsFetch())
      }
    }
  }, [bucs, bucsList, gettingBucs])

  useEffect(() => {
    if (bucs && !_bucs) {
      Object.keys(bucs)?.forEach(bucId => {
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
    <div
      data-test-id='a-buc-index'
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
