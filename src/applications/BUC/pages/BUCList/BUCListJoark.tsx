import React, {useEffect, useState} from "react";
import {fetchBucsInfoList, fetchJoarkBucsListForBrukerKontekst} from "../../../../actions/buc";
import {useDispatch, useSelector} from "react-redux";
import {State} from "../../../../declarations/reducers";
import {Buc, BucsInfo, JoarkBuc} from "../../../../declarations/buc";
import _ from "lodash";
import {bucFilter, bucSorter, pbuc02filter} from "../../components/BUCUtils/BUCUtils";
import {PersonAvdods} from "../../../../declarations/person";
import {BUCMode, PesysContext} from "../../../../declarations/app";
import BUCLenkeCard from "./BUCLenkeCard";
import WaitingPanel from "../../../../components/WaitingPanel/WaitingPanel";


export interface BUCListJoarkProps {
  setMode: (mode: BUCMode, s: string, callback?: any, content ?: JSX.Element) => void
  setShowWarningFilteredBucs: (b:boolean) => void
  setShowWarningNoBucs: (b:boolean) => void
}

export interface BUCListJoarkSelector {
  aktoerId: string | null | undefined
  sakId: string | null | undefined
  bucsListJoark: Array<JoarkBuc> | null | undefined
  gettingBucsListJoark: boolean
  pesysContext: PesysContext | undefined
  personAvdods: PersonAvdods | undefined
  bucsInfo: BucsInfo | undefined
  newlyCreatedBuc: Buc | undefined
}

const mapState = (state: State): BUCListJoarkSelector => ({
  aktoerId: state.app.params.aktoerId,
  sakId: state.app.params.sakId,
  bucsListJoark: state.buc.bucsListJoark,
  gettingBucsListJoark: state.loading.gettingBucsListJoark,
  pesysContext: state.app.pesysContext,
  personAvdods: state.person.personAvdods,
  bucsInfo: state.buc.bucsInfo,
  newlyCreatedBuc: state.buc.newlyCreatedBuc,
})

const BUCListJoark: React.FC<BUCListJoarkProps> = ({
  setMode, setShowWarningFilteredBucs, setShowWarningNoBucs
}: BUCListJoarkProps): JSX.Element => {

  const {
    aktoerId, sakId, bucsListJoark, gettingBucsListJoark, pesysContext, personAvdods, bucsInfo, newlyCreatedBuc
  }: BUCListJoarkSelector = useSelector<State, BUCListJoarkSelector>(mapState)
  const dispatch = useDispatch()

  const [_sortedBucs, _setSortedBucs] = useState<Array<JoarkBuc> | undefined>(undefined)
  const [_filteredBucs, _setFilteredBucs] = useState<Array<JoarkBuc> | undefined>(undefined)
  const [_pBuc02filteredBucs, _setPBuc02filteredBucs] = useState<Array<JoarkBuc> | undefined>(undefined)

  // SORT LIST FROM JOARK
  useEffect(() => {
    if (!_.isEmpty(bucsListJoark)) {
      const filteredBucs: Array<JoarkBuc> = bucsListJoark!.filter(bucFilter)
      _setFilteredBucs(filteredBucs)
      const pBuc02filteredBucs = filteredBucs.filter(pbuc02filter(pesysContext, personAvdods))
      _setPBuc02filteredBucs(pBuc02filteredBucs)
      const sortedBucs = pBuc02filteredBucs.sort(bucSorter)
      _setSortedBucs(sortedBucs)
    }

    setShowWarningFilteredBucs(
      !_.isNil(_filteredBucs) &&
      !_.isNil(_pBuc02filteredBucs) &&
      _filteredBucs.length !== _pBuc02filteredBucs.length
    )
  }, [bucsListJoark])

  useEffect(() => {
    if (aktoerId && sakId && bucsListJoark === undefined && !gettingBucsListJoark) {
      dispatch(fetchJoarkBucsListForBrukerKontekst(aktoerId, sakId))
      dispatch(fetchBucsInfoList(aktoerId))
    }
  }, [aktoerId, sakId, gettingBucsListJoark])

  useEffect(() => {
    if(!gettingBucsListJoark && bucsListJoark && bucsListJoark.length === 0){
      setShowWarningNoBucs(true)
    }
  }, [gettingBucsListJoark, bucsListJoark])
  return (
    <>
      {gettingBucsListJoark &&
        <WaitingPanel/>
      }
      {_sortedBucs?.map((buc, index: number) => {
        return (<BUCLenkeCard buc={buc} bucsInfo={bucsInfo} newlyCreatedBuc={newlyCreatedBuc} setMode={setMode} index={index}/>)
      })}
    </>
  )
}

export default BUCListJoark
