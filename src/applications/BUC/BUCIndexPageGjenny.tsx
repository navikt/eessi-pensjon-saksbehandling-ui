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
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {fetchBucsListForAvdod, fetchBucsListForGjenlevende} from "src/actions/gjenny";
import {Box} from "@navikt/ds-react";
import commonStyles from 'src/assets/css/common.module.css'
import styles from './BUCIndexPage.module.css'

const timeout = 501

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

enum Slide {
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

const BUCIndexPageGjenny = (): JSX.Element => {
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

  const WaitingDiv = (
    <div className={commonStyles.waitingPanel}>
      <WaitingPanel />
    </div>
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
    [styles.animate]: ![
      Slide.LEFT, Slide.MIDDLE, Slide.RIGHT,
      Slide.ALT_LEFT, Slide.ALT_MIDDLE, Slide.ALT_RIGHT,
      Slide.SUPER_ALT_LEFT, Slide.SUPER_ALT_MIDDLE, Slide.SUPER_ALT_RIGHT
    ].includes(position),
    [styles.A_going_to_left]: Slide.A_GOING_TO_LEFT === position,
    [styles.A_going_to_middle]: Slide.A_GOING_TO_MIDDLE === position,
    [styles.A_going_to_right]: Slide.A_GOING_TO_RIGHT === position,
    [styles.B_going_to_left]: Slide.B_GOING_TO_LEFT === position,
    [styles.B_going_to_middle]: Slide.B_GOING_TO_MIDDLE === position,
    [styles.B_going_to_right]: Slide.B_GOING_TO_RIGHT === position,
    [styles.C_going_to_left]: Slide.C_GOING_TO_LEFT === position,
    [styles.C_going_to_middle]: Slide.C_GOING_TO_MIDDLE === position,
    [styles.C_going_to_right]: Slide.C_GOING_TO_RIGHT === position,
    [styles.left]: Slide.LEFT === position,
    [styles.middle]: Slide.MIDDLE === position,
    [styles.right]: Slide.RIGHT === position,
    [styles.alt_left]: Slide.ALT_LEFT === position,
    [styles.alt_middle]: Slide.ALT_MIDDLE === position,
    [styles.alt_right]: Slide.ALT_RIGHT === position,
    [styles.super_alt_left]: Slide.SUPER_ALT_LEFT === position,
    [styles.super_alt_middle]: Slide.SUPER_ALT_MIDDLE === position,
    [styles.super_alt_right]: Slide.SUPER_ALT_RIGHT === position
  })

  return (
    <div
      data-testid='a-buc-index'
      key='bucIndexDiv'
    >
      <Box paddingBlock="4 0">
        <div className={styles.container}>
          <div className={styles.window}>
            <div
              key='animatableDivA'
              className={classNames(styles.animatable, cls(positionA))}
            >
              {contentA}
            </div>
            <div
              key='animatableDivB'
              className={classNames(styles.animatable, cls(positionB))}
            >
              {contentB}
            </div>
            <div
              key='animatableDivC'
              className={classNames(styles.animatable, cls(positionC))}
            >
              {contentC}
            </div>
          </div>
        </div>
      </Box>
    </div>
  )
}

export default BUCIndexPageGjenny
