import {
  fetchBucsListWithAvdodFnr,
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
import { VerticalSeparatorDiv, HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import { AllowedLocaleString, BUCMode, PesysContext } from 'declarations/app.d'
import {
  Buc,
  BucInfo,
  BucListItem,
  Bucs,
  BucsInfo,
  SakTypeMap,
  SakTypeValue
} from 'declarations/buc.d'
import { PersonAvdods } from 'declarations/person.d'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { buttonLogger, standardLogger, timeDiffLogger, timeLogger } from 'metrics/loggers'
import { Alert, BodyLong, Heading, Button, Accordion, TextField } from '@navikt/ds-react'
import PT from 'prop-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  BadBucDiv,
  BucLenkePanel,
  BUCListDiv,
  BUCListHeader,
  BUCNewDiv,
  BUCStartDiv,
  FlexDiv,
  HiddenDiv,
  ProgressBarDiv
} from "../../CommonBucComponents";
import {BRUKERKONTEKST} from "../../../../constants/constants";

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
  sakId: string | null | undefined
  sakType: SakTypeValue | null | undefined
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
  sakId: state.app.params.sakId,
  sakType: state.app.params.sakType as SakTypeValue
})

const BUCList: React.FC<BUCListProps> = ({
  setMode, initialBucNew = undefined
}: BUCListProps): JSX.Element => {
  const {
    aktoerId, bucs, bucsList, bucsInfo, gettingBucs, gettingBucsList, newlyCreatedBuc, personAvdods, pesysContext, sakId, sakType
  } = useSelector<State, BUCListSelector>(mapState)

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [_loggedTime] = useState<Date>(new Date())
  const [_avdodFnr, setAvdodFnr] = useState<string>('')

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

  const status = !_.isEmpty(bucsList) && Object.keys(bucs!).length === bucsList?.length ? 'done' : 'inprogress'
  const now = _.isEmpty(bucsList) ? 20 : 20 + Math.floor(Object.keys(bucs!).length / (bucsList?.length ?? 1) * 80)

  return (
    <BUCListDiv
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >

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
