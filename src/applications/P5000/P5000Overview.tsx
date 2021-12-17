import { informasjonOmBeregning, ordning, relevantForYtelse, typePeriode } from 'applications/P5000/P5000.labels'
import { OneLineSpan } from 'components/StyledComponents'
import { LocalStorageValue } from 'declarations/app'
import { P5000FromRinaMap, Seds } from 'declarations/buc'
import { P5000Context, P5000ListRow, P5000SED } from 'declarations/p5000'
import { State } from 'declarations/reducers'
import CountryData from 'land-verktoy'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import { BodyLong, Tag, HelpText, Loader, Select, Checkbox, Button } from '@navikt/ds-react'
import {
  AlignEndRow,
  Column,
  FlexCenterDiv,
  FlexEndDiv,
  HiddenDiv,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import PT from 'prop-types'
import Tooltip from 'rc-tooltip'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import Table, { Sort } from 'tabell'
import { convertP5000SEDToP5000ListRows } from './conversion'

export interface P5000OverviewSelector {
  highContrast: boolean
}

export interface P5000OverviewProps {
  context: P5000Context
  p5000FromRinaMap: P5000FromRinaMap
  p5000FromStorage: LocalStorageValue<P5000SED> | undefined
  seds: Seds
}

const mapState = (state: State): P5000OverviewSelector => ({
  highContrast: state.ui.highContrast
})

const P5000Overview: React.FC<P5000OverviewProps> = ({
  context, p5000FromRinaMap, p5000FromStorage, seds
}: P5000OverviewProps) => {
  const { t } = useTranslation()
  const componentRef = useRef(null)
  const countryInstance = CountryData.getCountryInstance('nb')
  const [_itemsPerPage, _setItemsPerPage] = useState<number>(30)
  const [_printDialogOpen, _setPrintDialogOpen] = useState<boolean>(false)
  const [renderPrintTable, _setRenderPrintTable] = useState<boolean>(false)
  const [_mergePeriods, _setMergePeriods] = useState<boolean>(false)
  const [_tableSort, _setTableSort] = useState<Sort>({ column: '', order: 'none' })
  const [items] = convertP5000SEDToP5000ListRows(seds, context, p5000FromRinaMap, p5000FromStorage, _mergePeriods)
  const { highContrast }: P5000OverviewSelector = useSelector<State, P5000OverviewSelector>(mapState)

  const beforePrintOut = (): void => {
    _setPrintDialogOpen(true)
  }

  const prepareContent = (): void => {
    _setRenderPrintTable(true)
    standardLogger('buc.edit.tools.P5000.overview.print.button')
  }

  const afterPrintOut = (): void => {
    _setPrintDialogOpen(false)
    _setRenderPrintTable(false)
  }

  const itemsPerPageChanged = (e: any): void => {
    standardLogger('buc.edit.tools.P5000.overview.itemsPerPage.select', { value: e.target.value })
    _setItemsPerPage(e.target.value === 'all' ? 9999 : parseInt(e.target.value, 10))
  }

  const renderDateCell = (item: P5000ListRow, value: any) => (
    <BodyLong>{_.isDate(value) ? moment(value).format('DD.MM.YYYY') : value}</BodyLong>
  )

  const renderType = (item: any, value: any) => (
    <Tooltip
      overlay={(
        <div style={{ maxWidth: '300px' }}>
          {_.get(typePeriode, value.startsWith('0') ? value : parseInt(value))}
        </div>
      )}
      placement='top'
      trigger={['hover']}
    >
      <BodyLong>
        {value}
      </BodyLong>
    </Tooltip>
  )

  const renderYtelse = (item: any, value: any) => (
    <Tooltip
      overlay={(
        <div style={{ maxWidth: '300px' }}>
          {_.get(relevantForYtelse, value.startsWith('0') ? value : parseInt(value))}
        </div>
      )}
      placement='top'
      trigger={['hover']}
    >
      <BodyLong>
        {value}
      </BodyLong>
    </Tooltip>
  )

  const renderBeregning = (item: any, value: any) => (
    <Tooltip
      overlay={(
        <div style={{ maxWidth: '300px' }}>
          {_.get(informasjonOmBeregning, value.startsWith('0') ? value : parseInt(value))}
        </div>
      )}
      placement='top'
      trigger={['hover']}
    >
      <BodyLong>
        {value}
      </BodyLong>
    </Tooltip>
  )

  const renderOrdning = (item: any, value: any) => (
    <Tooltip
      overlay={(
        <div style={{ maxWidth: '300px' }}>
          {_.get(ordning, value.startsWith('0') ? value : parseInt(value))}
        </div>
      )}
      placement='top'
      trigger={['hover']}
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

  return (
    <>
      <VerticalSeparatorDiv />
      <PileCenterDiv>
        <AlignEndRow style={{ width: '100%' }}>
          <Column>
            <Checkbox
              checked={_mergePeriods}
              id='a-buc-c-sedstart__p5000-overview-merge-checkbox'
              data-test-id='a-buc-c-sedstart__p5000-overview-merge-checkbox'
              onChange={() => _setMergePeriods(!_mergePeriods)}
            >
              <FlexCenterDiv>
                <OneLineSpan>
                  {t('buc:p5000-merge-periods')}
                </OneLineSpan>
                <HorizontalSeparatorDiv />
                <HelpText>
                  <div style={{ maxWidth: '300px' }}>
                    <BodyLong>{t('message:help-p5000-merge-1')}</BodyLong>
                    <BodyLong>{t('message:help-p5000-merge-2')}</BodyLong>
                  </div>
                </HelpText>
              </FlexCenterDiv>
            </Checkbox>
          </Column>
          <Column>
            <FlexEndDiv style={{ flexDirection: 'row-reverse' }}>
              <ReactToPrint
                documentTitle='P5000'
                onAfterPrint={afterPrintOut}
                onBeforePrint={beforePrintOut}
                onBeforeGetContent={prepareContent}
                trigger={() =>
                  <Button
                    disabled={_printDialogOpen}
                  >
                    {_printDialogOpen && <Loader />}
                    {t('ui:print')}
                  </Button>}
                content={() => {
                  return componentRef.current
                }}
              />
              <HorizontalSeparatorDiv />
              <Select
                id='itemsPerPage'
                label={t('ui:itemsPerPage')}
                onChange={itemsPerPageChanged}
                value={_itemsPerPage === 9999 ? 'all' : '' + _itemsPerPage}
              >
                <option value='10'>10</option>
                <option value='15'>15</option>
                <option value='20'>20</option>
                <option value='30'>30</option>
                <option value='50'>50</option>
                <option value='all'>{t('ui:all')}</option>
              </Select>

            </FlexEndDiv>
          </Column>
        </AlignEndRow>
        <VerticalSeparatorDiv />
        <hr style={{ width: '100%' }} />
        <VerticalSeparatorDiv />
        <Table<P5000ListRow>
          key={'P5000Overview-table-' + _itemsPerPage + '-sort-' + JSON.stringify(_tableSort) + '_merge' + _mergePeriods}
          animatable={false}
          highContrast={highContrast}
          items={items}
          id='P5000Overview'
          searchable
          selectable={false}
          sortable
          onColumnSort={(sort: any) => {
            standardLogger('buc.edit.tools.P5000.overview.sort', { sort: sort })
            _setTableSort(sort)
          }}
          itemsPerPage={_itemsPerPage}
          labels={{}}
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
                labels={{}}
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
