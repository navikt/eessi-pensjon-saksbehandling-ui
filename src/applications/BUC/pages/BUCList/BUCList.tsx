import {
  resetATP,
  setCurrentBuc
} from 'src/actions/buc'
import BUCFooter from 'src/applications/BUC/components/BUCFooter/BUCFooter'
import BUCHeader from 'src/applications/BUC/components/BUCHeader/BUCHeader'
import BUCStartIndex from 'src/applications/BUC/components/BUCStart/BUCStartIndex'
import { bucFilter, bucSorter, pbuc02filter } from 'src/applications/BUC/components/BUCUtils/BUCUtils'
import classNames from 'classnames'
import { HorizontalLineSeparator } from 'src/components/StyledComponents'
import {AllowedLocaleString, BUCMode, FeatureToggles, PesysContext} from 'src/declarations/app.d'
import {
  Buc,
  BucInfo,
  BucListItem,
  Bucs,
  BucsInfo, Institution,
  SakTypeMap,
  SakTypeValue
} from 'src/declarations/buc.d'
import { PersonAvdods } from 'src/declarations/person.d'
import { State } from 'src/declarations/reducers'
import _ from 'lodash'
import { buttonLogger, standardLogger, timeDiffLogger, timeLogger } from 'src/metrics/loggers'
import {Alert, BodyLong, Heading, Button, Box, Spacer} from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  BadBucDiv,
  BucLenkePanel,
  BUCListDiv,
  BUCListHeader,
  BUCStartDiv,
  ProgressBarDiv
} from "../../CommonBucComponents";
import {BRUKERKONTEKST} from "src/constants/constants";
import AvdodFnrSearch from "./AvdodFnrSearch";
import ProgressBar from "src/components/ProgressBar/ProgressBar";
import P5000FraATP from "src/applications/P5000FraATP/P5000FraATP";
import {IS_Q} from "src/constants/environment";

export interface BUCListProps {
  initialBucNew?: boolean
  setMode: (mode: BUCMode, s: string, callback?: any, content ?: JSX.Element) => void
}

export interface BUCListSelector {
  aktoerId: string | null | undefined
  bucs: Bucs | undefined
  bucsList: Array<BucListItem> | null | undefined
  bucsInfo: BucsInfo | undefined
  gettingBucsList: boolean
  gettingBucs: boolean
  locale: AllowedLocaleString
  newlyCreatedBuc: Buc | undefined
  personAvdods: PersonAvdods | undefined
  pesysContext: PesysContext | undefined
  sakType: SakTypeValue | null | undefined
  featureToggles: FeatureToggles
}

const mapState = (state: State): BUCListSelector => ({
  aktoerId: state.app.params.aktoerId,
  bucs: state.buc.bucs,
  bucsList: state.buc.bucsList,
  bucsInfo: state.buc.bucsInfo,
  gettingBucs: state.loading.gettingBucs,
  gettingBucsList: state.loading.gettingBucsList,
  locale: state.ui.locale,
  newlyCreatedBuc: state.buc.newlyCreatedBuc,
  personAvdods: state.person.personAvdods,
  pesysContext: state.app.pesysContext,
  sakType: state.app.params.sakType as SakTypeValue,
  featureToggles: state.app.featureToggles
})

