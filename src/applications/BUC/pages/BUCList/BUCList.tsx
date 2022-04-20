import {
  fetchBucsInfo,
  fetchBucsListWithAvdodFnr,
  getInstitutionsListForBucAndCountry,
  setCurrentBuc
} from 'actions/buc'
import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import BUCHeader from 'applications/BUC/components/BUCHeader/BUCHeader'
import BUCStart from 'applications/BUC/components/BUCStart/BUCStart'
import { bucFilter, bucSorter, pbuc02filter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import { Search } from '@navikt/ds-icons'
import classNames from 'classnames'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import ProgressBar from '@navikt/fremdriftslinje'
import {
  animationClose, animationOpen, slideInFromLeft,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'

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
import { LinkPanel, Accordion, Alert, BodyLong, Heading, Panel, Button, TextField } from '@navikt/ds-react'
import PT from 'prop-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

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
  margin-bottom: 1rem;
  .alertstripe--tekst {
    max-width: 100% !important;
  }
`
export const BucLenkePanel = styled(LinkPanel)`
  transform: translateX(-20px);
  opacity: 0;
  animation: ${slideInFromLeft} 0.2s forwards;
  background: var(--navds-semantic-color-component-background-light);
  margin-bottom: 1rem;
  .navds-link-panel__content {
    width: 100%;
  }
  &.new {
    background: var(--navds-global-color-limegreen-100) !important;
  }
  &:hover {
    background: var(--navds-semantic-color-interaction-primary-hover-subtle);
  }
`
const BUCNewDiv = styled(Panel)`
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
  &.error {
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
  institutionList: state.buc.institutionList,
  gettingBucsInfo: state.loading.gettingBucsInfo,
  gettingBucs: state.loading.gettingBucs,
  gettingBucsList: state.loading.gettingBucsList,
  locale: state.ui.locale,
  newlyCreatedBuc: state.buc.newlyCreatedBuc,
  personAvdods: state.person.personAvdods,
  pesysContext: state.app.pesysContext,
  sakId: state.app.params.sakId,
  sakType: state.app.params.sakType as SakTypeValue
})

const BUCList: React.FC<BUCListProps> = ({
  setMode, initialBucNew = undefined
}: BUCListProps): JSX.Element => {
  const {
    aktoerId, bucs, bucsList, bucsInfo, bucsInfoList, institutionList, gettingBucsInfo, gettingBucs, gettingBucsList,
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
    if (valid && aktoerId && sakId) {
      setNewBucPanelOpen(false)
      dispatch(fetchBucsListWithAvdodFnr(aktoerId, sakId, _avdodFnr))
    } else {
      setValidation(t('message:validation-badAvdodFnr'))
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
    if (!_.isEmpty(bucsInfoList) && aktoerId && bucsInfo === undefined && !gettingBucsInfo &&
      bucsInfoList!.indexOf(aktoerId + '--_' + storage.NAMESPACE_BUC + '--_' + storage.FILE_BUCINFO) >= 0) {
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
                if (!_.find(listOfCountries, { country })) {
                  listOfCountries.push({
                    country,
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

  const status = !_.isEmpty(bucsList) && Object.keys(bucs!).length === bucsList?.length ? 'done' : 'inprogress'
  const now = _.isEmpty(bucsList) ? 20 : 20 + Math.floor(Object.keys(bucs!).length / (bucsList?.length ?? 1) * 80)

  return (
    <BUCListDiv
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div style={{ width: '50%', margin: 'auto', height: '40px' }}>
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
      </div>
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
      {!gettingBucs && _.isEmpty(bucsList) && (
        <>
          <VerticalSeparatorDiv size='2' />
          <BodyLong>
            {t('message:warning-noBucs')}
          </BodyLong>
        </>
      )}
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
      {!_.isEmpty(bucs) && pesysContext === BRUKERKONTEKST &&
          (sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP) && (
            <>
              <VerticalSeparatorDiv size='2' />
              <BadBucDiv>
                <>
                  <Accordion id='a_buc_c_buclist--no-buc-id'>
                    <Accordion.Item>
                      <Accordion.Header>
                        <FlexDiv>
                          <Search width='24' />
                          <HorizontalSeparatorDiv />
                          <Heading size='small'>
                            {t('buc:form-searchOtherBUCs')}
                          </Heading>
                        </FlexDiv>
                      </Accordion.Header>
                      <Accordion.Content>
                        <FlexDiv className={classNames({ error: _validation || false })}>
                          <TextField
                            style={{ width: '200px' }}
                            data-testid='a-buc-p-buclist--avdod-input-id'
                            error={_validation || false}
                            id='a-buc-p-buclist--avdod-input-id'
                            label={(
                              <HiddenDiv>
                                {t('buc:form-avdodFnr')}
                              </HiddenDiv>
                          )}
                            onChange={onAvdodFnrChange}
                            description={t('buc:form-searchOtherBUCs-description')}
                            value={_avdodFnr || ''}
                            onKeyPress={handleKeyPress}
                          />
                          <HorizontalSeparatorDiv />
                          <Button
                            variant='primary'
                            onClick={onAvdodFnrButtonClick}
                          >
                            {t('ui:get')}
                          </Button>
                        </FlexDiv>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>
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
