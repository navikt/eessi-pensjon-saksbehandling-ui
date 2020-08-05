import {
  fetchBucsInfo,
  fetchSingleBuc,
  getInstitutionsListForBucAndCountry,
  setCurrentBuc,
  setCurrentSed
} from 'actions/buc'
import BUCCrumbs from 'applications/BUC/components/BUCCrumbs/BUCCrumbs'
import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import BUCHeader from 'applications/BUC/components/BUCHeader/BUCHeader'
import BUCLoading from 'applications/BUC/components/BUCLoading/BUCLoading'
import BUCStart from 'applications/BUC/components/BUCStart/BUCStart'
import { bucFilter, bucSorter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDList from 'applications/BUC/components/SEDList/SEDList'
import { BUCMode } from 'applications/BUC/index'
import classNames from 'classnames'
import {
  HighContrastExpandingPanel,
  HighContrastKnapp, HighContrastLenkepanelBase,
  HighContrastPanel,
  VerticalSeparatorDiv
} from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import * as storage from 'constants/storage'
import {
  Buc,
  BucInfo,
  Bucs,
  BucsInfo,
  Institution,
  InstitutionListMap,
  Participant,
  RawInstitution,
  Sed
} from 'declarations/buc'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, FeatureToggles, Loading } from 'declarations/types'
import _ from 'lodash'
import { buttonLogger, standardLogger, timeDiffLogger, timeLogger } from 'metrics/loggers'
import Alertstripe from 'nav-frontend-alertstriper'
import { Element, Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi'
import { theme, themeKeys, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled, { keyframes, ThemeProvider } from 'styled-components'

export interface BUCListProps {
  initialBucNew?: boolean
  setMode: (mode: BUCMode, s: string, callback?: any) => void
}

export interface BUCListSelector {
  aktoerId: string
  bucs: Bucs | undefined
  bucsInfo: BucsInfo | undefined
  bucsInfoList: Array<string> | undefined
  featureToggles: FeatureToggles
  highContrast: boolean
  institutionList: InstitutionListMap<RawInstitution> | undefined
  loading: Loading
  locale: AllowedLocaleString
  newlyCreatedBuc: Buc | undefined
}

const mapState = (state: State): BUCListSelector => ({
  aktoerId: state.app.params.aktoerId,
  bucs: state.buc.bucs,
  bucsInfo: state.buc.bucsInfo,
  bucsInfoList: state.buc.bucsInfoList,
  featureToggles: state.app.featureToggles,
  highContrast: state.ui.highContrast,
  institutionList: state.buc.institutionList,
  loading: state.loading,
  locale: state.ui.locale,
  newlyCreatedBuc: state.buc.newlyCreatedBuc
})

type Country = {country: string, buc: string}
type CountryList = Array<Country>

const slideInFromLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`
const animationOpen = keyframes`
  0% {
    height: 0%;
    max-height: 0;
  }
  100% {
    max-height: 150em;
    height: 100%;
  }
`
const animationClose = keyframes`
  0% {
    max-height: 150em;
    height: 100%;
  }
  100% {
    max-height: 0;
    height: 0%;
  }
`

const BUCListDiv = styled.div``
const BUCListHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
`
const BadBucDiv = styled.div`
  width: 100%;
  padding: 0rem;
  .alertstripe--advarsel {
    border-width: ${({ theme }) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
    border-style: solid;
    border-color: ${({ theme }) => theme.navOransjeDarken20};
    background-color: ${({ theme }) => theme.navOransjeLighten80};
    color: ${({ theme }) => theme.type === 'themeHighContrast' ? theme.black : theme.navMorkGra};
    div {
      font-size: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
      line-height: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
    }
  }
  .alertstripe__tekst {
    max-width: 100% !important;
  }
`
const BucLenkePanel = styled(HighContrastLenkepanelBase)`
  transform: translateX(-20px);
  opacity: 0;
  animation: ${slideInFromLeft} 0.2s forwards;
  margin-bottom: 1rem;
  &.new {
    background: ${({ theme }) => theme.type === 'themeHighContrast' ? theme[themeKeys.NAVLIMEGRONNDARKEN80] : theme[themeKeys.NAVLIMEGRONNLIGHTEN80]};
  }
  &:hover {
    border-color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
    border-width: ${({ theme }) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
    border-style: solid;
    background: ${({ theme }) => theme[themeKeys.MAIN_HOVER_COLOR]};
  }
`
const BucExpandingPanel = styled(HighContrastExpandingPanel)`
  transform: translateX(-20px);
  opacity: 0;
  animation: ${slideInFromLeft} 0.2s forwards;
  margin-bottom: 1rem;
  &.new {
    background: ${({ theme }) => theme.type === 'themeHighContrast' ? theme[themeKeys.NAVLIMEGRONNDARKEN80] : theme[themeKeys.NAVLIMEGRONNLIGHTEN80]};
  }
`
const Flex4Div = styled.div`
  flex: 4;
  width: 100%;
`
const Flex3Div = styled.div`
  flex: 3;
  width: 100%;
`
const Flex2Div = styled.div`
  flex: 2;
  width: 100%;
`
const SEDHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid ${({ theme }) => theme[themeKeys.MAIN_BORDER_COLOR]};
`
const BUCNewDiv = styled(HighContrastPanel)`
  padding: 2rem !important;
`
const BUCStartDiv = styled.div`
  max-height: 0;
  height: 0%;
  overflow: hidden;
  &.close {
    will-change: max-height, height;
    max-height: 0;
    animation: ${animationClose} 400ms ease;
  }
  &.open {
    will-change: max-height, height;
    max-height: 40em;
    animation: ${animationOpen} 400ms ease;
  }
`

const BUCList: React.FC<BUCListProps> = ({ setMode, initialBucNew = undefined }: BUCListProps): JSX.Element => {
  const [mounted, setMounted] = useState<boolean>(false)
  const { aktoerId, bucs, bucsInfo, bucsInfoList, featureToggles, highContrast, institutionList, loading, newlyCreatedBuc } =
    useSelector<State, BUCListSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [loggedTime] = useState<Date>(new Date())
  const [newBucPanelOpen, setNewBucPanelOpen] = useState<boolean | undefined>(initialBucNew)
  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    standardLogger('buc.list.entrance')
    return () => {
      timeLogger('buc.list.view', loggedTime)
      timeDiffLogger('buc.list.mouseover', totalTimeWithMouseOver)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedTime])

  const onMouseEnter = () => setMouseEnterDate(new Date())

  const onMouseLeave = () => {
    if (mouseEnterDate) {
      setTotalTimeWithMouseOver(totalTimeWithMouseOver + (new Date().getTime() - mouseEnterDate?.getTime()))
    }
  }

  const onBUCNew = (e: React.MouseEvent): void => {
    buttonLogger(e)
    if (featureToggles.v2_ENABLED === true) {
      setNewBucPanelOpen(true)
    } else {
      setMode('bucnew' as BUCMode, 'none')
    }
  }

  const onSEDNew = (buc: Buc, sed: Sed): void => {
    if (buc) { dispatch(setCurrentBuc(buc ? buc.caseId! : undefined)) }
    dispatch(setCurrentSed(sed ? sed.id : undefined))
    setMode('sednew' as BUCMode, 'forward')
  }

  const onBucOpen = (bucId: string) => {
    getSeds(bucId)
  }

  const onBUCEdit = (buc: Buc) => {
    getSeds(buc.caseId!)
    dispatch(setCurrentBuc(buc.caseId!))
    setMode('bucedit' as BUCMode, 'forward')
  }

  const getSeds = (bucId: string) => {
    if (bucs && _.isNil(bucs[bucId].seds)) {
      dispatch(fetchSingleBuc(bucId))
    }
  }

  useEffect(() => {
    if (!_.isEmpty(bucsInfoList) && bucsInfo === undefined && !loading.gettingBUCinfo && loading.savingBucsInfo &&
      bucsInfoList!.indexOf(aktoerId + '___' + storage.NAMESPACE_BUC + '___' + storage.FILE_BUCINFO) >= 0) {
      dispatch(fetchBucsInfo(aktoerId, storage.NAMESPACE_BUC, storage.FILE_BUCINFO))
    }
  }, [aktoerId, bucsInfo, bucsInfoList, dispatch, loading])

  useEffect(() => {
    if (!mounted && !_.isNil(bucs)) {
      if (!_.isEmpty(bucs)) {
        const listOfCountries: CountryList = []
        bucs && Object.keys(bucs).forEach(key => {
          const buc: Buc = bucs[key]
          if (_.isArray(buc.institusjon)) {
            buc.institusjon.forEach((it: Institution) => {
              if (!_.find(listOfCountries, { country: it.country })) {
                listOfCountries.push({
                  country: it.country,
                  buc: buc.type!
                })
              }
            })
          }
          if (_.isArray(buc.seds)) {
            buc.seds.forEach((sed: Sed) => {
              if (_.isArray(sed.participants)) {
                sed.participants.forEach((participant: Participant) => {
                  const country = participant.organisation.countryCode
                  if (!_.find(listOfCountries, { country: country })) {
                    listOfCountries.push({
                      country: country,
                      buc: buc.type!
                    })
                  }
                })
              }
            })
          }
        })

        listOfCountries.forEach((country: Country) => {
          if (institutionList && !_.find(Object.keys(institutionList), country.country)) {
            dispatch(getInstitutionsListForBucAndCountry(country.buc, country.country))
          }
        })
      } else {
        setNewBucPanelOpen(true)
      }

      standardLogger('buc.list.bucs.data', {
        numberOfBucs: bucs ? Object.keys(bucs).length : 0
      })
      setMounted(true)
    }
  }, [institutionList, bucs, dispatch, mounted])

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <BUCListDiv
        className='a-buc-p-buclist'
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <BUCListHeader>
          {featureToggles.v2_ENABLED === true ? (
            <Undertittel>
              {t('buc:form-buclist')}
            </Undertittel>
          ) : (
            <BUCCrumbs
              bucs={bucs}
              currentBuc={undefined}
              mode='buclist'
              setMode={setMode}
            />
          )}
          {!newBucPanelOpen && (
            <HighContrastKnapp
              data-amplitude='buc.list.newbuc'
              data-testid='a-buc-p-buclist__newbuc-button-id'
              onClick={onBUCNew}
            >
              {t('buc:form-createNewCase')}
            </HighContrastKnapp>
          )}
        </BUCListHeader>
        <VerticalSeparatorDiv />
        <BUCStartDiv className={classNames({
          open: newBucPanelOpen === true,
          close: newBucPanelOpen === false
        })}
        >
          <BUCNewDiv>
            <Systemtittel>
              {t('buc:step-startBUCTitle')}
            </Systemtittel>
            <hr />
            <BUCStart
              aktoerId={aktoerId}
              setMode={setMode}
              onBucCreated={() => {
                setNewBucPanelOpen(false)
                setMode('sednew', 'forward')
              }}
              onBucCancelled={() => setNewBucPanelOpen(false)}
            />
          </BUCNewDiv>
          <VerticalSeparatorDiv />
        </BUCStartDiv>
        {loading.gettingBUCs && (
          <>
            <BUCLoading />
            <BUCLoading />
            <BUCLoading />
          </>
        )}
        {bucs === null && (
          <>
            <VerticalSeparatorDiv data-size='2' />
            <Normaltekst>
              {t('buc:error-noBucs')}
            </Normaltekst>
          </>
        )}
        {!loading.gettingBUCs && !_.isNil(bucs) && (!_.isEmpty(bucs)
          ? Object.keys(bucs).map(key => bucs[key])
            .filter(bucFilter)
            .sort(bucSorter)
            .map((buc: Buc, index: number) => {
              if (buc.error) {
                return (
                  <BadBucDiv key={index}>
                    <Alertstripe type='advarsel'>
                      {buc.error}
                    </Alertstripe>
                  </BadBucDiv>
                )
              }
              const bucId: string = buc.caseId!
              const bucInfo: BucInfo = bucsInfo && bucsInfo.bucs && bucsInfo.bucs[bucId] ? bucsInfo.bucs[bucId] : {} as BucInfo
              return featureToggles.v2_ENABLED === true ? (
                <BucLenkePanel
                  href='#'
                  border
                  data-testid={'a-buc-p-buclist__buc-' + bucId}
                  key={index}
                  className={classNames({ new: (newlyCreatedBuc && buc.caseId === newlyCreatedBuc.caseId) || false })}
                  style={{ animationDelay: (0.2 * index) + 's' }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onBUCEdit(buc)
                  }}
                >
                  <BUCHeader
                    buc={buc}
                    newBuc={(newlyCreatedBuc && buc.caseId === newlyCreatedBuc.caseId) || false}
                    bucInfo={bucInfo}
                    onBUCEdit={onBUCEdit}
                  />
                </BucLenkePanel>
              ) : (
                <BucExpandingPanel
                  data-testid={'a-buc-p-buclist__buc-' + bucId}
                  key={index}
                  className={classNames({ new: (newlyCreatedBuc && buc.caseId === newlyCreatedBuc.caseId) || false })}
                  style={{ animationDelay: (0.2 * index) + 's' }}
                  onClick={() => onBucOpen(bucId)}
                  heading={(
                    <BUCHeader
                      buc={buc}
                      newBuc={(newlyCreatedBuc && buc.caseId === newlyCreatedBuc.caseId) || false}
                      bucInfo={bucInfo}
                      onBUCEdit={onBUCEdit}
                    />
                  )}
                >
                  <>
                    <SEDHeader data-testid='a-buc-p-buclist__seadheader-div-id'>
                      <Flex4Div>
                        <Element>{t('buc:form-name')}</Element>
                      </Flex4Div>
                      <Flex3Div>
                        <Element>{t('buc:form-status')}</Element>
                      </Flex3Div>
                      <Flex3Div>
                        <Element>{t('buc:form-senderreceiver')}</Element>
                      </Flex3Div>
                      <Flex2Div />
                    </SEDHeader>
                    {!_.isNil(buc.seds) ? (
                      <SEDList
                        seds={buc.seds}
                        buc={buc}
                        onSEDNew={onSEDNew}
                      />
                    ) : <WaitingPanel message={t('buc:loading-gettingSEDs')} size='L' />}
                    <VerticalSeparatorDiv data-size='0.25' />
                  </>
                </BucExpandingPanel>
              )
            }) : (
              <>
              <VerticalSeparatorDiv data-size='2' />
              <Normaltekst>
                  {t('buc:form-noBUCsFound')}
                </Normaltekst>
            </>
          )
        )}
        <BUCFooter />
      </BUCListDiv>
    </ThemeProvider>
  )
}

BUCList.propTypes = {
  setMode: PT.func.isRequired
}

export default BUCList
