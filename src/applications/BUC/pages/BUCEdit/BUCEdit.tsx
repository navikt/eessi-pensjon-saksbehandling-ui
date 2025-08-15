import { ChevronLeftIcon } from '@navikt/aksel-icons'
import {BodyLong, Box, Button, HStack, Label, Loader, Panel, VStack} from '@navikt/ds-react'
import { alertFailure } from 'src/actions/alert'
import {getSedList, resetNewSed, setCurrentBuc, setFollowUpSeds, setSedList} from 'src/actions/buc'
import BUCDetail from 'src/applications/BUC/components/BUCDetail/BUCDetail'
import BUCTools from 'src/applications/BUC/components/BUCTools/BUCTools'
import { getBucTypeLabel, sedFilter, sedSorter } from 'src/applications/BUC/components/BUCUtils/BUCUtils'
import SEDPanel from 'src/applications/BUC/components/SEDPanel/SEDPanel'
import SEDPanelHeader from 'src/applications/BUC/components/SEDPanelHeader/SEDPanelHeader'
import SEDSearch from 'src/applications/BUC/components/SEDSearch/SEDSearch'
import SEDStart from 'src/applications/BUC/components/SEDStart/SEDStart'
import classNames from 'classnames'
import { AllowedLocaleString, BUCMode } from 'src/declarations/app.d'
import {Buc, BucInfo, Bucs, BucsInfo, Sed, Tags, ValidBuc} from 'src/declarations/buc'
import { PersonAvdods } from 'src/declarations/person.d'
import { State } from 'src/declarations/reducers'
import CountryData from '@navikt/land-verktoy'
import _ from 'lodash'
import moment from 'moment'
import PT from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { animationClose, animationOpen } from "src/components/Animations/Animations";

export const BUCEditDiv = styled.div`
`
const BUCEditHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
`
const ContentDiv = styled.div`
  flex: 3;
  margin-right: 0.5rem;
`
const NoSedsDiv = styled.div`
  text-align: center;
  margin-top: 2rem;
`
const SEDNewDiv = styled(Panel)`
  padding: 2rem !important;
`
const SEDStartDiv = styled.div`
  max-height: 0;
  height: 0%;
  overflow: hidden;
    &.closeOnBack {
    will-change: max-height, height;
    max-height: 0;
  }
  &.close {
    will-change: max-height, height;
    max-height: 0;
    animation: ${animationClose(150)} 700ms ease;
  }
  &.open {
    will-change: max-height, height;
    max-height: 150em;
    animation: ${animationOpen(150)} 700ms ease;
  }
`
const WidgetDiv = styled.div`
  flex: 1;
  max-width: 400px;
  margin-left: 0.5rem;