const BUCList: React.FC<BUCListProps> = ({
  setMode, initialBucNew = undefined
}: BUCListProps): JSX.Element => {
  const {
    aktoerId, bucs, bucsList, bucsInfo, gettingBucs, gettingBucsList, newlyCreatedBuc, personAvdods, pesysContext, sakType, featureToggles
  } = useSelector<State, BUCListSelector>(mapState)

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [_loggedTime] = useState<Date>(new Date())

  const [_mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)
  const [_newBucPanelOpen, setNewBucPanelOpen] = useState<boolean | undefined>(initialBucNew)
  const [_totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [_sortedBucs, _setSortedBucs] = useState<Array<Buc> | undefined>(undefined)
  const [_filteredBucs, _setFilteredBucs] = useState<Array<Buc> | undefined>(undefined)
  const [_pBuc02filteredBucs, _setPBuc02filteredBucs] = useState<Array<Buc> | undefined>(undefined)

  const [_bestillP5000FraATPPanelOpen, setBestillP5000FraATPPanelOpen] = useState<boolean | undefined>(false)
  const [_showBestillP5000FraATPButton, setShowBestillP5000FraATPButton] = useState<boolean>(false)

  const isTestUser: boolean = featureToggles.TEST_USER === true

  useEffect(() => {
    standardLogger('buc.list.entrance')
    return () => {
      timeLogger('buc.list.view', _loggedTime)
      timeDiffLogger('buc.list.mouseover', _totalTimeWithMouseOver)
    }
  }, [_loggedTime])

  const onMouseEnter = () => setMouseEnterDate(new Date())

  const onMouseLeave = () => {
    if (_mouseEnterDate) {
      setTotalTimeWithMouseOver(_totalTimeWithMouseOver + (new Date().getTime() - _mouseEnterDate?.getTime()))
    }
  }

  const onBUCNew = (e: React.MouseEvent<HTMLButtonElement>): void => {
    buttonLogger(e)
    setBestillP5000FraATPPanelOpen(false)
    setNewBucPanelOpen(true)
  }

  const onBestillP5000FraATP = (e: React.MouseEvent<HTMLButtonElement>): void => {
    buttonLogger(e)
    dispatch(resetATP())
    setNewBucPanelOpen(false)
    setBestillP5000FraATPPanelOpen(true)
  }

  const onBUCEdit = (buc: Buc): void => {
    dispatch(setCurrentBuc(buc.caseId!))
    setMode('bucedit' as BUCMode, 'forward')
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    if (!_.isEmpty(bucs)) {
      const filteredBucs: Array<Buc> = Object.keys(bucs!).map(key => bucs![key]).filter(bucFilter)
      _setFilteredBucs(filteredBucs)
      const pBuc02filteredBucs = filteredBucs.filter(pbuc02filter(pesysContext, personAvdods))
      _setPBuc02filteredBucs(pBuc02filteredBucs)
      const sortedBucs = pBuc02filteredBucs.sort(bucSorter)
      _setSortedBucs(sortedBucs)

      const kravBucs: Array<Buc> = sortedBucs.filter((b: Buc) => (b.type === 'P_BUC_01' || b.type === 'P_BUC_02' || b.type === 'P_BUC_03'))
      const kravBucsWithDenmark: Array<Buc> = kravBucs.filter((b: Buc) => {
        return b.deltakere && b.deltakere.filter((i: Institution) => {
          return IS_Q ? i.institution === "NO:NAVAT05" : i.country === "DK"
        }).length > 0
      })
      kravBucsWithDenmark.length > 0 ? setShowBestillP5000FraATPButton(true) : setShowBestillP5000FraATPButton(false)
    }
  }, [bucs])

  const status = !_.isEmpty(bucsList) && Object.keys(bucs!).length === bucsList?.length ? 'done' : 'inprogress'
  const now = _.isEmpty(bucsList) ? 20 : 20 + Math.floor(Object.keys(bucs!).length / (bucsList?.length ?? 1) * 80)

  return (
    <BUCListDiv
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >

      <Box paddingBlock="0 4">
        <BUCListHeader gap="4" align={"center"}>
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
          <Spacer/>
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
          {isTestUser && !_bestillP5000FraATPPanelOpen && _showBestillP5000FraATPButton &&
            <Button
              variant='secondary'
              data-amplitude='buc.list.newbuc'
              data-testid='a-buc-p-buclist--newbuc-button-id'
              onClick={onBestillP5000FraATP}
            >
              Bestill P50000 fra ATP
            </Button>
          }
        </BUCListHeader>
      </Box>
      <BUCStartDiv className={classNames({
        open: _newBucPanelOpen === true,
        close: _newBucPanelOpen === false
      })}
      >
        <Box padding="8"  background="bg-default" borderWidth="1" borderColor="border-default">
          <Heading size='medium'>
            {t('buc:step-startBUCTitle')}
          </Heading>
          <HorizontalLineSeparator />
          <BUCStartIndex
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
        </Box>
      </BUCStartDiv>
      <BUCStartDiv className={classNames({
        open: _bestillP5000FraATPPanelOpen === true,
        close: _bestillP5000FraATPPanelOpen === false
      })}
      >
        <Box padding="8"  background="bg-default" borderWidth="1" borderColor="border-default">
          <P5000FraATP
            onCancel={() => setBestillP5000FraATPPanelOpen(false)}
            setMode={setMode}
          />
        </Box>
      </BUCStartDiv>
      <Box paddingBlock="4 0">
        {!gettingBucs && _.isEmpty(bucsList) && (
          <Box paddingBlock="4 4">
            <BodyLong>
              {t('message:warning-noBucs')}
            </BodyLong>
          </Box>
        )}
        {!_.isNil(_filteredBucs) && !_.isNil(_pBuc02filteredBucs) && _filteredBucs.length !== _pBuc02filteredBucs.length && (
          <BadBucDiv>
            <Alert variant='warning'>
              {t('message:warning-filteredBucs')}
            </Alert>
          </BadBucDiv>
        )}
      </Box>
      {!_.isNil(_sortedBucs) && !_.isEmpty(_sortedBucs) &&
          _sortedBucs.map((buc: Buc, index: number) => {
            if (buc?.error) {
              return null
            }
            const bucId: string = buc.caseId!
            const bucInfo: BucInfo = bucsInfo && bucsInfo.bucs && bucsInfo.bucs[bucId] ? bucsInfo.bucs[bucId] : {} as BucInfo
            return (
              <BucLenkePanel
                href='#'
                border
                data-testid={'a-buc-p-buclist--buc-' + bucId}
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
          })}
      {!_.isEmpty(bucs) && pesysContext === BRUKERKONTEKST && (sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP) && (
        <AvdodFnrSearch/>
      )}
      <BUCFooter />
    </BUCListDiv>
  )
}

export default BUCList
