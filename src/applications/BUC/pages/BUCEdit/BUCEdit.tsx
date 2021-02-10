import { clientError } from 'actions/alert'
import { resetNewSed, setCurrentBuc, setCurrentSed } from 'actions/buc'
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
  animationClose, animationOpen,
  Column,
  HighContrastKnapp,
  HighContrastLink,
  HighContrastPanel,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'

import { Buc, BucInfo, Bucs, BucsInfo, Sed, Tags } from 'declarations/buc'
import { State } from 'declarations/reducers'
import { AllowedLocaleString } from 'declarations/app.d'
import { PersonAvdods } from 'declarations/person.d'
import CountryData from 'land-verktoy'
import _ from 'lodash'
import { buttonLogger, standardLogger, timeDiffLogger, timeLogger } from 'metrics/loggers'
import moment from 'moment'
import { VenstreChevron } from 'nav-frontend-chevron'
import { Normaltekst } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

export const BUCEditDiv = styled.div`
`
const BUCEditHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
`
const ContentDiv = styled(Column)`
  flex: 3;
`
const NoSedsDiv = styled.div`
  text-align: center;
  margin-top: 2rem;
`
const SEDNewDiv = styled(HighContrastPanel)`
  padding: 2rem !important;
`
const SEDStartDiv = styled.div`
  max-height: 0;
  height: 0%;
  overflow: hidden;
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
const WidgetDiv = styled(Column)`
  flex: 1;
  max-width: 400px;
`

export interface BUCEditProps {
  initialSearch?: string
  initialSedNew?: 'none' | 'open' | 'close'
  initialStatusSearch?: Tags
  setMode: (mode: BUCMode, s: string, callback?: () => void) => void
}

export interface BUCEditSelector {
  aktoerId: string
  bucs: Bucs | undefined
  bucsInfo: BucsInfo | undefined
  currentBuc: string | undefined
  currentSed: Sed | undefined
  highContrast: boolean
  locale: AllowedLocaleString,
  newlyCreatedSed: Sed | undefined,
  newlyCreatedSedTime: number | undefined
  personAvdods: PersonAvdods | undefined
  replySed: Sed | undefined
}

const mapState = (state: State): BUCEditSelector => ({
  aktoerId: state.app.params.aktoerId,
  bucs: state.buc.bucs,
  currentBuc: state.buc.currentBuc,
  currentSed: state.buc.currentSed,
  bucsInfo: state.buc.bucsInfo,
  highContrast: state.ui.highContrast,
  locale: state.ui.locale,
  newlyCreatedSed: state.buc.newlyCreatedSed,
  newlyCreatedSedTime: state.buc.newlyCreatedSedTime,
  personAvdods: state.app.personAvdods,
  replySed: state.buc.replySed
})

