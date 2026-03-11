import {PesysContext, RinaUrl} from 'src/declarations/app.d'
import { State } from 'src/declarations/reducers'
import {useDispatch, useSelector} from 'react-redux'
import BUCIndexPage from "./BUCIndexPage";
import BUCEmpty from "./pages/BUCEmpty/BUCEmpty";
import {JSX, useEffect, useState} from "react";
import {fetchBucsInfo, getRinaUrl, getSakType} from "../../actions/buc";
import {BucsInfo, SakTypeValue} from "../../declarations/buc";
import {loadAllEntries} from "../../actions/localStorage";
import _ from "lodash";
import * as storage from "../../constants/storage";

export interface BUCIndexSelector {
  pesysContext: PesysContext | undefined
  aktoerId: string | null | undefined
  vedtakId: string | null | undefined
  sakId: string | null | undefined
  sakType: SakTypeValue | null | undefined
  gettingSakType: boolean,
  rinaUrl: RinaUrl | undefined
  bucsInfo: BucsInfo | undefined
  bucsInfoList: Array<string> | undefined
  gettingBucsInfo: boolean
}

const mapState = (state: State): BUCIndexSelector => ({
  pesysContext: state.app.pesysContext,
  sakId: state.app.params.sakId,
  sakType: state.app.params.sakType as SakTypeValue,
  vedtakId: state.app.params.vedtakId,
  aktoerId: state.app.params.aktoerId,
  gettingSakType: state.loading.gettingSakType,
  rinaUrl: state.buc.rinaUrl,
  bucsInfo: state.buc.bucsInfo,
  bucsInfoList: state.buc.bucsInfoList,
  gettingBucsInfo: state.loading.gettingBucsInfo
})

const BUCIndex = (): JSX.Element => {
  const {
    aktoerId, sakId, sakType, gettingSakType, rinaUrl, bucsInfo, bucsInfoList, gettingBucsInfo
  }: BUCIndexSelector = useSelector<State, BUCIndexSelector>(mapState)
  const dispatch = useDispatch()

  const [_askSakType, _setAskSakType] = useState<boolean>(false)

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

  useEffect(() => {
    if (!_.isEmpty(bucsInfoList) && aktoerId && bucsInfo === undefined && !gettingBucsInfo &&
      bucsInfoList!.indexOf(aktoerId + '___' + storage.NAMESPACE_BUC + '___' + storage.FILE_BUCINFO) >= 0) {
      dispatch(fetchBucsInfo(aktoerId, storage.NAMESPACE_BUC, storage.FILE_BUCINFO))
    }
  }, [aktoerId, bucsInfo, bucsInfoList, dispatch, gettingBucsInfo])

  if (!sakId || !aktoerId) {
    return (
      <BUCEmpty
        aktoerId={aktoerId}
        sakId={sakId}
      />
    )
  }

  return (
    <BUCIndexPage/>
  )
}

export default BUCIndex
