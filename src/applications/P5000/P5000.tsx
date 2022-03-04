import { BackFilled, Warning } from '@navikt/ds-icons'
import { Alert, Checkbox, BodyLong, Heading, Button } from '@navikt/ds-react'
import { removeEntry, saveEntry } from 'actions/localStorage'
import { getSed, resetSentP5000info } from 'actions/p5000'
import { sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'
import P5000DragAndDropContext from 'applications/P5000/P5000DragAndDropContext'
import { SeparatorSpan, SpinnerDiv } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { BUCMode, Entries, FeatureToggles, LocalStorageEntry } from 'declarations/app'
import { Buc, P5000FromRinaMap, Sed, Seds } from 'declarations/buc'
import { EmptyPeriodsReport, P5000Context, P5000SED, SedSender } from 'declarations/p5000'
import { State } from 'declarations/reducers'
import Flag from '@navikt/flagg-ikoner'
import _ from 'lodash'
import { Column, FlexCenterDiv, HorizontalSeparatorDiv, PileDiv, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Sort } from '@navikt/tabell'
import { getSedSender } from './conversion'
import P5000Edit from './P5000Edit'
import P5000Overview from './P5000Overview'
import P5000Sum from './P5000Sum'
import P5000Draggable from './P5000Draggable'
import P5000Droppable from './P5000Droppable'

export interface P5000Props {
  buc: Buc
  context: P5000Context
  mainSed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

export interface P5000Selector {
  featureToggles: FeatureToggles
  p5000FromRinaMap: P5000FromRinaMap
  storageEntries: Entries
}

const mapState = (state: State): P5000Selector => ({
  featureToggles: state.app.featureToggles,
  p5000FromRinaMap: state.p5000.p5000FromRinaMap,
  storageEntries: state.localStorage.entries
})

const P5000: React.FC<P5000Props> = ({
  buc,
  context,
  mainSed = undefined,
  setMode
}: P5000Props): JSX.Element => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {
    featureToggles, p5000FromRinaMap, storageEntries
  }: P5000Selector = useSelector<State, P5000Selector>(mapState)

  /* for drag & drop placeholder */
  const [placeholderProps, setPlaceholderProps] = useState<any>({})
  /* which seds should be visible */
  const [_activeSeds, _setActiveSeds] = useState<Seds>([])
  /* are we fetching P5000s from RINA */
  const [_fetchingP5000, _setFetchingP5000] = useState<Seds | undefined>(undefined)
  /* are we ready to show the page */
  const [_ready, _setReady] = useState<boolean>(false)
  /* SEDs that will be used for the P5000 page */
  const [_seds, _setSeds] = useState<Seds | undefined>(undefined)

  const getLabel = (sed: Sed) => {
    const sender: SedSender | undefined = getSedSender(sed)
    return (
      <FlexCenterDiv style={{flexWrap: 'wrap'}}>
      <span>
        {t('buc:form-dateP5000', {date: sender?.date})}
      </span>
        <SeparatorSpan>-</SeparatorSpan>
        {sender
          ? (
            <FlexCenterDiv>
              <Flag
                animate
                country={sender?.country}
                label={sender?.countryLabel}
                size='XS'
                type='circle'
                wave={false}
              />
              <HorizontalSeparatorDiv size='0.2'/>
              <span>{sender?.countryLabel}</span>
              <SeparatorSpan>-</SeparatorSpan>
              <span>{sender?.institution}</span>
              <SeparatorSpan>-</SeparatorSpan>
              <SEDStatus
                status={sed.status}
              />
            </FlexCenterDiv>
          )
          : sed.id}
        {emptyPeriodReport[sed.id] && (
          <>
            <HorizontalSeparatorDiv size='0.5'/>
            <Warning/>
          </>
        )}
      </FlexCenterDiv>
    )
  }

  const renderP5000EditHeader = () => {
    if (!mainSed) return null
    return (
      <FlexCenterDiv>
        <Heading size='small' style={{display: 'flex'}}>
          {t('p5000:edit-title')}
        </Heading>
        <HorizontalSeparatorDiv/>
        -
        <HorizontalSeparatorDiv/>
        {getLabel(mainSed)}
      </FlexCenterDiv>
    )
  }

  const renderP5000EditContent = (activeSeds: Seds, p5000FromStorage: LocalStorageEntry<P5000SED> | undefined) => {
    if (!mainSed) return null
    return (
      <P5000Edit
        caseId={buc.caseId!}
        onBackClick={onBackClick}
        key={'P5000-Edit-' + mainSed.id + '-Context-' + context + '-Version-' + p5000FromStorage?.date}
        p5000FromRinaMap={p5000FromRinaMap}
        p5000FromStorage={p5000FromStorage}
        saveP5000ToStorage={saveP5000ToStorage}
        removeP5000FromStorage={removeP5000FromStorage}
        mainSed={mainSed}
      />
    )
  }

  const renderP5000SumHeader = () => (
    <Heading size='small'>
      {t('p5000:summary-title')}
    </Heading>
  )

  const renderP5000SumContent = (activeSeds: Seds, p5000FromStorage: LocalStorageEntry<P5000SED> | undefined) => {
    const onlyNorwegianActiveSeds: Seds = _.filter(activeSeds, (sed: Sed) => sed.status !== 'received') ?? []
    return (
      <P5000Sum
        context={context}
        key={'P5000Sum' + onlyNorwegianActiveSeds!.map(s => s.id).join(',') + '-context-' + context + '-version-' + p5000FromStorage?.date}
        p5000FromRinaMap={p5000FromRinaMap}
        p5000FromStorage={p5000FromStorage}
        saveP5000ToStorage={saveP5000ToStorage}
        seds={onlyNorwegianActiveSeds}
        mainSed={mainSed}
      />
    )
  }

  const renderP5000OverviewHeader = () => (
    <Heading size='small'>
      {t('p5000:overview-title')}
    </Heading>
  )

  const renderP5000OverviewContent = (activeSeds: Seds, p5000FromStorage: LocalStorageEntry<P5000SED> | undefined) => {
    return (
      <P5000Overview
        context={context}
        key={'P5000Overview-' + activeSeds!.map(s => s.id).join(',') + '-context-' + context + '-version-' + p5000FromStorage?.date}
        p5000FromRinaMap={p5000FromRinaMap}
        p5000FromStorage={p5000FromStorage}
        seds={activeSeds}
      />
    )
  }

  const updateActiveSeds = (seds: any) => {
    _setActiveSeds(seds)
    updateTables(seds)
  }

  const renderTableContent = (id: string, activeSeds: Seds, p5000FromStorage: LocalStorageEntry<P5000SED> | undefined) => {
    if (id === 'P5000Edit') return renderP5000EditContent(activeSeds, p5000FromStorage)
    if (id === 'P5000Sum') return renderP5000SumContent(activeSeds, p5000FromStorage)
    if (id === 'P5000Overview') return renderP5000OverviewContent(activeSeds, p5000FromStorage)
    return null
  }

  const renderTableHeader = (id: string) => {
    if (id === 'P5000Edit') return renderP5000EditHeader()
    if (id === 'P5000Sum') return renderP5000SumHeader()
    if (id === 'P5000Overview') return renderP5000OverviewHeader()
    return null
  }

  const [_tables, _setTables] = useState<Array<any>>(
    [
      {id: 'P5000Edit', content: <div></div>, header: <div></div>},
      {id: 'P5000Sum', content: <div></div>, header: <div></div>},
      {id: 'P5000Overview', content: <div></div>, header: <div></div>}
    ])

  useEffect(() => {
    updateTables(_activeSeds)
  }, [storageEntries])

  const updateTables = (activeSeds: Seds) => {
    // use local storage stuff only in edit context, no need for overview context
    const p5000EntryFromStorage: LocalStorageEntry | undefined = _.find(storageEntries?.[buc.caseId!], e => e.sedId === mainSed?.id)

    let newTables = _.cloneDeep(_tables)
    newTables = newTables.map(t => ({
      id: t.id,
      content: renderTableContent(t.id, activeSeds, p5000EntryFromStorage),
      header: renderTableHeader(t.id)
    }))
    _setTables(newTables)
  }

  const saveP5000ToStorage = (newSed: P5000SED | undefined, sedId: string, sort?: Sort): void => {
    if (newSed) {
      dispatch(saveEntry(buc.caseId!, {
        sedId,
        sedType: 'P5000',
        sort,
        date: new Date().getTime(),
        content: newSed
      }))
    }
  }

  const removeP5000FromStorage = (sedId: string): void => {
    dispatch(removeEntry(buc.caseId!, {
      sedId,
      sedType: 'P5000'
    } as LocalStorageEntry<P5000SED>))
  }

  // select which P5000 SEDs we want to see
  const getP5000 = (buc: Buc): Seds | undefined => {
    if (!buc.seds) {
      return undefined
    }
    return buc.seds
      .filter(sedFilter)
      .filter((sed: Sed) => sed.type === 'P5000' && sed.status !== 'cancelled')
  }

  const onBackClick = () => {
    dispatch(resetSentP5000info())
    setMode('bucedit', 'back')
  }

  const renderBackLink = () => (
    <div style={{display: 'inline-block'}}>
      <Button
        variant='secondary'
        onClick={onBackClick}
      >
        <BackFilled/>
        <HorizontalSeparatorDiv size='0.25'/>
        <span>
          {t('ui:back')}
        </span>
      </Button>
    </div>
  )

  const changeActiveSed = (sed: Sed, checked: boolean): void => {
    let newActiveSeds: Seds = _.cloneDeep(_activeSeds)
    if (checked) {
      newActiveSeds = newActiveSeds.concat(sed)
    } else {
      newActiveSeds = _.filter(newActiveSeds, s => s.id !== sed.id)
    }
    updateActiveSeds(newActiveSeds)
  }

  const getEmptyPeriodsReport = (): EmptyPeriodsReport => {
    const res: EmptyPeriodsReport = {}
    _activeSeds.forEach((sed: Sed) => {
      res[sed.id] = p5000FromRinaMap[sed.id]?.pensjon?.medlemskapAnnen?.length > 0
    })
    return res
  }

  const hasEmptyPeriods = (emptyPeriodsReport: EmptyPeriodsReport): boolean => {
    return Object.values(emptyPeriodsReport).indexOf(true) >= 0
  }

  // const sedSender: SedSender | undefined = mainSed ? getSedSender(mainSed) as SedSender : undefined
  const emptyPeriodReport: EmptyPeriodsReport = getEmptyPeriodsReport()
  const warning = hasEmptyPeriods(emptyPeriodReport)


  // this effect checks if we need to load seds, when buc/sed/context changes
  useEffect(() => {
    const seds = getP5000(buc)
    _setSeds(seds)
    // which Seds we do NOT have on cache? Load them.
    const cachedSedIds: Array<string> = Object.keys(p5000FromRinaMap)
    const notloadedSeds: Seds = _.filter(seds, sed => cachedSedIds.indexOf(sed.id) < 0)
    if (!_.isEmpty(notloadedSeds)) {
      _setReady(false)
      _setFetchingP5000(notloadedSeds)
      notloadedSeds.forEach(sed => dispatch(getSed(buc.caseId!, sed)))
    } else {
      if (seds) {
        updateActiveSeds(seds)
      }
      _setFetchingP5000(undefined)
      _setReady(true)
    }
  }, [buc, context])

  useEffect(() => {
    if (!_ready && _.isArray(_fetchingP5000)) {
      if (!_.isEmpty(_fetchingP5000)) {
        // update _fetchingP5000 with new cached info from p5000FromRinaMap
        const cachedSedIds = Object.keys(p5000FromRinaMap)
        const notloadedSeds: Seds = _.filter(_seds, sed => cachedSedIds.indexOf(sed.id) < 0)
        if (!_.isEmpty(notloadedSeds)) {
          _setFetchingP5000(notloadedSeds)
        } else {
          if (!_.isNil(_seds)) {
            updateActiveSeds(_seds)
          }
          _setFetchingP5000(undefined)
          _setReady(true)
        }
      } else {
        if (!_.isNil(_seds)) {
          updateActiveSeds(_seds)
        }
        _setFetchingP5000(undefined)
        _setReady(true)
      }
    }
  }, [_fetchingP5000, p5000FromRinaMap])

  if (!_ready) {
    return (
      <SpinnerDiv>
        <WaitingPanel />
      </SpinnerDiv>
    )
  }

  return (
    <div key={_seds?.map(s => s.id).join(',')}>
      <Row>
        <Column>
          <PileDiv>
            <BodyLong>
              {t('p5000:active-seds')}:
            </BodyLong>
            <VerticalSeparatorDiv size='0.5' />
            {_seds?.map(sed => (
              <Checkbox
                data-test-id={'a-buc-c-P5000overview__checkbox-' + sed.id}
                checked={_.find(_activeSeds, s => s.id === sed.id) !== undefined}
                key={'a-buc-c-P5000overview__checkbox-' + sed.id}
                id={'a-buc-c-P5000overview__checkbox-' + sed.id}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeActiveSed(sed, e.target.checked)}
              >
                {getLabel(sed)}
              </Checkbox>
            ))}
          </PileDiv>
        </Column>
        <Column>
          {warning && (
            <Alert variant='warning'>
              {t('buc:form-P5000-warning')}
            </Alert>
          )}
        </Column>
      </Row>
      <VerticalSeparatorDiv size='3' />
      {renderBackLink()}
      <VerticalSeparatorDiv size='2' />
      <P5000DragAndDropContext
        tables={_tables}
        setTables={_setTables}
        setPlaceholderProps={setPlaceholderProps}
      >
        <P5000Droppable placeholderProps={placeholderProps}>
          {_tables.map((table: any, index: number): JSX.Element => {
            if ((table.id === 'P5000Edit' && context !== 'overview' && featureToggles.P5000_SUMMER_VISIBLE) ||
              (table.id === 'P5000Sum' && featureToggles.P5000_SUMMER_VISIBLE) ||
              (table.id === 'P5000Overview')
            ) {
              return (
                <>
                  <P5000Draggable table={table} index={index}/>
                  <VerticalSeparatorDiv size='2'/>
                </>
              )
            } else {
              return <div/>
            }
          })}
        </P5000Droppable>
      </P5000DragAndDropContext>
    </div>
  )
}

export default P5000