const BUCEdit: React.FC<BUCEditProps> = ({
  initialSearch = undefined, initialSedNew = 'none', initialStatusSearch, setMode
}: BUCEditProps): JSX.Element => {
  const {
    aktoerId, bucs, currentBuc, currentSed, bucsInfo, highContrast, locale,
    newlyCreatedSed, newlyCreatedSedTime, personAvdods, replySed
  }: BUCEditSelector = useSelector<State, BUCEditSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const componentRef = useRef(null)
  const buc: Buc | undefined = bucs ? bucs[currentBuc!] : undefined
  const bucInfo: BucInfo = buc && bucsInfo && bucsInfo.bucs ? bucsInfo.bucs[buc.caseId!] : {} as BucInfo
  const [loggedTime] = useState<Date>(new Date())
  const [_mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)
  const [_search, setSearch] = useState<string | undefined>(initialSearch)
  const [_startSed, setStartSed] = useState<string>(initialSedNew)
  const [_statusSearch, setStatusSearch] = useState<Tags | undefined>(initialStatusSearch)
  const [_totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)

  useEffect(() => {
    standardLogger('buc.edit.entrance')
    standardLogger('buc.edit.seds.data', {
      numberOfSeds: buc && buc.seds ? buc.seds.length : 0
    })
    return () => {
      timeLogger('buc.edit.view', loggedTime)
      timeDiffLogger('buc.edit.mouseover', _totalTimeWithMouseOver)
    }
  }, [loggedTime])

  useEffect(() => {
    setStartSed(initialSedNew)
  }, [initialSedNew])

  const onMouseEnter = () => setMouseEnterDate(new Date())

  const onMouseLeave = () => {
    if (_mouseEnterDate) {
      setTotalTimeWithMouseOver(_totalTimeWithMouseOver + (new Date().getTime() - _mouseEnterDate?.getTime()))
    }
  }

  const onSEDNew = (buc: Buc, sed: Sed | undefined, replySed: Sed | undefined): void => {
    const uniqueSed: Sed | undefined = _.find(buc.seds, (s: Sed) =>
      (s.type === 'P5000' || s.type === 'P6000' || s.type === 'P7000' || s.type === 'P10000') &&
      (s.status !== 'empty')
    )
    if (buc.type === 'P_BUC_06' && uniqueSed) {
      dispatch(clientError({
        error: t('buc:error-uniqueSed', { sed: uniqueSed.type })
      }))
    } else {
      dispatch(setCurrentSed(sed, replySed))
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
        t: t,
        locale: locale,
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
          const lastUpdate = moment(sed.lastUpdate).format('DD.MM.YYYY')
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

  const onNewSedButtonClick = (e: React.MouseEvent) => {
    buttonLogger(e)
    onSEDNew(buc!, undefined, undefined)
  }

  const onBackLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(resetNewSed())
    setMode('buclist', 'back', () => dispatch(setCurrentBuc(undefined)))
  }

  if (_.isEmpty(bucs) || !currentBuc) {
    return <div />
  }

  return (
    <BUCEditDiv
      data-test-id='a-buc-p-bucedit'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <BUCEditHeader>
        <HighContrastLink
          data-test-id='a-buc-p-bucedit__back-link-id'
          href='#'
          onClick={onBackLinkClick}
        >
          <VenstreChevron />
          <HorizontalSeparatorDiv data-size='0.25' />
          <span>
            {t('ui:back')}
          </span>
        </HighContrastLink>
        {_startSed !== 'open' && (
          <HighContrastKnapp
            disabled={buc!.readOnly === true}
            data-amplitude='buc.edit.newsed'
            data-test-id='a-buc-p-bucedit__new-sed-button-id'
            onClick={onNewSedButtonClick}
          >{t('buc:form-orderNewSED')}
          </HighContrastKnapp>
        )}
      </BUCEditHeader>
      <VerticalSeparatorDiv />
      <SEDStartDiv
        className={classNames({
          open: _startSed === 'open',
          close: _startSed === 'close'
        })}
        ref={componentRef}
      >
        <SEDNewDiv>
          <SEDStart
            aktoerId={aktoerId}
            bucs={bucs!}
            currentBuc={currentBuc}
            currentSed={currentSed}
            replySed={replySed}
            onSedCreated={() => setStartSed('close')}
            onSedCancelled={() => setStartSed('close')}
          />
        </SEDNewDiv>
        <VerticalSeparatorDiv />
      </SEDStartDiv>
      <Row>
        <ContentDiv>
          <SEDSearch
            highContrast={highContrast}
            onSearch={onSearch}
            onStatusSearch={onStatusSearch}
            value={_search}
          />
          <SEDPanelHeader highContrast={highContrast} />
          {!_.isNil(buc!.seds)
            ? buc!.seds
              .filter(sedFilter)
              .filter(sedSearchFilter)
              .sort(sedSorter as (a: Sed, b: Sed) => number)
              .map((sed, index) => (
                <div key={sed.id}>
                  <VerticalSeparatorDiv data-size='0.5' />
                  <SEDPanel
                    aktoerId={aktoerId!}
                    highContrast={highContrast}
                    style={{ animationDelay: (0.2 * index) + 's' }}
                    buc={buc!}
                    sed={sed}
                    newSed={(
                      newlyCreatedSed && newlyCreatedSedTime &&
                    newlyCreatedSed.id === sed.id &&
                    ((Date.now() - newlyCreatedSedTime) < 5 * 60 * 1000)
                    ) || false}
                    onSEDNew={onSEDNew}
                  />
                </div>
              ))
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
            personAvdods={personAvdods}
          />
          <VerticalSeparatorDiv />
          <BUCTools
            aktoerId={aktoerId!}
            buc={buc!}
            bucInfo={bucInfo}
          />
          <VerticalSeparatorDiv />
        </WidgetDiv>
      </Row>
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
