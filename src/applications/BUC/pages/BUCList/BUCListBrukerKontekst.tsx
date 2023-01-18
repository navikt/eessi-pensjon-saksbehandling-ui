import {Alert, BodyLong, Button, Heading} from "@navikt/ds-react";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {BUCMode, PesysContext} from "declarations/app.d";
import React, {useState} from "react";
import {State} from "declarations/reducers";
import {BucListItem, Bucs, JoarkBuc, SakTypeMap, SakTypeValue} from 'declarations/buc.d';
import BUCFooter from "../../components/BUCFooter/BUCFooter";
import BUCStart from "../../components/BUCStart/BUCStart";
import _ from "lodash";
import { VerticalSeparatorDiv} from "@navikt/hoykontrast";
import {PersonAvdods} from "declarations/person.d";
import {buttonLogger} from "metrics/loggers";
import classNames from "classnames";
import {HorizontalLineSeparator} from "components/StyledComponents";
import {
  BUCListDiv,
  BUCListHeader,
  BUCNewDiv,
  BUCStartDiv,
  BadBucDiv, ProgressBarDiv
} from "../../CommonBucComponents";
import AvdodFnrSearch from "./AvdodFnrSearch";
import BUCListJoark from "./BUCListJoark";
import BUCListExcludingJoark from "./BUCListExcludingJoark";
import ProgressBar from "@navikt/fremdriftslinje";

export interface BUCListProps {
  initialBucNew?: boolean
  setMode: (mode: BUCMode, s: string, callback?: any, content ?: JSX.Element) => void
}

export interface BUCListBrukerKontekstSelector {
  aktoerId: string | null | undefined
  sakId: string | null | undefined
  pesysContext: PesysContext | undefined
  bucsListJoark: Array<JoarkBuc> | null | undefined
  gettingBuc: boolean
  personAvdods: PersonAvdods | undefined,
  bucs: Bucs | undefined
  bucsList: Array<BucListItem> | null | undefined
  gettingBucsList: boolean
  gettingBucs: boolean
  sakType: SakTypeValue | null | undefined
}

const mapState = (state: State): BUCListBrukerKontekstSelector => ({
  aktoerId: state.app.params.aktoerId,
  sakId: state.app.params.sakId,
  pesysContext: state.app.pesysContext,
  bucsListJoark: state.buc.bucsListJoark,
  gettingBuc: state.loading.gettingBuc,
  personAvdods: state.person.personAvdods,
  bucs: state.buc.bucs,
  bucsList: state.buc.bucsList,
  gettingBucsList: state.loading.gettingBucsList,
  gettingBucs: state.loading.gettingBucs,
  sakType: state.app.params.sakType as SakTypeValue
})

const BUCListBrukerKontekst: React.FC<BUCListProps> = ({
  setMode, initialBucNew = undefined
}: BUCListProps): JSX.Element => {

  const {
    aktoerId, bucsListJoark, bucs, sakType, gettingBucs, bucsList, gettingBucsList
  }: BUCListBrukerKontekstSelector = useSelector<State, BUCListBrukerKontekstSelector>(mapState)

  const { t } = useTranslation()

  const [_newBucPanelOpen, setNewBucPanelOpen] = useState<boolean | undefined>(initialBucNew)
  const [_showWarningFilteredBucs, setShowWarningFilteredBucs] = useState<boolean>(false)
  const [_showWarningNoBucs, setShowWarningNoBucs] = useState<boolean>(false)

  const onBUCNew = (e: React.MouseEvent<HTMLButtonElement>): void => {
    buttonLogger(e)
    setNewBucPanelOpen(true)
  }
  const showAvdodFnrSearch = (!_.isEmpty(bucs) || !_.isEmpty(bucsListJoark)) && (sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP)

  const status = !_.isEmpty(bucsList) && Object.keys(bucs!).length === bucsList?.length ? 'done' : 'inprogress'
  const now = _.isEmpty(bucsList) ? 20 : 20 + Math.floor(Object.keys(bucs!).length / (bucsList?.length ?? 1) * 80)

  return (
    <BUCListDiv>
      <BUCListHeader>
        <Heading size='small'>
          {t('buc:form-buclist')}
        </Heading>
        <ProgressBarDiv>
          {(gettingBucsList || gettingBucs) && (
            <ProgressBar
              status={status}
              now={now}
            >
              <BodyLong>
                {t(_.isEmpty(bucsList) ? 'message:loading-bucListX' : 'message:loading-bucsX', { x: now })}
              </BodyLong>
            </ProgressBar>
          )}
        </ProgressBarDiv>
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

      {_showWarningNoBucs &&
        <>
          <VerticalSeparatorDiv size='2' />
          <BodyLong>
           {t('message:warning-noBucs')}
          </BodyLong>
        </>
      }

      {_showWarningFilteredBucs &&
        <>
          <VerticalSeparatorDiv />
            <BadBucDiv>
              <Alert variant='warning'>
                {t('message:warning-filteredBucs')}
              </Alert>
            </BadBucDiv>
          <VerticalSeparatorDiv />
        </>
      }

      <BUCListExcludingJoark setMode={setMode} setShowWarningFilteredBucs={setShowWarningFilteredBucs} setShowWarningNoBucs={setShowWarningNoBucs}/>
      <BUCListJoark setMode={setMode} setShowWarningFilteredBucs={setShowWarningFilteredBucs} setShowWarningNoBucs={setShowWarningNoBucs}/>

      {showAvdodFnrSearch &&
        <AvdodFnrSearch setNewBucPanelOpen={setNewBucPanelOpen}/>
      }

      <BUCFooter />
    </BUCListDiv>
  )
}

export default BUCListBrukerKontekst
