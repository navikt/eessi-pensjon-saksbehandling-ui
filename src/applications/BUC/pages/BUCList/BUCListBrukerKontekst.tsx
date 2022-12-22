import {Alert, Button, Heading} from "@navikt/ds-react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {BUCMode, PesysContext} from "../../../../declarations/app";
import React, {useEffect, useState} from "react";
import {
  fetchBuc,
  fetchBucsInfo,
  fetchBucsInfoList,
  fetchJoarkBucsListForBrukerKontekst,
  setCurrentBuc
} from "../../../../actions/buc";
import {State} from "../../../../declarations/reducers";
import {Buc, BucInfo, Bucs, BucsInfo, JoarkBuc} from "../../../../declarations/buc";
import BUCHeader from "../../components/BUCHeader/BUCHeader";
import _ from "lodash";
import {bucFilter, bucSorter, pbuc02filter} from "../../components/BUCUtils/BUCUtils";
import {VerticalSeparatorDiv} from "@navikt/hoykontrast";
import {PersonAvdods} from "../../../../declarations/person";
import * as storage from "../../../../constants/storage";
import {buttonLogger} from "../../../../metrics/loggers";
import classNames from "classnames";
import {HorizontalLineSeparator} from "../../../../components/StyledComponents";
import BUCStart from "../../components/BUCStart/BUCStart";
import {BadBucDiv, BucLenkePanel, BUCListDiv, BUCListHeader, BUCNewDiv, BUCStartDiv} from "../../CommonBucComponents";


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
  gettingBuc: boolean
  personAvdods: PersonAvdods | undefined,
  bucs: Bucs | undefined
  newlyCreatedBuc: Buc | undefined
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
  gettingBuc: state.loading.gettingBuc,
  personAvdods: state.person.personAvdods,
  bucs: state.buc.bucs,
  newlyCreatedBuc: state.buc.newlyCreatedBuc,
})
const BUCListBrukerKontekst: React.FC<BUCListProps> = ({
  setMode, initialBucNew = undefined
}: BUCListProps): JSX.Element => {

  const {
    aktoerId, sakId, pesysContext, bucsListJoark, gettingBucsListJoark, bucsInfo, bucsInfoList, gettingBucsInfo,
    personAvdods, bucs, newlyCreatedBuc
  }: BUCListBrukerKontekstSelector = useSelector<State, BUCListBrukerKontekstSelector>(mapState)

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [_sortedBucs, _setSortedBucs] = useState<Array<JoarkBuc> | undefined>(undefined)
  const [_filteredBucs, _setFilteredBucs] = useState<Array<JoarkBuc> | undefined>(undefined)
  const [_pBuc02filteredBucs, _setPBuc02filteredBucs] = useState<Array<JoarkBuc> | undefined>(undefined)
  const [_filteredBucsExJoark, _setFilteredBucsExJoark] = useState<Array<Buc> | undefined>(undefined)
  const [_pBuc02filteredBucsExJoark, _setPBuc02filteredBucsExJoark] = useState<Array<Buc> | undefined>(undefined)
  const [_sortedBucsExJoark, _setSortedBucsExJoark] = useState<Array<Buc> | undefined>(undefined)
  const [_newBucPanelOpen, setNewBucPanelOpen] = useState<boolean | undefined>(initialBucNew)


  useEffect(() => {
    if (aktoerId && sakId && bucsListJoark === undefined && !gettingBucsListJoark) {
      dispatch(fetchJoarkBucsListForBrukerKontekst(aktoerId, sakId))
      dispatch(fetchBucsInfoList(aktoerId))
    }
  }, [aktoerId, gettingBucsListJoark, pesysContext, sakId])

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
  }, [bucsListJoark])

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
  }, [bucs])

  useEffect(() => {
    if (!_.isEmpty(bucsInfoList) && aktoerId && bucsInfo === undefined && !gettingBucsInfo &&
      bucsInfoList!.indexOf(aktoerId + '___' + storage.NAMESPACE_BUC + '___' + storage.FILE_BUCINFO) >= 0) {
      dispatch(fetchBucsInfo(aktoerId, storage.NAMESPACE_BUC, storage.FILE_BUCINFO))
    }
  }, [aktoerId, bucsInfo, bucsInfoList, dispatch, gettingBucsInfo])

  const onBUCEdit = (buc: JoarkBuc | Buc): void => {
    dispatch(setCurrentBuc(buc.caseId!))
    if (bucs && buc.caseId && !bucs[buc.caseId!]) {
      dispatch(fetchBuc(buc.caseId))
    }
    setMode('bucedit' as BUCMode, 'forward')
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  const onBUCNew = (e: React.MouseEvent<HTMLButtonElement>): void => {
    buttonLogger(e)
    setNewBucPanelOpen(true)
  }

  const BucLenkeCard: React.FC<any> = (props: any): JSX.Element => {
    const {buc, index} = props;
    const bucId: string = buc.caseId!
    const bucInfo: BucInfo = bucsInfo && bucsInfo.bucs && bucsInfo.bucs[bucId] ? bucsInfo.bucs[bucId] : {} as BucInfo
    return (
      <BucLenkePanel
        href='#'
        border
        data-testid={'a-buc-p-buclist--buc-' + buc.caseId}
        key={index}
        className={classNames({ new: (newlyCreatedBuc && buc.caseId === newlyCreatedBuc.caseId) || false })}
        style={{ animationDelay: (0.1 * index) + 's' }}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault()
          e.stopPropagation()
          onBUCEdit(buc)
        }}
      >
        <BUCHeader
          buc={buc}
          bucInfo={bucInfo}
        />
      </BucLenkePanel>
    )
  }

  return (
    <BUCListDiv>
      <BUCListHeader>
        <Heading size='small'>
          {t('buc:form-buclist')}
        </Heading>
        {!_newBucPanelOpen && (
          <Button
            variant='secondary'
            data-amplitude='buc.list.newbuc'
            data-testid='a-buc-p-buclist--newbuc-button-id'
            onClick={onBUCNew}
          >
            {t('buc:form-createNewCase')}
          </Button>
        )}
      </BUCListHeader>
      <VerticalSeparatorDiv />
      <BUCStartDiv className={classNames({
        open: _newBucPanelOpen === true,
        close: _newBucPanelOpen === false
      })}
      >
        <BUCNewDiv border>
          <Heading size='medium'>
            {t('buc:step-startBUCTitle')}
          </Heading>
          <HorizontalLineSeparator />
          <BUCStart
            aktoerId={aktoerId}
            onBucCreated={() => {
              setNewBucPanelOpen(false)
              setMode('sednew', 'forward')
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
              })
            }}
            onBucCancelled={() => setNewBucPanelOpen(false)}
          />
        </BUCNewDiv>
        <VerticalSeparatorDiv />
      </BUCStartDiv>
      <VerticalSeparatorDiv />

      {((!_.isNil(_filteredBucs) && !_.isNil(_pBuc02filteredBucs) && _filteredBucs.length !== _pBuc02filteredBucs.length) ||
        (!_.isNil(_filteredBucsExJoark) && !_.isNil(_pBuc02filteredBucsExJoark) && _filteredBucsExJoark.length !== _pBuc02filteredBucsExJoark.length)) && (
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

      {_sortedBucsExJoark?.map((buc, index: number) => {
        return (<BucLenkeCard buc={buc} index={index}/>)
      })}

      {_sortedBucs?.map((buc, index: number) => {
        return (<BucLenkeCard buc={buc} index={index}/>)
      })}
    </BUCListDiv>
  )
}

export default BUCListBrukerKontekst
