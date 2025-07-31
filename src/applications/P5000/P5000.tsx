import { Box, Heading, HStack, Panel } from '@navikt/ds-react'
import { saveEntries } from 'src/actions/localStorage'
import { getP5000FromS3, getSed, resetSentP5000info } from 'src/actions/p5000'
import { getWorkingCopy, updateP5000WorkingCopies } from 'src/applications/P5000/utils/entriesUtils'
import P5000Controls from 'src/applications/P5000/P5000Controls'
import { SpinnerDiv } from 'src/components/StyledComponents'
import WaitingPanel from 'src/components/WaitingPanel/WaitingPanel'
import { BUCMode, LocalStorageEntriesMap, FeatureToggles, LocalStorageEntry } from 'src/declarations/app'
import { Buc, Sed, Seds } from 'src/declarations/buc'
import { EmptyPeriodsReport, P5000sFromRinaMap, P5000SED, P5000ListRows } from 'src/declarations/p5000'
import { State } from 'src/declarations/reducers'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import P5000Edit from 'src/applications/P5000/tables/P5000Edit'
import P5000Overview from 'src/applications/P5000/tables/P5000Overview'
import P5000SedLabel from 'src/applications/P5000/components/P5000SedLabel'
import P5000Sum from 'src/applications/P5000/tables/P5000Sum'

export interface P5000Props {
  buc: Buc
  mainSed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

export interface P5000Selector {
  featureToggles: FeatureToggles
  p5000sFromRinaMap: P5000sFromRinaMap
  p5000FromS3: Array<P5000ListRows> | null | undefined
  gettingP5000FromS3: boolean
  storageEntries: LocalStorageEntriesMap<P5000SED>
  personPdl?: any // Add personPdl to selector
}

const mapState = (state: State): P5000Selector => ({
  featureToggles: state.app.featureToggles,
  p5000sFromRinaMap: state.p5000.p5000sFromRinaMap,
  p5000FromS3: state.p5000.p5000sFromS3,
  gettingP5000FromS3: state.loading.gettingP5000FromS3,
  storageEntries: state.localStorage.entries as LocalStorageEntriesMap<P5000SED>,
  personPdl: state.person.personPdl // Add personPdl
})

interface TableData {
  id: string
  activeSeds: Seds
  p5000WorkingCopies: Array<LocalStorageEntry<P5000SED>>
}

const P5000: React.FC<P5000Props> = ({
  buc,
  mainSed = undefined,
  setMode
}: P5000Props): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { p5000sFromRinaMap, p5000FromS3, storageEntries, personPdl }: P5000Selector = useSelector<State, P5000Selector>(mapState)

  // Extract fnr from personPdl
  const fnr = personPdl?.identer?.find((i: any) => i.gruppe === 'FOLKEREGISTERIDENT')?.ident

  /* which seds should be visible */
  const [_activeSeds, _setActiveSeds] = useState<Seds>([])
  /* are we fetching P5000s from RINA */
  const [_fetchingP5000, _setFetchingP5000] = useState<Seds | undefined>(undefined)
  /* are we fetching P5000s from S3 */
  const [_fetchingP5000FromS3, _setFetchingP5000FromS3] = useState<boolean>(false)
  /* are we ready to show the page */
  const [_readyFromRINA, _setReadyFromRINA] = useState<boolean>(false)
  const [_readyFromS3, _setReadyFromS3] = useState<boolean>(false)
  const [_ready, _setReady] = useState<boolean>(false)
  /* SEDs that will be used for the P5000 page */
  const [_seds, _setSeds] = useState<Seds | undefined>(undefined)
  /* Generate a report on SEDs with empty membership, should be a warning */
  const [_emptyPeriodReport, _setEmptyPeriodReport] = useState<EmptyPeriodsReport>({})
  /* cached renders of tables - order may change with the drag&drop */
  const [_tables, _setTables] = useState<Array<TableData>>(() => (
    [
      {id: 'P5000Edit', activeSeds: [], p5000WorkingCopies: []},
      {id: 'P5000Sum', activeSeds: [], p5000WorkingCopies: []},
      {id: 'P5000Overview', activeSeds: [], p5000WorkingCopies: []}
    ]
  ))

  /* working copies from all P5000s for this BUC
   * fill it initially with the info from local storage, then let's update the state to keep latest
   * working copy fresh when tables change, and use local storage for initial load / backup when token expires
   **/
  const [_p5000WorkingCopies, _setP5000WorkingCopies] = useState<Array<LocalStorageEntry<P5000SED>>>(() => storageEntries?.[buc.caseId!] ?? [])

