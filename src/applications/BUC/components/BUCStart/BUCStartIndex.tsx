import {AllowedLocaleString, FeatureToggles, Loading, Option, PesysContext} from 'src/declarations/app.d';
import React, {JSX} from "react";
import BUCStart from "./BUCStart";
import {State} from "src/declarations/reducers";
import {useSelector} from "react-redux";
import {GJENNY} from "src/constants/constants";
import {
  Buc,
  BUCOptions,
  Bucs,
  BucsInfo,
  SakTypeValue,
  SubjectAreaRawList,
  TagRawList
} from "src/declarations/buc";
import {PersonAvdods, PersonPDL} from "src/declarations/person";
import BUCStartGjenny from "./BUCStartGjenny";

export interface BUCStartIndexProps {
  aktoerId: string | null | undefined
  initialCreatingBucInfo?: boolean
  initialIsCreatingBuc?: boolean
  onBucChanged?: (option: Option) => void
  onBucCreated: () => void
  onBucCancelled: () => void
}

export interface BUCStartSelector {
  bucOptions?: BUCOptions | undefined
  bucParam: string | null | undefined
  bucs: Bucs | undefined
  bucsInfo?: BucsInfo | undefined
  currentBuc: string | undefined
  featureToggles: FeatureToggles
  kravDato: string | null | undefined
  kravId: string | null | undefined
  loading: Loading
  locale: AllowedLocaleString
  newlyCreatedBuc: Buc | undefined
  personPdl: PersonPDL | undefined
  personAvdods: PersonAvdods | undefined
  pesysContext: PesysContext | undefined
  sakId: string | null | undefined
  sakType: SakTypeValue | null | undefined
  subjectAreaList?: SubjectAreaRawList | undefined
  tagList?: TagRawList | undefined
}

export const mapBUCStartState = (state: State): BUCStartSelector => ({
  bucOptions: state.buc.bucOptions,
  bucParam: state.app.params.buc,
  bucs: state.buc.bucs,
  bucsInfo: state.buc.bucsInfo,
  currentBuc: state.buc.currentBuc,
  featureToggles: state.app.featureToggles,
  kravDato: state.buc.kravDato,
  kravId: state.app.params.kravId,
  loading: state.loading,
  locale: state.ui.locale,
  newlyCreatedBuc: state.buc.newlyCreatedBuc,
  personPdl: state.person.personPdl,
  personAvdods: state.person.personAvdods,
  pesysContext: state.app.pesysContext,
  sakId: state.app.params.sakId,
  sakType: state.app.params.sakType as SakTypeValue | undefined,
  subjectAreaList: state.buc.subjectAreaList,
  tagList: state.buc.tagList
})

export interface BUCStartIndexSelector {
  pesysContext: PesysContext | undefined
}

const mapState = (state: State): BUCStartIndexSelector => ({
  pesysContext: state.app.pesysContext,
})


const BUCStartIndex: React.FC<BUCStartIndexProps> = ({
 aktoerId,
 initialIsCreatingBuc = false,
 initialCreatingBucInfo = false,
 onBucChanged,
 onBucCreated,
 onBucCancelled
}: BUCStartIndexProps): JSX.Element | null => {
  const {pesysContext}: BUCStartIndexSelector = useSelector<State, BUCStartIndexSelector>(mapState)

  return(
    pesysContext === GJENNY ?
      <BUCStartGjenny
        aktoerId={aktoerId}
        onBucCreated={onBucCreated}
        onBucCancelled={onBucCancelled}
        onBucChanged={onBucChanged}
        initialCreatingBucInfo={initialCreatingBucInfo}
        initialIsCreatingBuc={initialIsCreatingBuc}
      />
      :
      <BUCStart
        aktoerId={aktoerId}
        onBucCreated={onBucCreated}
        onBucCancelled={onBucCancelled}
        onBucChanged={onBucChanged}
        initialCreatingBucInfo={initialCreatingBucInfo}
        initialIsCreatingBuc={initialIsCreatingBuc}
      />
  )
}

export default BUCStartIndex
