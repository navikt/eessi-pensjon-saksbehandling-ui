import {BodyLong, Tabs, Tag, SortState, Box, HStack, Alert, VStack, Spacer} from '@navikt/ds-react'
import { StarIcon } from '@navikt/aksel-icons';
import CountryData from '@navikt/land-verktoy'
import Table, {
  ChangedRowValues,
  Column,
  ColumnAlign,
  ItemErrors,
  RenderEditableOptions,
  RenderOptions
} from '@navikt/tabell'
import { informasjonOmBeregning, ordning, relevantForYtelse, typePeriode } from 'src/applications/P5000/P5000.labels'
import { P5000ForS3 } from 'src/applications/P5000/utils/pesysUtils'
import { FeatureToggles, LocalStorageEntry } from 'src/declarations/app'
import {Sed, Seds} from 'src/declarations/buc'
import {
  P5000sFromRinaMap,
  P5000ListRow,
  P5000SED,
  P5000SourceStatus,
  P5000ListRows,
  P5000TableContext
} from 'src/declarations/p5000'
import { State } from 'src/declarations/reducers'
import _ from 'lodash'
import moment from 'moment'
import PT from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { convertP5000SEDToP5000ListRows, mergeP5000ListRows } from 'src/applications/P5000/utils/conversion'
import P5000OverviewControls from './P5000OverviewControls'
import PopoverCustomized from "src/components/Tooltip/PopoverCustomized";
import HiddenDiv from "src/components/HiddenDiv/HiddenDiv";
import HorizontalLineSeparator from "src/components/HorizontalLineSeparator/HorizontalLineSeparator";

export interface P5000OverviewSelector {
  featureToggles: FeatureToggles
}

export interface P5000OverviewProps {
  fnr: string // renamed from aktoerId
  caseId: string
  p5000sFromRinaMap: P5000sFromRinaMap
  p5000FromS3: Array<P5000ListRows> | null | undefined
  p5000WorkingCopies: Array<LocalStorageEntry<P5000SED>> | undefined
  seds: Seds
  mainSed: Sed | undefined
}

const mapState = (state: State): P5000OverviewSelector => ({
  featureToggles: state.app.featureToggles
})

