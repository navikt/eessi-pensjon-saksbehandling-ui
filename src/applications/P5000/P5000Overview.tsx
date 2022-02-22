import { informasjonOmBeregning, ordning, relevantForYtelse, typePeriode } from 'applications/P5000/P5000.labels'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { FeatureToggles, LocalStorageEntry } from 'declarations/app'
import { P5000FromRinaMap, Seds } from 'declarations/buc'
import { P5000Context, P5000ListRow, P5000SED } from 'declarations/p5000'
import { State } from 'declarations/reducers'
import CountryData from '@navikt/land-verktoy'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import { BodyLong, Tag } from '@navikt/ds-react'
import {
  HiddenDiv,
  PileCenterDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import PT from 'prop-types'
import Tooltip from '@navikt/tooltip'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Table, { Sort } from '@navikt/tabell'
import { convertP5000SEDToP5000ListRows } from './conversion'
import P5000OverviewControls from './P5000OverviewControls'

export interface P5000OverviewSelector {
  highContrast: boolean
  featureToggles: FeatureToggles
}

export interface P5000OverviewProps {
  context: P5000Context
  p5000FromRinaMap: P5000FromRinaMap
  p5000FromStorage: LocalStorageEntry<P5000SED> | undefined
  seds: Seds
}

const mapState = (state: State): P5000OverviewSelector => ({
  highContrast: state.ui.highContrast,
  featureToggles: state.app.featureToggles
})

const P5000Overview: React.FC<P5000OverviewProps> = ({
  context, p5000FromRinaMap, p5000FromStorage, seds
}: P5000OverviewProps) => {
  const { t } = useTranslation()
  const componentRef = useRef(null)
  const countryInstance = CountryData.getCountryInstance('nb')
  const [itemsPerPage, setItemsPerPage] = useState<number>(30)
  const [renderPrintTable, setRenderPrintTable] = useState<boolean>(false)
  const [mergePeriods, setMergePeriods] = useState<boolean>(false)
  const [mergePeriodTypes, setMergePeriodTypes] = useState<Array<string> |undefined>(undefined)
  const [useGermanRules, setUseGermanRules] = useState<boolean>(true)
  const [items] = convertP5000SEDToP5000ListRows(seds, context, p5000FromRinaMap, p5000FromStorage, mergePeriods, mergePeriodTypes, useGermanRules)

  const [_tableSort, _setTableSort] = useState<Sort>({ column: '', order: 'none' })
  const { highContrast, featureToggles }: P5000OverviewSelector = useSelector<State, P5000OverviewSelector>(mapState)

  const renderDateCell = (item: P5000ListRow, value: any) => (
    <BodyLong>{_.isDate(value) ? moment(value).format('DD.MM.YYYY') : value}</BodyLong>
  )

  const renderType = (item: any, value: any) => (
    <Tooltip
      label={(
        <div style={{ maxWidth: '300px' }}>
          {_.get(typePeriode, value.startsWith('0') ? value : parseInt(value))}
        </div>
      )}
    >
      <BodyLong>
        {value}
      </BodyLong>
    </Tooltip>
  )

  const renderYtelse = (item: any, value: any) => (
    <Tooltip
      label={(
        <div style={{ maxWidth: '300px' }}>
          {_.get(relevantForYtelse, value.startsWith('0') ? value : parseInt(value))}
        </div>
      )}
    >
      <BodyLong>
        {value}
      </BodyLong>
    </Tooltip>
  )

  const renderBeregning = (item: any, value: any) => (
    <Tooltip
      label={(
        <div style={{ maxWidth: '300px' }}>
          {_.get(informasjonOmBeregning, value.startsWith('0') ? value : parseInt(value))}
        </div>
      )}
    >
      <BodyLong>
        {value}
      </BodyLong>
    </Tooltip>
  )

  const renderOrdning = (item: any, value: any) => (
    <Tooltip
      label={(
        <div style={{ maxWidth: '300px' }}>
          {_.get(ordning, value.startsWith('0') ? value : parseInt(value))}
        </div>
      )}
    >
      <BodyLong>
        {value}
      </BodyLong>
    </Tooltip>
  )

  const renderDagCell = (item: P5000ListRow) => (
    <BodyLong>{(item.dag === '' || item.dag === '0') ? '' : item.dag + '/' + item.dagtype}</BodyLong>
  )

  const renderStatus = (item: any, value: any) => {
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

  const renderLand = (item: any, value: any) => {
    if (_.isEmpty(value)) {
      return <div>-</div>
    }
    return <div>{countryInstance.findByValue(value)?.label}</div>
  }

  const columns = [
    { id: 'status', label: t('ui:status'), type: 'string', renderCell: renderStatus },
    { id: 'land', label: t('ui:country'), type: 'string', renderCell: renderLand },
    { id: 'acronym', label: t('ui:_institution'), type: 'string' },
    { id: 'type', label: t('ui:type'), type: 'string', renderCell: renderType },
    {
      id: 'startdato',
      label: t('ui:startDate'),
      type: 'date',
      renderCell: renderDateCell
    },
    {
      id: 'sluttdato',
      label: t('ui:endDate'),
      type: 'date',
      renderCell: renderDateCell
    },
    { id: 'aar', label: t('ui:year'), type: 'string' },
    { id: 'mnd', label: t('ui:month'), type: 'string' },
    {
      id: 'dag',
      label: t('ui:days') + '/' + t('ui:unit'),
      type: 'string',
      renderCell: renderDagCell
    },
    { id: 'ytelse', label: t('ui:relevantForPerformance'), type: 'string', renderCell: renderYtelse },
    { id: 'ordning', label: t('ui:scheme'), type: 'string', renderCell: renderOrdning },
    { id: 'beregning', label: t('ui:calculationInformation'), type: 'string', renderCell: renderBeregning }
  ]

  if (context === 'overview') {
    columns.splice(0, 1) // remove status column
  }

  const tableKey: string = 'P5000Overview-table-' + itemsPerPage + '-sort-' + JSON.stringify(_tableSort) + '_merge' + mergePeriods +
    '_mergetype' + (mergePeriodTypes?.join(':') ?? '') + '_useGerman' + useGermanRules

  return (
    <>
      <VerticalSeparatorDiv />
      <PileCenterDiv>
        <P5000OverviewControls
          componentRef={componentRef}
          featureToggles={featureToggles}
          mergePeriods={mergePeriods}
          setMergePeriods={setMergePeriods}
          mergePeriodTypes={mergePeriodTypes}
          setMergePeriodTypes={setMergePeriodTypes}
          setRenderPrintTable={setRenderPrintTable}
          useGermanRules={useGermanRules}
          setUseGermanRules={setUseGermanRules}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          items={items}
        />
        <HorizontalLineSeparator />
        <VerticalSeparatorDiv />
        <Table<P5000ListRow>
          key={tableKey}
          animatable={false}
          highContrast={highContrast}
          items={items}
          id='P5000Overview'
          labels={{
            filter: t('p5000:filter-label'),
            flagged: '',
            flagAll: t('message:warning-periodsDoNotMatch'),
            merged: t('p5000:merged-periods')

          }}
          flaggable={_.find(items, 'flag') !== undefined}
          searchable
          selectable={false}
          sortable
          subrowsIcon='merge'
          onColumnSort={(sort: any) => {
            standardLogger('buc.edit.tools.P5000.overview.sort', { sort })
            _setTableSort(sort)
          }}
          itemsPerPage={itemsPerPage}
          columns={columns}
        />
        <VerticalSeparatorDiv />
        {renderPrintTable && (
          <HiddenDiv>
            <div ref={componentRef} id='printJS-form'>
              <Table<P5000ListRow>
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
      </PileCenterDiv>
      <VerticalSeparatorDiv size='3' />
    </>
  )
}

P5000Overview.propTypes = {
  p5000FromRinaMap: PT.any.isRequired
}

export default P5000Overview
