import {Alert, Heading} from "@navikt/ds-react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import styled from "styled-components/macro";
import {BUCMode, PesysContext} from "../../../../declarations/app";
import {useEffect, useState} from "react";
import {fetchBucsInfo, fetchBucsInfoList, fetchJoarkBucsListForBrukerKontekst} from "../../../../actions/buc";
import {State} from "../../../../declarations/reducers";
import {BadBucDiv, BucLenkePanel} from "./BUCListBrukerKontekst_V1";
import {BucInfo, BucsInfo, JoarkBuc} from "../../../../declarations/buc";
import BUCHeader from "../../components/BUCHeader/BUCHeader";
import _ from "lodash";
import {bucFilter, bucSorter, pbuc02filter} from "../../components/BUCUtils/BUCUtils";
import {VerticalSeparatorDiv} from "@navikt/hoykontrast";
import {PersonAvdods} from "../../../../declarations/person";
import * as storage from "../../../../constants/storage";

export const BUCListDiv = styled.div``
const BUCListHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
`

export interface BUCListProps {
  initialBucNew?: boolean
  setMode: (mode: BUCMode, s: string, callback?: any, content ?: JSX.Element) => void
}

export interface BUCListBrukerKontekstSelector {
  aktoerId: string | null | undefined
  sakId: string | null | undefined
  pesysContext: PesysContext | undefined
  bucsListJoark: Array<JoarkBuc> | null | undefined
  gettingBucsListJoark: boolean
  bucsInfo: BucsInfo | undefined
  bucsInfoList: Array<string> | undefined
  gettingBucsInfo: boolean
  personAvdods: PersonAvdods | undefined
}

const mapState = (state: State): BUCListBrukerKontekstSelector => ({
  aktoerId: state.app.params.aktoerId,
  sakId: state.app.params.sakId,
  pesysContext: state.app.pesysContext,
  bucsListJoark: state.buc.bucsListJoark,
  gettingBucsListJoark: state.loading.gettingBucsListJoark,
  bucsInfo: state.buc.bucsInfo,
  bucsInfoList: state.buc.bucsInfoList,
  gettingBucsInfo: state.loading.gettingBucsInfo,
  personAvdods: state.person.personAvdods
})
const BUCListBrukerKontekst: React.FC<BUCListProps> = ({
  //setMode, initialBucNew = undefined
}: BUCListProps): JSX.Element => {

  const {
    aktoerId, sakId, pesysContext, bucsListJoark, gettingBucsListJoark, bucsInfo, bucsInfoList, gettingBucsInfo, personAvdods,
  }: BUCListBrukerKontekstSelector = useSelector<State, BUCListBrukerKontekstSelector>(mapState)

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [_sortedBucs, _setSortedBucs] = useState<Array<JoarkBuc> | undefined>(undefined)
  const [_filteredBucs, _setFilteredBucs] = useState<Array<JoarkBuc> | undefined>(undefined)
  const [_pBuc02filteredBucs, _setPBuc02filteredBucs] = useState<Array<JoarkBuc> | undefined>(undefined)


  useEffect(() => {
    if (aktoerId && sakId && bucsListJoark === undefined && !gettingBucsListJoark) {
      dispatch(fetchJoarkBucsListForBrukerKontekst(aktoerId, sakId))
      dispatch(fetchBucsInfoList(aktoerId))
    }
  }, [aktoerId, gettingBucsListJoark, pesysContext, sakId])

  useEffect(() => {
    if (!_.isEmpty(bucsListJoark)) {
      const filteredBucs: Array<JoarkBuc> = bucsListJoark!.filter(bucFilter)
      _setFilteredBucs(filteredBucs)
      const pBuc02filteredBucs = filteredBucs.filter(pbuc02filter(pesysContext, personAvdods))
      _setPBuc02filteredBucs(pBuc02filteredBucs)
      const sortedBucs = pBuc02filteredBucs.sort(bucSorter)
      _setSortedBucs(sortedBucs)
    }
  }, [bucsListJoark])

  useEffect(() => {
    if (!_.isEmpty(bucsInfoList) && aktoerId && bucsInfo === undefined && !gettingBucsInfo &&
      bucsInfoList!.indexOf(aktoerId + '___' + storage.NAMESPACE_BUC + '___' + storage.FILE_BUCINFO) >= 0) {
      dispatch(fetchBucsInfo(aktoerId, storage.NAMESPACE_BUC, storage.FILE_BUCINFO))
    }
  }, [aktoerId, bucsInfo, bucsInfoList, dispatch, gettingBucsInfo])

  return (
    <BUCListDiv>
      <BUCListHeader>
        <Heading size='small'>
          {t('buc:form-buclist')}
        </Heading>
      </BUCListHeader>
      {!_.isNil(_filteredBucs) && !_.isNil(_pBuc02filteredBucs) && _filteredBucs.length !== _pBuc02filteredBucs.length && (
        <>
          <VerticalSeparatorDiv />
          <BadBucDiv>
            <Alert variant='warning'>
              {t('message:warning-filteredBucs')}
            </Alert>
          </BadBucDiv>
          <VerticalSeparatorDiv />
        </>
      )}
      {_sortedBucs?.map((buc, index: number) => {
        const bucId: string = buc.caseId!
        const bucInfo: BucInfo = bucsInfo && bucsInfo.bucs && bucsInfo.bucs[bucId] ? bucsInfo.bucs[bucId] : {} as BucInfo
        return (
          <BucLenkePanel
            href='#'
            border
            data-testid={'a-buc-p-buclist--buc-' + buc.caseId}
            key={index}
            style={{ animationDelay: (0.1 * index) + 's' }}
          >
            <BUCHeader
              buc={buc}
              bucInfo={bucInfo}
            />
          </BucLenkePanel>
        )
      })}
    </BUCListDiv>
  )
}

export default BUCListBrukerKontekst