`

export interface BUCEditProps {
  initialSearch?: string
  initialSedNew?: 'none' | 'open' | 'close'
  initialStatusSearch?: Tags
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

export interface BUCEditSelector {
  aktoerId: string | null | undefined
  bucs: Bucs | undefined
  bucsInfo: BucsInfo | undefined
  currentBuc: string | undefined
  currentSed: Sed | undefined
  locale: AllowedLocaleString,
  newlyCreatedSed: Sed | undefined,
  newlyCreatedSedTime: number | undefined
  personAvdods: PersonAvdods | undefined
  followUpSeds: Array<Sed> | undefined
}

const mapState = (state: State): BUCEditSelector => ({
  aktoerId: state.app.params.aktoerId,
  bucs: state.buc.bucs,
  currentBuc: state.buc.currentBuc,
  currentSed: state.buc.currentSed,
  followUpSeds: state.buc.followUpSeds,
  bucsInfo: state.buc.bucsInfo,
  locale: state.ui.locale,
  newlyCreatedSed: state.buc.newlyCreatedSed,
  newlyCreatedSedTime: state.buc.newlyCreatedSedTime,
  personAvdods: state.person.personAvdods
})

const BUCEdit: React.FC<BUCEditProps> = ({
  initialSearch = undefined, initialSedNew = 'none', initialStatusSearch, setMode
}: BUCEditProps): JSX.Element => {
  const {
    aktoerId, bucs, currentBuc, currentSed, bucsInfo, locale,
    newlyCreatedSed, newlyCreatedSedTime, personAvdods, followUpSeds
  }: BUCEditSelector = useSelector<State, BUCEditSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const componentRef = useRef(null)
  const buc: Buc | undefined = bucs ? bucs[currentBuc!] : undefined
  const bucInfo: BucInfo = buc && bucsInfo && bucsInfo.bucs ? bucsInfo.bucs[buc.caseId!] : {} as BucInfo
  const [_search, setSearch] = useState<string | undefined>(initialSearch)
  const [_startSed, setStartSed] = useState<string>(initialSedNew)
  const [_statusSearch, setStatusSearch] = useState<Tags | undefined>(initialStatusSearch)

  useEffect(() => {
    setStartSed(initialSedNew)
  }, [initialSedNew])

  const hasSeds = (buc: Buc): boolean => {
    return !!_.find(buc.seds, (s: Sed) =>
      (s.type === 'P5000' || s.type === 'P6000' || s.type === 'P7000' || s.type === 'P10000') && (s.status !== 'empty')
    )
  }

  const onFollowUpSed = (buc: Buc, sed: Sed | undefined, followUpSeds: Array<Sed> | undefined): void => {
    const uniqueSed: Sed | undefined = _.find(buc.seds, (s: Sed) =>
      (s.type === 'P5000' || s.type === 'P6000' || s.type === 'P7000' || s.type === 'P10000') &&
      (s.status !== 'empty')
    )
    if (buc.type === 'P_BUC_06' && uniqueSed) {
      dispatch(alertFailure(t('message:error-uniqueSed', { sed: uniqueSed.type })))
    } else {
      dispatch(setFollowUpSeds(sed, followUpSeds))
      dispatch(_.isEmpty(followUpSeds) ? getSedList(buc as ValidBuc) : setSedList(followUpSeds!.map(s => s.type)))
      setStartSed('open')
      if (componentRef && componentRef!.current) {
        if ((componentRef.current as any).scrollIntoView) {
          (componentRef.current as any).scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  const onStatusSearch = (statusSearch: Tags): void => {
    setStatusSearch(statusSearch)
  }

  const onSearch = (search: string): void => {
    setSearch(search)
  }

  const sedSearchFilter = (sed: Sed): boolean => {
    let match: boolean = true
    if (match && _search) {
      const search: string = _search.toLowerCase()
      const bucType: string = getBucTypeLabel({
        t,
        locale,
        type: sed.type
      })
      match = !!sed.type.toLowerCase().match(search) ||
        !!bucType.toLowerCase().match(search) ||
        _.find(sed.participants, (it) => {
          const organizationId = it.organisation.id.toLowerCase()
          const organizationName = it.organisation.name.toLowerCase()
          const countryCode = it.organisation.countryCode.toLowerCase()
          const countryName = CountryData.getCountryInstance(locale).findByValue(countryCode.toUpperCase()).label.toLowerCase()
          const creationDate = moment(sed.creationDate).format('DD.MM.YYYY')
          const lastUpdate = moment(sed.receiveDate ?? sed.lastUpdate).format('DD.MM.YYYY')
          const status = t('ui:' + sed.status).toLowerCase()
          return organizationId.match(search) || organizationName.match(search) ||
          countryCode.match(search) || countryName.match(search) || creationDate.match(search) ||
          lastUpdate.match(search) || status.match(search)
        }) !== undefined
    }
    if (match && !_.isEmpty(_statusSearch)) {
      match = _.find(_statusSearch, { value: sed.status }) !== undefined
    }
    return match
  }

  const onNewSedButtonClick = () => {
    onFollowUpSed(buc!, undefined, undefined)
  }

  const backLinkCallback = () => {
    if(_startSed === 'open'){
      setStartSed('closeOnBack')
    }
    dispatch(setCurrentBuc(undefined))
  }

  const onBackLinkClick = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(resetNewSed())
    setMode('buclist', 'back', backLinkCallback)
  }

  if (_.isEmpty(bucs) || !currentBuc || !bucs[currentBuc]) {
    return <Loader/>
  }

  const renderSeds: Array<Sed> = buc!.seds?.filter(sedFilter)
    .filter(sedSearchFilter)
    .sort(sedSorter as (a: Sed, b: Sed) => number) ?? []

  return (
    <BUCEditDiv
      data-testid='a-buc-p-bucedit'
    >
      <VStack gap="4">
        <BUCEditHeader>
          <Button
            variant='secondary'
            data-testid='a-buc-p-bucedit--back-button-id'
            onClick={onBackLinkClick}
            iconPosition="left" icon={<ChevronLeftIcon aria-hidden />}
          >
            <span>
              {t('ui:back')}
            </span>
          </Button>

          {_startSed !== 'open' && (
            <Button
              variant='secondary'
              disabled={buc!.readOnly === true || (buc!.type === 'P_BUC_06' && hasSeds(buc!))}
              data-testid='a-buc-p-bucedit--new-sed-button-id'
              onClick={onNewSedButtonClick}
            >{t('buc:form-orderNewSED')}
            </Button>
          )}

        </BUCEditHeader>
        <SEDStartDiv
          className={classNames({
            open: _startSed === 'open',
            close: _startSed === 'close',
            closeOnBack: _startSed === 'closeOnBack'
          })}
          ref={componentRef}
        >
          <Box paddingBlock="0 4">
            <SEDNewDiv border>
              <SEDStart
                aktoerId={aktoerId}
                bucs={bucs!}
                currentBuc={currentBuc}
                currentSed={currentSed}
                followUpSeds={followUpSeds}
                onSedCreated={() => setStartSed('close')}
                onSedCancelled={() => setStartSed('close')}
              />
            </SEDNewDiv>
          </Box>
        </SEDStartDiv>
      </VStack>
      <HStack>
        <ContentDiv>
          <SEDSearch
            onSearch={onSearch}
            onStatusSearch={onStatusSearch}
            value={_search}
          />
          <SEDPanelHeader />
          {!_.isNil(buc!.seds)
            ? renderSeds.map((sed, index) => {
                return (
                  <div key={sed.id}>
                    {index === 0 && sed.status === 'new' && (
                      <>
                        <Box paddingBlock="2 4">
                          <Label>
                            {t('buc:form-utkast-seds')}
                          </Label>
                        </Box>
                      </>
                    )}
                    {index > 0 &&
                    renderSeds?.[index - 1]?.status === 'new' &&
                      sed.status !== 'new' && (
                        <>
                          <Box paddingBlock="4 4">
                            <Label>
                              {t('buc:form-andre-seder')}
                            </Label>
                          </Box>
                        </>
                    )}
                    <SEDPanel
                      aktoerId={aktoerId!}
                      style={{ animationDelay: (0.1 * index) + 's' }}
                      buc={buc!}
                      sed={sed}
                      newSed={(
                        newlyCreatedSed && newlyCreatedSedTime &&
                        newlyCreatedSed.id === sed.id &&
                        ((Date.now() - newlyCreatedSedTime) < 5 * 60 * 1000)
                      ) || false}
                      setMode={setMode}
                      onFollowUpSed={onFollowUpSed}
                    />
                  </div>
                )
              })
            : (
              <NoSedsDiv>
                <BodyLong>
                  {t('buc:form-noSedsYet')}
                </BodyLong>
              </NoSedsDiv>
              )}
        </ContentDiv>
        <WidgetDiv>
          <VStack gap="4">
            <BUCDetail
              buc={buc!}
              personAvdods={personAvdods}
            />
            <BUCTools
              aktoerId={aktoerId!}
              buc={buc!}
              bucInfo={bucInfo}
              setMode={setMode}
            />
          </VStack>
        </WidgetDiv>
      </HStack>
    </BUCEditDiv>
  )
}

BUCEdit.propTypes = {
  initialSearch: PT.string,
  initialSedNew: PT.oneOf(['none', 'open', 'close']),
  initialStatusSearch: PT.array,
  setMode: PT.func.isRequired
}

export default BUCEdit