const P5000Overview: React.FC<P5000OverviewProps> = ({
  fnr, caseId, p5000sFromRinaMap, p5000WorkingCopies, p5000FromS3, seds, mainSed
}: P5000OverviewProps) => {
  const { t } = useTranslation()
  const componentRef = useRef(null)
  const countryInstance = CountryData.getCountryInstance('nb')

  const [pagination, setPagination] = useState<boolean>(true)
  const [itemsPerPage, setItemsPerPage] = useState<number>(30)
  const [renderPrintTable, setRenderPrintTable] = useState<boolean>(false)
  const [mergePeriods, setMergePeriods] = useState<boolean>(false)
  const [mergePeriodTypes, setMergePeriodTypes] = useState<Array<string> | undefined>(undefined)
  const [mergePeriodBeregnings, setMergePeriodBeregnings] = useState<Array<string> | undefined>(undefined)
  const [useGermanRules, setUseGermanRules] = useState<boolean>(true)
  const [_activeTab, setActiveTab] = useState<string>('oversikt')
  const [_tableSort, _setTableSort] = useState<SortState>(() => ({ orderBy: '', direction: 'none' }))
  const [items]: [P5000ListRows, P5000SourceStatus] = convertP5000SEDToP5000ListRows({
    seds,
    p5000sFromRinaMap,
    p5000WorkingCopy: p5000WorkingCopies,
    mergePeriods,
    mergePeriodTypes,
    mergePeriodBeregnings,
    useGermanRules,
    selectRowsContext: 'forAll'
  })

  /** initial items for pesys:
   * 1) all items minus the 000 beregning
   * 2) do show but do not edit Norwegian periods
    */

  // this will be updated with changes made to the startdato/sluttdato
  const [itemsForPesys, _setItemsForPesys] = useState<P5000ListRows>(() =>
    items
      .map(item => ({
        ...item,
        selectDisabled: item.land === 'NO',
        editDisabled: item.land === 'NO',
        rowError: !item.startdato || !item.sluttdato,
        selected: _.find(p5000FromS3, (it: P5000ForS3) => {
          return it.land === item.land &&
            it.acronym === item.acronym &&
            it.type === item.type &&
            it.startdato === moment(item.startdato).format('YYYY-MM-DD') &&
            it.sluttdato === moment(item.sluttdato).format('YYYY-MM-DD') &&
            it.ytelse === item.ytelse &&
            it.ordning === item.ordning &&
            it.beregning === item.beregning
        }) !== undefined
      }))
  )

  // same, but for view and filtered items for pesys as the merging periods process "destroys" the original rows
  // plus, it should use changed startdato/sluttdato periods
  const [viewItemsForPesys, _setViewItemsForPesys] = useState<P5000ListRows>(() => itemsForPesys)
  const [filteredItemsForPesys, _setFilteredItemsForPesys] = useState<P5000ListRows>(() => viewItemsForPesys)

  const [alertMessage, _setAlertMessage] = useState<string>("")
  const [_rowErrorTagMessage, _setRowErrorTagMessage] = useState<string>("")
  const [_rowErrorAlertMessage, _setRowErrorAlertMessage] = useState<string>("")


  // all subsequent updates on items for pesys should update viewing-only rows and filtered items for pesys
  // with merging modification
  const setItemsForPesys = (newItemsForPesys: P5000ListRows) => {
    let newViewItemsForPesys = _.cloneDeep(newItemsForPesys)
    let newFilteredItemsForPesys = _.cloneDeep(newViewItemsForPesys)
    if (mergePeriods) {
      newViewItemsForPesys = mergeP5000ListRows({
        rows: newViewItemsForPesys, mergePeriodTypes, mergePeriodBeregnings, useGermanRules
      })

      const mergedPeriods = newViewItemsForPesys.filter((it: P5000ListRow) => it.parentKey !== undefined && it.hasSubrows !== true)
      _setAlertMessage(
        mergedPeriods.length > 0 ?
          mergedPeriods.length + " rader ble slått sammen"
          : "Ingen rader ble slått sammen"
      )

      newFilteredItemsForPesys = _.filter(_.cloneDeep(newViewItemsForPesys), (it: P5000ListRow) => it.parentKey === undefined)
    }

    _setItemsForPesys(newItemsForPesys)
    _setViewItemsForPesys(newViewItemsForPesys)
    _setFilteredItemsForPesys(newFilteredItemsForPesys)
  }

  // any change in merging options should refresh viewItemsForPesys based on itemsForPesys
  // and newFilteredItemsForPesys based on viewItemsForPesys
  useEffect(() => {
    let newViewItemsForPesys = _.cloneDeep(itemsForPesys)
    let newFilteredItemsForPesys = _.cloneDeep(newViewItemsForPesys)
    if (mergePeriods) {
      newViewItemsForPesys = mergeP5000ListRows({
        rows: newViewItemsForPesys, mergePeriodTypes, mergePeriodBeregnings, useGermanRules
      })
      newFilteredItemsForPesys = _.filter(_.cloneDeep(newViewItemsForPesys), (it: P5000ListRow) => it.parentKey === undefined)
    }

    _setViewItemsForPesys(newViewItemsForPesys)
    _setFilteredItemsForPesys(newFilteredItemsForPesys)
  }, [mergePeriods, mergePeriodTypes, mergePeriodBeregnings, useGermanRules])

  // Use refs to track previous values and avoid infinite loops
  const prevItemsRef = useRef<P5000ListRows>([])
  const prevP5000FromS3Ref = useRef<Array<P5000ListRows> | null | undefined>(undefined)

  // Update itemsForPesys when items change (when active SEDs change)
  useEffect(() => {
    // Only update if items or p5000FromS3 actually changed
    const itemsChanged = !_.isEqual(items, prevItemsRef.current)
    const p5000FromS3Changed = !_.isEqual(p5000FromS3, prevP5000FromS3Ref.current)

    if (!itemsChanged && !p5000FromS3Changed) {
      return
    }

    const newItemsForPesys = items
      .map(item => {
        // Find if this item was previously in itemsForPesys
        const existingItem = _.find(itemsForPesys, (existing: P5000ListRow) => existing.key === item.key)

        // If item exists in current itemsForPesys, preserve its current selection state
        // If item is new (from newly selected SED), check against S3 data for initial selection
        const selected = existingItem !== undefined
          ? existingItem.selected
          : _.find(p5000FromS3, (it: P5000ForS3) => {
              return it.land === item.land &&
                it.acronym === item.acronym &&
                it.type === item.type &&
                it.startdato === moment(item.startdato).format('YYYY-MM-DD') &&
                it.sluttdato === moment(item.sluttdato).format('YYYY-MM-DD') &&
                it.ytelse === item.ytelse &&
                it.ordning === item.ordning &&
                it.beregning === item.beregning
            }) !== undefined

        const rowError = !item.startdato || !item.sluttdato

        return {
          ...item,
          selectDisabled: item.land === 'NO',
          editDisabled: item.land === 'NO',
          rowError,
          selected
        }
      })

    // Update refs for next comparison
    prevItemsRef.current = items
    prevP5000FromS3Ref.current = p5000FromS3

    setItemsForPesys(newItemsForPesys)

  }, [items, p5000FromS3])

  useEffect(() => {
    const hasRowErrors = _.find(itemsForPesys, (it: P5000ListRow) => it.rowError)
    const hasSelectedRowWithErrors = _.find(itemsForPesys, (it: P5000ListRow) => it.rowError && it.selected)

    if(hasRowErrors) {
      _setRowErrorTagMessage(t('p5000:error-has-rowerrors'))
    } else {
      _setRowErrorTagMessage("")
    }

    if(hasSelectedRowWithErrors){
      _setRowErrorAlertMessage(t('p5000:error-selected-row-with-errors'))
    } else {
      _setRowErrorAlertMessage("")
    }


  }, [itemsForPesys])

  useEffect(() => {
    if(!mergePeriods) {
      _setAlertMessage("")
    }
  }, [mergePeriods])

  const [pesysWarning] = useState<string | undefined>(() =>
    (items.length !== itemsForPesys.length ? t('p5000:warning-beregning-000', { x: (items.length - itemsForPesys.length) }) : undefined))

  const { featureToggles }: P5000OverviewSelector = useSelector<State, P5000OverviewSelector>(mapState)

  const renderStartdato = ({ item, value }: RenderEditableOptions<P5000ListRow, P5000TableContext, string> | RenderOptions<P5000ListRow, P5000TableContext, string>) => (
    <HStack gap="1">
      <BodyLong>{_.isDate(value) ? moment(value).format('DD.MM.YYYY') : value}</BodyLong>
      {item?.options?.startdatoModified && (<StarIcon fontSize="1.5rem" color="red" />)}
    </HStack>
  )

  const renderSluttdato = ({ item, value }: RenderEditableOptions<P5000ListRow, P5000TableContext, string> | RenderOptions<P5000ListRow, P5000TableContext, string>) => (
    <HStack gap="1">
      <BodyLong>{_.isDate(value) ? moment(value).format('DD.MM.YYYY') : value}</BodyLong>
      {item?.options?.sluttdatoModified && (<StarIcon fontSize="1.5rem" color="red" />)}
    </HStack>
  )

  const renderType = ({ value }: RenderEditableOptions<P5000ListRow, P5000TableContext, string> | RenderOptions<P5000ListRow, P5000TableContext, string>) => (
    <PopoverCustomized
      label={(
        <div style={{ maxWidth: '300px' }}>
          {value ? _.get(typePeriode, value) : ''}
        </div>
      )}
    >
      <BodyLong>
        {value}
      </BodyLong>
    </PopoverCustomized>
  )

  const renderYtelse = ({ value }: RenderEditableOptions<P5000ListRow, P5000TableContext, string> | RenderOptions<P5000ListRow, P5000TableContext, string>) => (
    <PopoverCustomized
      label={(
        <div style={{ maxWidth: '300px' }}>
          {value ? _.get(relevantForYtelse, value) : ''}
        </div>
      )}
    >
      <BodyLong>
        {value}
      </BodyLong>
    </PopoverCustomized>
  )

  const renderBeregning = ({ value }: RenderEditableOptions<P5000ListRow, P5000TableContext, string> | RenderOptions<P5000ListRow, P5000TableContext, string>) => (
    <PopoverCustomized
      label={(
        <div style={{ maxWidth: '300px' }}>
          {value ? _.get(informasjonOmBeregning, value) : ''}
        </div>
      )}
    >
      <BodyLong>
        {value}
      </BodyLong>
    </PopoverCustomized>
  )

  const renderOrdning = ({ value }: RenderEditableOptions<P5000ListRow, P5000TableContext, string> | RenderOptions<P5000ListRow, P5000TableContext, string>) => (
    <PopoverCustomized
      label={(
        <div style={{ maxWidth: '300px' }}>
          {value ? _.get(ordning, value) : ''}
        </div>
      )}
    >
      <BodyLong>
        {value}
      </BodyLong>
    </PopoverCustomized>
  )

  const renderCell = ({ value }: RenderEditableOptions<P5000ListRow, P5000TableContext, string>) => (
    <BodyLong>{value}</BodyLong>
  )

  const renderDag = ({ item }: RenderEditableOptions<P5000ListRow, P5000TableContext, string> | RenderOptions<P5000ListRow, P5000TableContext, string>) => (
    <BodyLong>{(item?.dag === '' || item?.dag === '0') ? '' : item?.dag + '/' + item?.dagtype}</BodyLong>
  )

  const renderStatus = ({ value }: RenderOptions<P5000ListRow, P5000TableContext, string>) => {
    if (value === 'rina') {
      return <Tag size='small' variant='info'>RINA</Tag>
    }
    if (value === 'new') {
      return <Tag size='small' variant='success'>Ny</Tag>
    }
    if (value === 'edited') {
      return <Tag size='small' variant='warning'>Endret</Tag>
    }
    return <div />
  }

  const renderLand = ({ value }: RenderEditableOptions<P5000ListRow, P5000TableContext, string> | RenderOptions<P5000ListRow, P5000TableContext, string>) => {
    if (_.isEmpty(value)) {
      return <div>-</div>
    }
    return <div>{countryInstance.findByValue(value)?.label}</div>
  }

  const renderAcronym = ({ item, value }: RenderEditableOptions<P5000ListRow, P5000TableContext, string> | RenderOptions<P5000ListRow, P5000TableContext, string>) => (
    <HStack gap="1">
      <BodyLong>{value}</BodyLong>
      {item?.options?.acronymModified && (<StarIcon fontSize="1.5rem" color="red" />)}
    </HStack>
  )

  let columns: Array<Column<P5000ListRow, P5000TableContext>> = [
    { id: 'status', label: t('ui:status'), type: 'string', render: renderStatus },
    { id: 'land', label: t('ui:country'), type: 'string', render: renderLand, edit: { render: renderLand } },
    { id: 'acronym', label: t('ui:_institution'), type: 'string', render: renderAcronym },
    { id: 'type', label: t('ui:type'), type: 'string', align: 'center' as ColumnAlign, render: renderType, edit: { render: renderType } },
    {
      id: 'startdato',
      label: t('ui:startDate'),
      type: 'date',
      render: renderStartdato
    },
    {
      id: 'sluttdato',
      label: t('ui:endDate'),
      type: 'date',
      render: renderSluttdato
    },
    { id: 'aar', label: t('ui:year'), type: 'string', align: 'center' as ColumnAlign, edit: { render: renderCell } },
    { id: 'mnd', label: t('ui:month'), type: 'string', align: 'center' as ColumnAlign, edit: { render: renderCell } },
    {
      id: 'dag',
      label: t('ui:days') + '/' + t('ui:unit'),
      align: 'center',
      type: 'string',
      render: renderDag,
      edit: { render: renderDag }
    },
    { id: 'ytelse', label: t('ui:relevantForPerformance'), type: 'string', align: 'center' as ColumnAlign, render: renderYtelse, edit: { render: renderYtelse } },
    { id: 'ordning', label: t('ui:scheme'), type: 'string', align: 'center' as ColumnAlign, render: renderOrdning, edit: { render: renderOrdning } },
    { id: 'beregning', label: t('ui:calculationInformation'), type: 'string', align: 'center' as ColumnAlign, render: renderBeregning, edit: { render: renderBeregning } }
  ]


  if (_activeTab === 'pesys') {
    columns.splice(0, 1) // remove status column for 'see P5000' button press, or for Pesys export view
    columns = columns.concat({
      id: 'buttons',
      label: '',
      type: 'buttons'
    })
  }

  const onRowSelectChange = (selectedItems: P5000ListRows) => {
    let newItemsForPesys: P5000ListRows = _.cloneDeep(itemsForPesys)
    newItemsForPesys = newItemsForPesys.map(item => {
      const newItem = _.cloneDeep(item)
      const found: boolean = _.find(selectedItems, (it: P5000ListRow) => it.key === newItem.key) !== undefined
      newItem.selected = found
      return newItem
    })
    setItemsForPesys(newItemsForPesys)
  }

  const onRowsChanged = (itemsForPesys: P5000ListRows) => {
    setItemsForPesys(itemsForPesys)
  }

  const beforeRowEdited = (item: P5000ListRow, context: P5000TableContext | undefined, changedRowValues: ChangedRowValues | undefined): ItemErrors | undefined => {
    if (_.has(changedRowValues, 'startdato')) {
      _.set(item, 'options.startdatoModified', true)
    }
    if (_.has(changedRowValues, 'sluttdato')) {
      _.set(item, 'options.sluttdatoModified', true)
    }
    if (_.has(changedRowValues, 'acronym')) {
      _.set(item, 'options.acronymModified', true)
    }
    return undefined
  }

  return (
    <>
      <Box paddingBlock="4 0">
        <P5000OverviewControls
          fnr={fnr}
          caseId={caseId}
          p5000FromS3={p5000FromS3}
          componentRef={componentRef}
          mergePeriods={mergePeriods}
          setMergePeriods={setMergePeriods}
          mergePeriodTypes={mergePeriodTypes}
          setMergePeriodTypes={setMergePeriodTypes}
          mergePeriodBeregnings={mergePeriodBeregnings}
          setMergePeriodBeregnings={setMergePeriodBeregnings}
          setRenderPrintTable={setRenderPrintTable}
          useGermanRules={useGermanRules}
          setUseGermanRules={setUseGermanRules}
          pagination={pagination}
          setPagination={setPagination}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          items={items}
          itemsForPesys={filteredItemsForPesys}
          pesysWarning={pesysWarning}
          currentTabKey={_activeTab}
          hideSendToPesysButton={!!mainSed}
        />
      </Box>
      <HorizontalLineSeparator />
      <Tabs
        onChange={setActiveTab} defaultValue={_activeTab}
        style={{ paddingTop: '1rem' }}
      >
        <Tabs.List>
          <Tabs.Tab label='Oversikt' value='oversikt' />
          {featureToggles.P5000_UPDATES_VISIBLE && !mainSed &&
            <Tabs.Tab
              label='Eksporter til Pesys'
              value='pesys'
              data-testid="export-to-pesys-tab"
            />
          }
        </Tabs.List>
        <Tabs.Panel value='oversikt'>
          { alertMessage &&
            <Box paddingBlock="4 4">
              <Alert variant='info'>
                {alertMessage}
              </Alert>
            </Box>
          }
          <Box paddingBlock="4 4">
            <Table<P5000ListRow, P5000TableContext>
              animatable={false}
              items={items}
              id='P5000Overview'
              labels={{
                filter: t('p5000:filter-label'),
                flagged: '',
                flagAll: t('message:warning-periodsDoNotMatch'),
                merged: t('p5000:merged-periods')
              }}
              flaggable={_.find(items, 'flag') !== undefined}
              searchable={false}
              selectable={false}
              sortable={true}
              subrowsIcon='merge'
              onColumnSort={(sort: any) => {
                _setTableSort(sort)
              }}
              itemsPerPage={itemsPerPage}
              columns={columns}
              pagination={ pagination }
            />
          </Box>
        </Tabs.Panel>
        <Tabs.Panel value='pesys'>
          <VStack gap="4" paddingBlock="4 4">
            { alertMessage &&
              <Alert variant='info'>
                {alertMessage}
              </Alert>
            }
            { _rowErrorTagMessage && !_rowErrorAlertMessage &&
              <HStack>
                <Spacer/>
                <Tag variant='error'>
                  {_rowErrorTagMessage}
                </Tag>
              </HStack>
            }
            { _rowErrorAlertMessage &&
              <Alert variant='error'>
                {_rowErrorAlertMessage}
              </Alert>
            }
          </VStack>
          <Box paddingBlock="4 4">
            <Table<P5000ListRow, P5000TableContext>
              animatable={false}
              items={viewItemsForPesys}
              onRowSelectChange={onRowSelectChange}
              onRowsChanged={onRowsChanged}
              beforeRowEdited={beforeRowEdited}
              id='P5000Pesys'
              labels={{
                selectAllTitle: 'Velg alle',
                selectAll: 'Velg alle',
                filter: t('p5000:filter-label'),
                flagged: '',
                flagAll: t('message:warning-periodsDoNotMatch'),
                merged: t('p5000:merged-periods')
              }}
              flaggable={_.find(items, 'flag') !== undefined}
              searchable={false}
              selectable={true}
              showSelectAll={true}
              sortable={true}
              editable={false}
              subrowsIcon='merge'
              onColumnSort={(sort: any) => {
                _setTableSort(sort)
              }}
              itemsPerPage={itemsPerPage}
              columns={columns}
              pagination={ pagination }
            />
          </Box>
        </Tabs.Panel>
      </Tabs>
      {renderPrintTable && (
        <HiddenDiv>
          <div ref={componentRef} id='printJS-form'>
            <Table<P5000ListRow, P5000TableContext>
              // important to it re-renders when sorting changes
              key={JSON.stringify(_tableSort)}
              className='print-version'
              items={items}
              id='P5000Overview-print'
              animatable={false}
              searchable={false}
              selectable={false}
              sortable
              sort={_tableSort}
              itemsPerPage={9999}
              columns={columns}
            />
          </div>
        </HiddenDiv>
      )}
    </>
  )
}

P5000Overview.propTypes = {
  p5000sFromRinaMap: PT.any.isRequired
}

export default P5000Overview
