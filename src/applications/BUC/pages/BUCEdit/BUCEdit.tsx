import { clientError } from 'actions/alert'
import { setCurrentBuc, setCurrentSed } from 'actions/buc'
import BUCCrumbs from 'applications/BUC/components/BUCCrumbs/BUCCrumbs'
import BUCDetail from 'applications/BUC/components/BUCDetail/BUCDetail'
import BUCTools from 'applications/BUC/components/BUCTools/BUCTools'
import { getBucTypeLabel, sedFilter, sedSorter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDPanel from 'applications/BUC/components/SEDPanel/SEDPanel'
import SEDPanelHeader from 'applications/BUC/components/SEDPanelHeader/SEDPanelHeader'
import SEDSearch from 'applications/BUC/components/SEDSearch/SEDSearch'
import SEDStart from 'applications/BUC/components/SEDStart/SEDStart'
import { BUCMode } from 'applications/BUC/index'
import classNames from 'classnames'
import {
  HighContrastKnapp,
  HighContrastLink, HighContrastPanel,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from 'components/StyledComponents'
import { Buc, BucInfo, Bucs, BucsInfo, Sed, Tags } from 'declarations/buc'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, FeatureToggles } from 'declarations/types'
import CountryData from 'land-verktoy'
import _ from 'lodash'
import { buttonLogger, standardLogger, timeDiffLogger, timeLogger } from 'metrics/loggers'
import moment from 'moment'
import { VenstreChevron } from 'nav-frontend-chevron'
import { Normaltekst } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled, { keyframes } from 'styled-components'

export interface BUCEditProps {
  initialSearch ?: string
  initialSedNew ?: boolean
  initialStatusSearch ?: Tags
  setMode: (mode: BUCMode, s: string, callback?: any) => void
}

export interface BUCEditSelector {
  aktoerId: string
  bucs: Bucs | undefined
  currentBuc?: string | undefined
  bucsInfo?: BucsInfo
  featureToggles: FeatureToggles
  highContrast: boolean
  locale: AllowedLocaleString
}

const mapState = (state: State): BUCEditSelector => ({
  aktoerId: state.app.params.aktoerId,
  bucs: state.buc.bucs,
  currentBuc: state.buc.currentBuc,
  bucsInfo: state.buc.bucsInfo,
  featureToggles: state.app.featureToggles,
  highContrast: state.ui.highContrast,
  locale: state.ui.locale
})

const BUCEditHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
`
const FlexDiv = styled.div`
  display: flex;
`
const WidgetDiv = styled.div`
  flex: 2;
`
const ContentDiv = styled.div`
  flex: 3;
  margin-right: 1rem;
`
const NoSedsDiv = styled.div`
  text-align: center;
  margin-top: 2rem;
`
const BUCEditDiv = styled.div``

const SEDNewDiv = styled(HighContrastPanel)`
  padding: 2rem !important;
`
const animationOpen = keyframes`
  0% {
    height: 0%;
    max-height: 0;
  }
  100% {
    max-height:150em;
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
const SEDStartDiv = styled.div`
  max-height: 0;
  height: 0%;
  overflow: hidden;
  &.close {
    will-change: max-height, height;
    max-height: 0;
    animation: ${animationClose} 700ms ease;
  }
  &.open {
    will-change: max-height, height;
    max-height: 150em;
    animation: ${animationOpen} 700ms ease;
  }
`
const BUCEdit: React.FC<BUCEditProps> = ({
  initialSearch, initialSedNew = undefined, initialStatusSearch, setMode
}: BUCEditProps): JSX.Element | null => {
  const [search, setSearch] = useState<string | undefined>(initialSearch)
  const [statusSearch, setStatusSearch] = useState<Tags | undefined>(initialStatusSearch)
  const { aktoerId, bucs, currentBuc, bucsInfo, featureToggles, highContrast, locale }: BUCEditSelector = useSelector<State, BUCEditSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [loggedTime] = useState<Date>(new Date())
  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)
  const buc: Buc | undefined = bucs ? bucs[currentBuc!] : undefined
  const [startSed, setStartSed] = useState<boolean | undefined>(initialSedNew)
  const bucInfo: BucInfo = buc && bucsInfo && bucsInfo.bucs ? bucsInfo.bucs[buc.caseId!] : {} as BucInfo

  useEffect(() => {
    standardLogger('buc.edit.entrance')
    standardLogger('buc.edit.seds.data', {
      numberOfSeds: buc && buc.seds ? buc.seds.length : 0
    })
    return () => {
      timeLogger('buc.edit.view', loggedTime)
      timeDiffLogger('buc.edit.mouseover', totalTimeWithMouseOver)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedTime])

  const onMouseEnter = () => setMouseEnterDate(new Date())

  const onMouseLeave = () => {
    if (mouseEnterDate) {
      setTotalTimeWithMouseOver(totalTimeWithMouseOver + (new Date().getTime() - mouseEnterDate?.getTime()))
    }
  }

  if (_.isEmpty(bucs) || !currentBuc) {
    return null
  }

  const onSEDNew = (buc: Buc, sed: Sed | undefined): void => {
    const uniqueSed: Sed | undefined = _.find(buc.seds, (s: Sed) =>
      (s.type === 'P5000' || s.type === 'P6000' || s.type === 'P7000' || s.type === 'P10000') &&
      (s.status !== 'empty')
    )

    if (buc.type === 'P_BUC_06' && uniqueSed) {
      dispatch(clientError({
        error: t('buc:error-uniqueSed', { sed: uniqueSed.type })
      }))
    } else {
      dispatch(setCurrentSed(sed ? sed.id : undefined))
      if (featureToggles.v2_ENABLED === true) {
        setStartSed(true)
      } else {
        setMode('sednew' as BUCMode, 'none')
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
    if (match && search) {
      const _search: string = search.toLowerCase()
      const bucType: string = getBucTypeLabel({
        t: t,
        locale: locale,
        type: sed.type
      })
      match = !!sed.type.toLowerCase().match(_search) ||
        !!bucType.toLowerCase().match(_search) ||
        _.find(sed.participants, (it) => {
          const organizationId = it.organisation.id.toLowerCase()
          const organizationName = it.organisation.name.toLowerCase()
          const countryCode = it.organisation.countryCode.toLowerCase()
          const countryName = CountryData.getCountryInstance(locale).findByValue(countryCode.toUpperCase()).label.toLowerCase()
          const creationDate = moment(sed.creationDate).format('DD.MM.YYYY')
          const lastUpdate = moment(sed.lastUpdate).format('DD.MM.YYYY')
          const status = t('ui:' + sed.status).toLowerCase()
          return organizationId.match(_search) || organizationName.match(_search) ||
          countryCode.match(_search) || countryName.match(_search) || creationDate.match(_search) ||
          lastUpdate.match(_search) || status.match(_search)
        }) !== undefined
    }
    if (match && !_.isEmpty(statusSearch)) {
      match = _.find(statusSearch, { value: sed.status }) !== undefined
    }
    return match
  }

  return (
    <BUCEditDiv
      data-testid='a-buc-p-bucedit'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <BUCEditHeader>
        {featureToggles.v2_ENABLED === true ? (
          <HighContrastLink
            href='#' onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setMode('buclist', 'back', () => dispatch(setCurrentBuc(undefined)))
            }}
          >
            <VenstreChevron />
            <HorizontalSeparatorDiv data-size='0.25' />
            <span>
              {t('ui:back')}
            </span>
          </HighContrastLink>
        ) : (
          <BUCCrumbs
            bucs={bucs}
            currentBuc={currentBuc}
            mode='bucedit'
            setMode={setMode}
          />
        )}
        {!startSed && (
          <HighContrastKnapp
            disabled={buc!.readOnly === true}
            data-amplitude='buc.edit.newsed'
            data-testid='a-buc-p-bucedit__new-sed-button-id'
            onClick={(e: React.MouseEvent) => {
              buttonLogger(e)
              onSEDNew(buc!, undefined)
            }}
          >{t('buc:form-orderNewSED')}
          </HighContrastKnapp>
        )}
      </BUCEditHeader>
      <VerticalSeparatorDiv />
      <SEDStartDiv className={classNames({
        open: startSed === true,
        close: startSed === false
      })}
      >
        <SEDNewDiv>
          <SEDStart
            aktoerId={aktoerId} bucs={bucs!} currentBuc={currentBuc} setMode={setMode} onSedCreated={() => {
              setStartSed(false)
            }}
            onSedCancelled={() => setStartSed(false)}
          />
        </SEDNewDiv>
        <VerticalSeparatorDiv />
      </SEDStartDiv>
      <FlexDiv>
        <ContentDiv>
          <SEDSearch
            highContrast={highContrast}
            value={search}
            onSearch={onSearch}
            onStatusSearch={onStatusSearch}
          />
          <SEDPanelHeader highContrast={highContrast} />
          {!_.isNil(buc!.seds) ? buc!.seds
            .filter(sedFilter)
            .filter(sedSearchFilter)
            .sort(sedSorter as (a: Sed, b: Sed) => number)
            .map((sed, index) => {
              return (
                <>
                  <VerticalSeparatorDiv data-size='0.5' />
                  <SEDPanel
                    aktoerId={aktoerId!}
                    highContrast={highContrast}
                    style={{ animationDelay: (0.2 * index) + 's' }}
                    buc={buc!}
                    key={index}
                    sed={sed}
                    followUpSeds={buc!.seds!.filter(_seds => _seds.parentDocumentId === sed.id)}
                    onSEDNew={() => onSEDNew(buc!, sed)}
                  />
                </>
              )
            })
            : (
              <NoSedsDiv>
                <Normaltekst>
                  {t('buc:form-noSedsYet')}
                </Normaltekst>
              </NoSedsDiv>
            )}
        </ContentDiv>
        <WidgetDiv>
          <BUCDetail
            buc={buc!}
            bucInfo={bucInfo}
          />
          <VerticalSeparatorDiv />
          <BUCTools
            aktoerId={aktoerId!}
            buc={buc!}
            bucInfo={bucInfo}
          />
          <VerticalSeparatorDiv />
        </WidgetDiv>
      </FlexDiv>
    </BUCEditDiv>
  )
}

BUCEdit.propTypes = {
  initialSearch: PT.string,
  initialStatusSearch: PT.array
}

export default BUCEdit