  const updateEmptyPeriodsReport = (activeSeds: Seds) => {
    const res: EmptyPeriodsReport = {}
    // @ts-ignore
    activeSeds.forEach((sed: Sed) => (res[sed.id] = p5000sFromRinaMap[sed.id]?.pensjon?.medlemskapAnnen?.length > 0))
    _setEmptyPeriodReport(res)
  }

  const renderP5000EditHeader = () => {
    if (!mainSed) return null
    return (
      <HStack
        align="center"
      >
        <Heading size='small' style={{ display: 'flex' }}>
          {t('p5000:edit-title')}
        </Heading>
{/*        <HorizontalSeparatorDiv />
        -
        <HorizontalSeparatorDiv />*/}
        <Box paddingInline="4 4">
          -
        </Box>
        <P5000SedLabel sed={mainSed} />
      </HStack>
    )
  }

  const renderP5000EditContent = (p5000WorkingCopies: Array<LocalStorageEntry<P5000SED>>) => {
    if (!mainSed) return null
    const p5000WorkingCopyEntry: LocalStorageEntry<P5000SED> | undefined = getWorkingCopy(p5000WorkingCopies, mainSed.id)
    return (
      <P5000Edit
        caseId={buc.caseId!}
        onBackClick={onBackClick}
        p5000sFromRinaMap={p5000sFromRinaMap}
        p5000WorkingCopy={p5000WorkingCopyEntry}
        updateWorkingCopy={updateWorkingCopy}
        mainSed={mainSed}
      />
    )
  }

  const renderP5000SumHeader = () => (
    <Heading size='small'>
      {t('p5000:summary-title')}
    </Heading>
  )

  const renderP5000SumContent = (activeSeds: Seds, p5000WorkingCopies: Array<LocalStorageEntry<P5000SED>>) => {
    if (!mainSed) return null
    let p5000WorkingCopyEntry: LocalStorageEntry<P5000SED> | undefined
    if (mainSed) {
      p5000WorkingCopyEntry = getWorkingCopy(p5000WorkingCopies, mainSed?.id)
    }
    return (
      <P5000Sum
        p5000sFromRinaMap={p5000sFromRinaMap}
        p5000WorkingCopy={p5000WorkingCopyEntry}
        updateWorkingCopy={updateWorkingCopy}
        mainSed={mainSed}
      />
    )
  }

  const renderP5000OverviewHeader = () => (
    <Heading size='small'>
      {t('p5000:overview-title')}
    </Heading>
  )

  const renderP5000OverviewContent = (activeSeds: Seds, p5000WorkingCopies: Array<LocalStorageEntry<P5000SED>>) => {
    return (
      <P5000Overview
        fnr={fnr}
        caseId={buc.caseId!}
        p5000sFromRinaMap={p5000sFromRinaMap}
        p5000WorkingCopies={p5000WorkingCopies}
        p5000FromS3={p5000FromS3}
        seds={activeSeds}
      />
    )
  }

  const updateActiveSeds = (seds: any) => {
    _setActiveSeds(seds)
    updateEmptyPeriodsReport(seds)
    // only 'P5000Sum' and 'P5000Overview' are affected by changes in activeSeds
    updateTables(seds, _p5000WorkingCopies)
  }

  const renderTableContent = ({ id, activeSeds, p5000WorkingCopies }: TableData) => {
    if (id === 'P5000Edit') return renderP5000EditContent(p5000WorkingCopies)
    if (id === 'P5000Sum') return renderP5000SumContent(activeSeds, p5000WorkingCopies)
    if (id === 'P5000Overview') return renderP5000OverviewContent(activeSeds, p5000WorkingCopies)
    return null
  }

  const renderTableHeader = (id: string) => {
    if (id === 'P5000Edit') return renderP5000EditHeader()
    if (id === 'P5000Sum') return renderP5000SumHeader()
    if (id === 'P5000Overview') return renderP5000OverviewHeader()
    return null
  }

  const updateTables = (activeSeds: Seds, p5000WorkingCopies: Array<LocalStorageEntry>) => {
    const newTables = _tables.map(t => {
      return ({
        id: t.id,
        activeSeds,
        p5000WorkingCopies
      })
    })
    _setTables(newTables)
  }

  const updateWorkingCopy = (newSed: P5000SED | undefined, sedId: string): void => {
    const newP5000WorkingCopies: Array<LocalStorageEntry<P5000SED>> = updateP5000WorkingCopies(_p5000WorkingCopies, newSed, sedId)
    // Set the local working copies
    _setP5000WorkingCopies(newP5000WorkingCopies)
    // render tables with new changes
    updateTables(_activeSeds, newP5000WorkingCopies)
    // make a local storage backup of the updated working copies
    dispatch(saveEntries(buc.caseId!, newP5000WorkingCopies))
  }

