import {
  fetchBucsInfo,
  fetchBucsListWithAvdodFnr,
  getInstitutionsListForBucAndCountry,
  setCurrentBuc
} from 'actions/buc'
import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import BUCHeader from 'applications/BUC/components/BUCHeader/BUCHeader'
import BUCLoading from 'applications/BUC/components/BUCLoading/BUCLoading'
import BUCStart from 'applications/BUC/components/BUCStart/BUCStart'
import { bucFilter, bucSorter, pbuc02filter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import MagnifyingGlass from 'assets/icons/MagnifyingGlass'
import classNames from 'classnames'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import {
  animationClose, animationOpen, slideInFromLeft,
  themeKeys,
  HighContrastHovedknapp,
  HighContrastInput,
  HighContrastKnapp,
  HighContrastLenkepanelBase,
  HighContrastPanel,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'

import { BRUKERKONTEKST } from 'constants/constants'
import * as storage from 'constants/storage'
import { AllowedLocaleString, BUCMode, PesysContext } from 'declarations/app.d'
import {
  Buc,
  BucInfo, BucListItem,
  Bucs,
  BucsInfo,
  Institution,
  InstitutionListMap,
  Participant,
  SakTypeMap,
  SakTypeValue,
  Sed
} from 'declarations/buc.d'
import { PersonAvdods } from 'declarations/person.d'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { buttonLogger, standardLogger, timeDiffLogger, timeLogger } from 'metrics/loggers'
import Alertstripe from 'nav-frontend-alertstriper'
import { Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

export const BUCListDiv = styled.div``
const BUCListHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
`
export const BadBucDiv = styled.div`
  width: 100%;
  padding: 0rem;

  .alertstripe__tekst {
    max-width: 100% !important;
  }
`
export const BucLenkePanel = styled(HighContrastLenkepanelBase)`
  transform: translateX(-20px);
  opacity: 0;
  animation: ${slideInFromLeft} 0.2s forwards;
  background: ${({ theme }) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
  margin-bottom: 1rem;
  &.new {
    background: ${({ theme }) => theme.type === 'themeHighContrast'
  ? theme[themeKeys.NAVLIMEGRONNDARKEN60]
  : theme[themeKeys.NAVLIMEGRONNLIGHTEN60]} !important;
  }
  &:hover {
    border-color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
    border-width: ${({ theme }) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
    border-style: solid;
    background: ${({ theme }) => theme[themeKeys.ALTERNATIVE_HOVER_COLOR]};
  }
`
const BUCNewDiv = styled(HighContrastPanel)`
  padding: 2rem !important;
`
export const BUCStartDiv = styled.div`
  max-height: 0;
  height: 0%;
  overflow: hidden;
  &.close {
    will-change: max-height, height;
    max-height: 0;
    animation: ${animationClose(150)} 400ms ease;
  }
  &.open {
    will-change: max-height, height;
    max-height: 50em;
    animation: ${animationOpen(150)} 400ms ease;
  }
`
export const BUCLoadingDiv = styled.div``
const FlexDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  &.feil {
    align-items: center !important;
  }
`
const HiddenDiv = styled.div`
  position: absolute;
  left: -99999px;
`

export interface BUCListProps {
  initialBucNew?: boolean
  setMode: (mode: BUCMode, s: string, callback?: any, content ?: JSX.Element) => void
}

export interface BUCListSelector {
  aktoerId: string | null | undefined
  bucs: Bucs | undefined
  bucsList: Array<BucListItem> | undefined
  bucsInfo: BucsInfo | undefined
  bucsInfoList: Array<string> | undefined
  highContrast: boolean
  institutionList: InstitutionListMap<Institution> | undefined
  gettingBucsList: boolean
  gettingBucs: boolean
  gettingBucsInfo: boolean
  locale: AllowedLocaleString
  newlyCreatedBuc: Buc | undefined
  personAvdods: PersonAvdods | undefined
  pesysContext: PesysContext | undefined
  sakId: string | null | undefined
  sakType: SakTypeValue | null | undefined
}

const mapState = (state: State): BUCListSelector => ({
  aktoerId: state.app.params.aktoerId,
  bucs: state.buc.bucs,
  bucsList: state.buc.bucsList,
  bucsInfo: state.buc.bucsInfo,
  bucsInfoList: state.buc.bucsInfoList,
  highContrast: state.ui.highContrast,
  institutionList: state.buc.institutionList,
  gettingBucsInfo: state.loading.gettingBucsInfo,
  gettingBucs: state.loading.gettingBucs,
  gettingBucsList: state.loading.gettingBucsList,
  locale: state.ui.locale,
  newlyCreatedBuc: state.buc.newlyCreatedBuc,
  personAvdods: state.app.personAvdods,
  pesysContext: state.app.pesysContext,
  sakId: state.app.params.sakId,
  sakType: state.app.params.sakType as SakTypeValue
})

const BUCList: React.FC<BUCListProps> = ({
  setMode, initialBucNew = undefined
}: BUCListProps): JSX.Element => {
  const {
    aktoerId, bucs, bucsList, bucsInfo, bucsInfoList, highContrast, institutionList, gettingBucsInfo, gettingBucs, gettingBucsList,
    newlyCreatedBuc, personAvdods, pesysContext, sakId, sakType
  } = useSelector<State, BUCListSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [_loggedTime] = useState<Date>(new Date())
  const [_avdodFnr, setAvdodFnr] = useState<string>('')
  const [_parsedCountries, setParsedCountries] = useState<boolean>(false)
  const [_mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)
  const [_newBucPanelOpen, setNewBucPanelOpen] = useState<boolean | undefined>(initialBucNew)
  const [_totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [_validation, setValidation] = useState<string | undefined>(undefined)

  const [_sortedBucs, _setSortedBucs] = useState<Array<Buc> | undefined>(undefined)
  const [_filteredBucs, _setFilteredBucs] = useState<Array<Buc> | undefined>(undefined)
  const [_pBuc02filteredBucs, _setPBuc02filteredBucs] = useState<Array<Buc> | undefined>(undefined)

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
    setNewBucPanelOpen(true)
  }

  const performValidation = (): boolean => _avdodFnr.match(/^\d{11}$/) !== null

  const onAvdodFnrChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValidation(undefined)
    setAvdodFnr(e.target.value)
  }

  const onAvdodFnrButtonClick = (): void => {
    const valid = performValidation()
    if (valid) {
      setNewBucPanelOpen(false)
      dispatch(fetchBucsListWithAvdodFnr(aktoerId, sakId, _avdodFnr))
    } else {
      setValidation(t('buc:validation-badAvdodFnr'))
    }
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onAvdodFnrButtonClick()
    }
  }

  useEffect(() => {
    if (!_.isEmpty(bucs)) {
      const filteredBucs: Array<Buc> = Object.keys(bucs!).map(key => bucs![key]).filter(bucFilter)
      _setFilteredBucs(filteredBucs)
      const pBuc02filteredBucs = filteredBucs.filter(pbuc02filter(pesysContext, personAvdods))
      _setPBuc02filteredBucs(pBuc02filteredBucs)
      const sortedBucs = pBuc02filteredBucs.sort(bucSorter)
      _setSortedBucs(sortedBucs)
    }
  }, [bucs])

  useEffect(() => {
    if (!_.isEmpty(bucsInfoList) && bucsInfo === undefined && !gettingBucsInfo &&
      bucsInfoList!.indexOf(aktoerId + '___' + storage.NAMESPACE_BUC + '___' + storage.FILE_BUCINFO) >= 0) {
      dispatch(fetchBucsInfo(aktoerId, storage.NAMESPACE_BUC, storage.FILE_BUCINFO))
    }
  }, [aktoerId, bucsInfo, bucsInfoList, dispatch, gettingBucsInfo])

  useEffect(() => {
    if (!_.isEmpty(bucs) && !gettingBucs && !_parsedCountries) {
      setParsedCountries(true)
      const listOfCountries: Array<{country: string, buc: string}> = []
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

      listOfCountries.forEach((country) => {
        if (institutionList && !_.find(Object.keys(institutionList), country.country)) {
          dispatch(getInstitutionsListForBucAndCountry(country.buc, country.country))
        }
      })
      standardLogger('buc.list.bucs.data', {
        numberOfBucs: bucs ? Object.keys(bucs).length : 0
      })
    } /* else {
      setNewBucPanelOpen(true)
    } */
  }, [institutionList, bucs, dispatch, _parsedCountries])

  return (
    <BUCListDiv
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <BUCListHeader>
        <Undertittel>
          {t('buc:form-buclist')}
        </Undertittel>
        {!_newBucPanelOpen && (
          <HighContrastKnapp
            data-amplitude='buc.list.newbuc'
            data-test-id='a-buc-p-buclist__newbuc-button-id'
            onClick={onBUCNew}
          >
            {t('buc:form-createNewCase')}
          </HighContrastKnapp>
        )}
      </BUCListHeader>
      <VerticalSeparatorDiv />
      <BUCStartDiv className={classNames({
        open: _newBucPanelOpen === true,
        close: _newBucPanelOpen === false
      })}
      >
        <BUCNewDiv border>
          <Systemtittel>
            {t('buc:step-startBUCTitle')}
          </Systemtittel>
          <hr />
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
      {(gettingBucsList || gettingBucs) && (
        <BUCLoadingDiv>
          <BUCLoading />
          <BUCLoading />
          <BUCLoading />
        </BUCLoadingDiv>
      )}
      {!gettingBucs && bucsList === null && (
        <>
          <VerticalSeparatorDiv size='2' />
          <Normaltekst>
            {t('buc:error-noBucs')}
          </Normaltekst>
        </>
      )}
      {!gettingBucs && !_.isNil(_filteredBucs) && !_.isNil(_pBuc02filteredBucs) && _filteredBucs.length !== _pBuc02filteredBucs.length && (
        <>
          <VerticalSeparatorDiv />
          <BadBucDiv>
            <Alertstripe type='advarsel'>
              {t('buc:warning-filteredBucs')}
            </Alertstripe>
          </BadBucDiv>
          <VerticalSeparatorDiv />
        </>
      )}
      {!gettingBucs && !_.isNil(_sortedBucs) && !_.isEmpty(_sortedBucs) &&
          _sortedBucs.map((buc: Buc, index: number) => {
            if (buc?.error) {
              return (
                <BadBucDiv key={index}>
                  <Alertstripe type='advarsel'>
                    {buc?.error}
                  </Alertstripe>
                </BadBucDiv>
              )
            }
            const bucId: string = buc.caseId!
            const bucInfo: BucInfo = bucsInfo && bucsInfo.bucs && bucsInfo.bucs[bucId] ? bucsInfo.bucs[bucId] : {} as BucInfo
            return (
              <BucLenkePanel
                href='#'
                border
                data-test-id={'a-buc-p-buclist__buc-' + bucId}
                key={index}
                className={classNames({ new: (newlyCreatedBuc && buc.caseId === newlyCreatedBuc.caseId) || false })}
                style={{ animationDelay: (0.2 * index) + 's' }}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onBUCEdit(buc)
                }}
              >
                <BUCHeader
                  buc={buc}
                  newBuc={(newlyCreatedBuc && buc.caseId === newlyCreatedBuc.caseId) || false}
                  bucInfo={bucInfo}
                />
              </BucLenkePanel>
            )
          })}
      {!gettingBucs && !_.isNil(bucs) && pesysContext === BRUKERKONTEKST &&
          (sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP) && (
            <>
              <VerticalSeparatorDiv size='2' />
              <BadBucDiv>
                <>
                  <ExpandingPanel
                    collapseProps={{ id: 'a-buc-c-buclist__no-buc-id' }}
                    className={classNames({ highContrast: highContrast })}
                    data-test-id='a-buc-c-buclist__no-buc-id'
                    heading={(
                      <FlexDiv>
                        <MagnifyingGlass width='24' />
                        <HorizontalSeparatorDiv />
                        <Undertittel>
                          {t('buc:form-searchOtherBUCs')}
                        </Undertittel>
                      </FlexDiv>
                    )}
                  >
                    <>
                      <Normaltekst>
                        {t('buc:form-searchOtherBUCs-description')}
                      </Normaltekst>
                      <VerticalSeparatorDiv />
                      <FlexDiv className={classNames({ feil: _validation || false })}>
                        <HighContrastInput
                          style={{ width: '200px' }}
                          data-test-id='a-buc-p-buclist__avdod-input-id'
                          feil={_validation || false}
                          id='a-buc-p-buclist__avdod-input-id'
                          label={(
                            <HiddenDiv>
                              {t('buc:form-avdodFnr')}
                            </HiddenDiv>
                          )}
                          onChange={onAvdodFnrChange}
                          placeholder={t('buc:form-searchOtherBUCs-placeholder')}
                          value={_avdodFnr || ''}
                          onKeyPress={handleKeyPress}
                        />
                        <HorizontalSeparatorDiv />
                        <HighContrastHovedknapp
                          onClick={onAvdodFnrButtonClick}
                        >
                          {t('ui:get')}
                        </HighContrastHovedknapp>
                      </FlexDiv>
                    </>
                  </ExpandingPanel>
                  <VerticalSeparatorDiv size='2' />
                </>
              </BadBucDiv>
              <VerticalSeparatorDiv size='2' />
            </>
      )}
      <BUCFooter />
    </BUCListDiv>
  )
}

BUCList.propTypes = {
  setMode: PT.func.isRequired
}

export default BUCList
