import {
  endBucsFetch,
  fetchBuc,
  startBucsFetch
} from 'src/actions/buc'
import BUCEdit from 'src/applications/BUC/pages/BUCEdit/BUCEdit'
import BUCList from 'src/applications/BUC/pages/BUCList/BUCList'
import classNames from 'classnames'
import WaitingPanel from 'src/components/WaitingPanel/WaitingPanel'
import { BUCMode, PesysContext } from 'src/declarations/app.d'
import { BucListItem, Bucs } from 'src/declarations/buc'
import { State } from 'src/declarations/reducers'
import _ from 'lodash'
import { timeDiffLogger } from 'src/metrics/loggers'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import {fetchBucsListForAvdod, fetchBucsListForGjenlevende} from "src/actions/gjenny";
import {WaitingPanelDiv} from "src/components/StyledComponents";
import {Box} from "@navikt/ds-react";

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
    height: 1vh;
  }
  &.right {
    transform: translateX(40%);
    height: 1vh;
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
    height: 1vh;
  }
  &.alt_middle {
    transform: translateX(-100%);
  }
  &.alt_right {
    transform: translateX(-80%);
    height: 1vh;
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
    height: 1vh;
  }
  &.super_alt_middle {
    transform: translateX(-220%);
    height: 1vh;
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

export const WindowDiv = styled.div`
  width: 300%;
  display: flex;
  overflow: hidden;
`

export interface BUCIndexPageSelector {
  aktoerId: string | null | undefined
  avdodFnr: string | null | undefined
  bucs: Bucs | undefined
  bucsList: Array<BucListItem> | null | undefined
  gettingBucs: boolean
  gettingBucsList: boolean
  howManyBucLists: number
  pesysContext: PesysContext | undefined
}

const mapState = (state: State): BUCIndexPageSelector => ({
  aktoerId: state.app.params.aktoerId,
  avdodFnr: state.app.params.avdodFnr,
  bucs: state.buc.bucs,
  bucsList: state.buc.bucsList,
  gettingBucs: state.loading.gettingBucs,
  gettingBucsList: state.loading.gettingBucsList,
  howManyBucLists: state.buc.howManyBucLists,
  pesysContext: state.app.pesysContext
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

export const BUCIndexPageGjenny = (): JSX.Element => {
  const {
    aktoerId, avdodFnr, bucs, bucsList, gettingBucs, gettingBucsList, howManyBucLists,
    pesysContext
  }: BUCIndexPageSelector = useSelector<State, BUCIndexPageSelector>(mapState)
  const dispatch = useDispatch()

  const [_noParams, setNoParams] = useState<boolean | undefined>(undefined)

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

  const changeMode = useCallback((newMode: BUCMode, from: string, callback?: () => void, content?: JSX.Element) => {
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
    if (newMode === 'p4000' || newMode === 'p5000' || newMode === 'p2000' || newMode === 'p8000') {
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
    setContentA(WaitingDiv)
    setNoParams(false)
    changeMode('buclist', 'none')
  }, [])

  useEffect(() => {
    if (_noParams && aktoerId && avdodFnr) {
      setNoParams(false)
      setContentA(<BUCList setMode={changeMode} />)
    }
  }, [])

  useEffect(() => {
    return () => {
      timeDiffLogger('buc.mouseover', totalTimeWithMouseOver)
    }
  }, [])

  useEffect(() => {
    if (aktoerId && avdodFnr && bucsList === undefined && !gettingBucsList) {
      dispatch(fetchBucsListForGjenlevende(aktoerId))
      dispatch(fetchBucsListForAvdod(aktoerId, avdodFnr))
    }
  }, [aktoerId, bucs, dispatch, gettingBucsList, pesysContext, avdodFnr])

  useEffect(() => {
    if (aktoerId && avdodFnr && _.isEmpty(bucs) && !_.isEmpty(bucsList) && howManyBucLists === 0 && !gettingBucs) {
      dispatch(startBucsFetch())
      bucsList?.forEach((bucListItem) => {
        dispatch(fetchBuc(
          bucListItem.euxCaseId, bucListItem.aktoerId, bucListItem.saknr, bucListItem.avdodFnr, bucListItem.kilde
        ))
      })
    }
  }, [bucs, bucsList, howManyBucLists, gettingBucs])

  useEffect(() => {
    if (aktoerId && avdodFnr && !_.isEmpty(bucs) && !_.isNil(bucsList) && gettingBucs) {
      if (Object.keys(bucs!).length === bucsList!.length) {
        dispatch(endBucsFetch())
      }
    }
  }, [bucs, bucsList, gettingBucs])

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
      data-testid='a-buc-index'
      key='bucIndexDiv'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Box paddingBlock="4 0">
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
      </Box>
    </div>
  )
}

export default BUCIndexPageGjenny