  const onBackClick = () => {
    dispatch(resetSentP5000info())
    setMode('bucedit', 'back')
  }

  const changeActiveSeds = (sed: Sed, checked: boolean): void => {
    let newActiveSeds: Seds = _.cloneDeep(_activeSeds)
    newActiveSeds = checked ? newActiveSeds.concat(sed) : _.reject(newActiveSeds, s => s.id === sed.id)
    updateActiveSeds(newActiveSeds)
  }

  /** check if we need to load SEDs from RINA, when buc changes; send the dispatches */
  useEffect(() => {
    // select which P5000 SEDs we want to see
    const seds = buc.seds?.filter((sed: Sed) => sed.type === 'P5000' && sed.status !== 'cancelled' && sed.status !== 'empty')
    _setSeds(seds)
    // which Seds we do NOT have on cache? Load them.
    const cachedSedIds: Array<string> = Object.keys(p5000sFromRinaMap)
    const notloadedSeds: Seds = _.filter(seds, sed => cachedSedIds.indexOf(sed.id) < 0)
    if (!_.isEmpty(notloadedSeds)) {
      _setReadyFromRINA(false)
      _setFetchingP5000(notloadedSeds)
      notloadedSeds.forEach(sed => dispatch(getSed(buc.caseId!, sed)))
    } else {
      updateActiveSeds(seds)
      _setFetchingP5000(undefined)
      _setReadyFromRINA(true)
    }
  }, [buc])

  /** check if we are ready, as in, we loaded all necessary SEDs from RINA */
  useEffect(() => {
    if (!_readyFromRINA && _.isArray(_fetchingP5000)) {
      if (!_.isEmpty(_fetchingP5000)) {
        // update _fetchingP5000 with new cached info from p5000sFromRinaMap
        const cachedSedIds = Object.keys(p5000sFromRinaMap)
        const notloadedSeds: Seds = _.filter(_seds, sed => cachedSedIds.indexOf(sed.id) < 0)
        if (!_.isEmpty(notloadedSeds)) {
          _setFetchingP5000(notloadedSeds)
        } else {
          if (!_.isNil(_seds)) {
            updateActiveSeds(_seds)
          }
          _setFetchingP5000(undefined)
          _setReadyFromRINA(true)
        }
      } else {
        if (!_.isNil(_seds)) {
          updateActiveSeds(_seds)
        }
        _setFetchingP5000(undefined)
        _setReadyFromRINA(true)
      }
    }
  }, [_readyFromRINA, p5000sFromRinaMap])

  useEffect(() => {
    _setFetchingP5000FromS3(true)
    dispatch(getP5000FromS3(fnr!, buc.caseId!))
  }, [])

  useEffect(() => {
    if (_fetchingP5000FromS3 && !_.isUndefined(p5000FromS3)) {
      _setReadyFromS3(true)
    }
  }, [_fetchingP5000FromS3, p5000FromS3])

  useEffect(() => {
    if (!_ready && _readyFromRINA && _readyFromS3) { _setReady(true) }
  }, [_ready, _readyFromRINA, _readyFromS3])

  if (!_ready) {
    const cachedSedIds = Object.keys(p5000sFromRinaMap)
    const loadedSeds: number = _.filter(_seds, sed => cachedSedIds.indexOf(sed.id) >= 0)?.length ?? 0
    return (
      <SpinnerDiv>
        <WaitingPanel message={t('p5000:loading-sed-X-of-Y', { x: loadedSeds, y: _seds?.length ?? 0 })} />
      </SpinnerDiv>
    )
  }

  return (
    <div key={_seds?.map(s => s.id).join(',')}>
      <P5000Controls
        emptyPeriodReport={_emptyPeriodReport}
        seds={_seds}
        activeSeds={_activeSeds}
        changeActiveSeds={changeActiveSeds}
        onBackClick={onBackClick}
      />
      <Box paddingBlock="8 0">
        {_tables.map((table: any, index: number): JSX.Element => {
          if ((table.id === 'P5000Edit' && !_.isNil(mainSed)) ||
            ((table.id === 'P5000Sum') && !_.isNil(mainSed)) ||
            (table.id === 'P5000Overview')
          ) {
            return (
              <div key={table.id}>
                <Box paddingBlock="0 8">
                  <Panel border>
                    {renderTableHeader(table.id)}
                    <Box paddingBlock="8 0">
                      {renderTableContent(table)}
                    </Box>
                  </Panel>
                </Box>
              </div>
            )
          } else {
            return <div key={"table-empty-" + index}/>
          }
        })}
      </Box>
    </div>
  )
}

export default P5000
