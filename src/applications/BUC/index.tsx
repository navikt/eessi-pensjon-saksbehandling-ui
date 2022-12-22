import * as constants from 'constants/constants'
import {PesysContext, RinaUrl} from 'declarations/app.d'
import { State } from 'declarations/reducers'
import {useDispatch, useSelector} from 'react-redux'
import BUCIndexVedtaksKontekst from "./BUCIndexVedtaksKontekst";
import BUCIndexBrukerKontekst from "./BUCIndexBrukerKontekst";
import {useEffect, useState} from "react";
import {getRinaUrl, getSakType} from "../../actions/buc";
import {SakTypeValue} from "../../declarations/buc";
import {loadAllEntries} from "../../actions/localStorage";

export interface BUCIndexSelector {
  pesysContext: PesysContext | undefined
  aktoerId: string | null | undefined
  vedtakId: string | null | undefined
  sakId: string | null | undefined
  sakType: SakTypeValue | null | undefined
  gettingSakType: boolean,
  rinaUrl: RinaUrl | undefined
}

const mapState = (state: State): BUCIndexSelector => ({
  pesysContext: state.app.pesysContext,
  sakId: state.app.params.sakId,
  sakType: state.app.params.sakType as SakTypeValue,
  vedtakId: state.app.params.vedtakId,
  aktoerId: state.app.params.aktoerId,
  gettingSakType: state.loading.gettingSakType,
  rinaUrl: state.buc.rinaUrl,
})

export const BUCIndex = (): JSX.Element => {
  const {
    pesysContext, vedtakId, aktoerId, sakId, sakType, gettingSakType, rinaUrl
  }: BUCIndexSelector = useSelector<State, BUCIndexSelector>(mapState)
  const dispatch = useDispatch()

  const [_askSakType, _setAskSakType] = useState<boolean>(false)
  const isVedtaksKontekst = !!vedtakId && pesysContext === constants.VEDTAKSKONTEKST

  useEffect(() => {
    dispatch(loadAllEntries())
    if (!rinaUrl) {
      dispatch(getRinaUrl())
    }
  },[])

    useEffect(() => {
    if (aktoerId && sakId && sakType === undefined && !gettingSakType && !_askSakType) {
      dispatch(getSakType(sakId, aktoerId))
      _setAskSakType(true)
    }
  }, [aktoerId, dispatch, gettingSakType, sakId, sakType])

  return (
    isVedtaksKontekst ? <BUCIndexVedtaksKontekst/> : <BUCIndexBrukerKontekst/>
  )
}

export default BUCIndex
