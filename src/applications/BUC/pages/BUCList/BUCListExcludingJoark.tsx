import React, {useEffect, useState} from "react";
import {
  endBucsFetch,
  fetchBuc,
  fetchRinaBucsListForBrukerKontekst, startBucsFetch
} from "../../../../actions/buc";
import {useDispatch, useSelector} from "react-redux";
import {State} from "../../../../declarations/reducers";
import {Buc, BucListItem, Bucs, BucsInfo, JoarkBuc} from "../../../../declarations/buc";
import _ from "lodash";
import {bucFilter, bucSorter, pbuc02filter} from "../../components/BUCUtils/BUCUtils";
import {PersonAvdods} from "../../../../declarations/person";
import {BUCMode, PesysContext} from "../../../../declarations/app";
import BUCLenkeCard from "./BUCLenkeCard";

export interface BUCListExcludingJoarkProps {
  setMode: (mode: BUCMode, s: string, callback?: any, content ?: JSX.Element) => void
  setShowWarningFilteredBucs: (b:boolean) => void
  setShowWarningNoBucs: (b:boolean) => void
}

export interface BUCListExcludingJoarkSelector {
  aktoerId: string | null | undefined
  sakId: string | null | undefined
  bucsListJoark: Array<JoarkBuc> | null | undefined
  bucs: Bucs | undefined
  bucsList: Array<BucListItem> | null | undefined
  gettingBucsList: boolean
  gettingBucs: boolean
  pesysContext: PesysContext | undefined
  personAvdods: PersonAvdods | undefined
  bucsInfo: BucsInfo | undefined
  newlyCreatedBuc: Buc | undefined
}

const mapState = (state: State): BUCListExcludingJoarkSelector => ({
  aktoerId: state.app.params.aktoerId,
  sakId: state.app.params.sakId,
  bucsListJoark: state.buc.bucsListJoark,
  bucs: state.buc.bucs,
  bucsList: state.buc.bucsList,
  gettingBucsList: state.loading.gettingBucsList,
  gettingBucs: state.loading.gettingBucs,
  pesysContext: state.app.pesysContext,
  personAvdods: state.person.personAvdods,
  bucsInfo: state.buc.bucsInfo,
  newlyCreatedBuc: state.buc.newlyCreatedBuc,
})

const BUCListExcludingJoark: React.FC<BUCListExcludingJoarkProps> = ({
  setMode, setShowWarningFilteredBucs, setShowWarningNoBucs
}: BUCListExcludingJoarkProps): JSX.Element => {

  const {
    aktoerId, sakId, bucsListJoark, bucs, gettingBucs, bucsList, gettingBucsList, pesysContext, personAvdods, bucsInfo, newlyCreatedBuc
  }: BUCListExcludingJoarkSelector = useSelector<State, BUCListExcludingJoarkSelector>(mapState)

  const dispatch = useDispatch()

  const [_filteredBucsExJoark, _setFilteredBucsExJoark] = useState<Array<Buc> | undefined>(undefined)
  const [_pBuc02filteredBucsExJoark, _setPBuc02filteredBucsExJoark] = useState<Array<Buc> | undefined>(undefined)
  const [_sortedBucsExJoark, _setSortedBucsExJoark] = useState<Array<Buc> | undefined>(undefined)

  // SORT BUCS FROM RINA AND NEW BUCS, FILTER OUT BUCS FROM THE JOARK LIST
  useEffect(() => {
    if (!_.isEmpty(bucs)) {
      const filteredBucs: Array<Buc> = Object.keys(bucs!).map(key => bucs![key]).filter(bucFilter)
      _setFilteredBucsExJoark(filteredBucs)
      const pBuc02filteredBucs = filteredBucs.filter(pbuc02filter(pesysContext, personAvdods))
      _setPBuc02filteredBucsExJoark(pBuc02filteredBucs)
      const sortedBucs = pBuc02filteredBucs.sort(bucSorter)
      const myBucs = sortedBucs.filter((b) => {
        return !bucsListJoark?.some((b2) => {
          return b.caseId === b2.caseId;
        });
      })
      _setSortedBucsExJoark(myBucs)
    }
    setShowWarningFilteredBucs(
      !_.isNil(_filteredBucsExJoark) &&
      !_.isNil(_pBuc02filteredBucsExJoark) &&
      _filteredBucsExJoark.length !== _pBuc02filteredBucsExJoark.length
    )
  }, [bucs])

  useEffect(() => {
    if (aktoerId && sakId && bucsList === undefined && !gettingBucsList && bucsListJoark!==undefined) {
      dispatch(fetchRinaBucsListForBrukerKontekst(aktoerId, sakId))
    }
  }, [aktoerId, sakId, gettingBucsList, bucsListJoark])

  useEffect(() => {
    if (aktoerId && sakId && _.isEmpty(bucs) && !_.isEmpty(bucsList)  && !gettingBucs) {
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
    if(!gettingBucs && bucsList && bucsList.length === 0){
      setShowWarningNoBucs(true)
    }
  }, [gettingBucs, bucsList])

  return (
    <>
      {_sortedBucsExJoark?.map((buc, index: number) => {
        return (<BUCLenkeCard buc={buc} bucsInfo={bucsInfo} newlyCreatedBuc={newlyCreatedBuc} setMode={setMode} index={index}/>)
      })}

    </>
  )
}

export default BUCListExcludingJoark
