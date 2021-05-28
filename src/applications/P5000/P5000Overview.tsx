import { P5000FromRinaMap, Seds } from 'declarations/buc'
import { P5000Context, P5000ListRow, P5000SED } from 'declarations/p5000'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import EtikettBase from 'nav-frontend-etiketter'
import { Select } from 'nav-frontend-skjema'
import { Normaltekst } from 'nav-frontend-typografi'
import NavHighContrast, {
  Column,
  FlexEndDiv,
  HiddenDiv,
  HighContrastKnapp,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  Row,
  themeKeys,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import PT from 'prop-types'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactToPrint from 'react-to-print'
import styled from 'styled-components'
import Table, { Sort } from 'tabell'
import { convertP5000SEDToP5000ListRows } from './conversion'

const CustomSelect = styled(Select)`
  select {
    color: ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]};
    background-color: ${({ theme }) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
  }
`

export interface P5000OverviewProps {
  context: P5000Context
  highContrast: boolean
  p5000FromRinaMap: P5000FromRinaMap
  p5000FromStorage: P5000SED | undefined
  seds: Seds
}

const P5000Overview: React.FC<P5000OverviewProps> = ({
  context, highContrast, p5000FromRinaMap, p5000FromStorage, seds
}: P5000OverviewProps) => {
  const { t } = useTranslation()
  const componentRef = useRef(null)

  const [_itemsPerPage, _setItemsPerPage] = useState<number>(30)
  const [_printDialogOpen, _setPrintDialogOpen] = useState<boolean>(false)
  const [_tableSort, _setTableSort] = useState<Sort>({ column: '', order: '' })
  const [items, sourceStatus] = convertP5000SEDToP5000ListRows(seds, context, p5000FromRinaMap, p5000FromStorage)

  const beforePrintOut = (): void => {}

  const prepareContent = (): void => {
    standardLogger('buc.edit.tools.P5000.overview.print.button')
    _setPrintDialogOpen(true)
  }

  const afterPrintOut = (): void => {
    _setPrintDialogOpen(false)
  }

  const itemsPerPageChanged = (e: any): void => {
    standardLogger('buc.edit.tools.P5000.overview.itemsPerPage.select', { value: e.target.value })
    _setItemsPerPage(e.target.value === 'all' ? 9999 : parseInt(e.target.value, 10))
  }

  const renderDateCell = (item: P5000ListRow, value: any) => (
    <Normaltekst>{_.isDate(value) ? moment(value).format('DD.MM.YYYY') : value}</Normaltekst>
  )

  const renderDagCell = (item: P5000ListRow) => (
    <Normaltekst>{item.dag + '/' + item.dagtype}</Normaltekst>
  )

  const renderStatus = (item: any, value: any) => {
    if (value === 'rina') {
      return <EtikettBase mini type='info'>RINA</EtikettBase>
    }
    if (value === 'new') {
      return <EtikettBase mini type='suksess'>Ny</EtikettBase>
    }
    if (value === 'edited') {
      return <EtikettBase mini type='fokus'>Endret</EtikettBase>
    }
    return <div />
  }

  const columns = [
    { id: 'status', label: t('ui:status'), type: 'string', renderCell: renderStatus },
    { id: 'land', label: t('ui:country'), type: 'string' },
    { id: 'acronym', label: t('ui:_institution'), type: 'string' },
    { id: 'type', label: t('ui:type'), type: 'string' },
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
    { id: 'kvartal', label: t('ui:quarter'), type: 'string' },
    { id: 'mnd', label: t('ui:month'), type: 'string' },
    { id: 'uker', label: t('ui:week'), type: 'string' },
    {
      id: 'dag',
      label: t('ui:days') + '/' + t('ui:unit'),
      type: 'string',
      renderCell: renderDagCell
    },
    { id: 'ytelse', label: t('ui:relevantForPerformance'), type: 'string' },
    { id: 'ordning', label: t('ui:scheme'), type: 'string' },
    { id: 'beregning', label: t('ui:calculationInformation'), type: 'string' }
  ]

  if (context === 'overview') {
    columns.splice(0, 1) // remove status column
  }

  return (
    <NavHighContrast highContrast={highContrast}>
      <VerticalSeparatorDiv />
      <PileCenterDiv>
        <Row>
          <Column>
            <FlexEndDiv style={{ flexDirection: 'row-reverse' }}>
              <ReactToPrint
                documentTitle='P5000'
                onAfterPrint={afterPrintOut}
                onBeforePrint={beforePrintOut}
                onBeforeGetContent={prepareContent}
                trigger={() =>
                  <HighContrastKnapp
                    disabled={_printDialogOpen}
                    spinner={_printDialogOpen}
                  >
                    {t('ui:print')}
                  </HighContrastKnapp>}
                content={() => {
                  return componentRef.current
                }}
              />
              <HorizontalSeparatorDiv />
              <CustomSelect
                bredde='l'
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
              </CustomSelect>

            </FlexEndDiv>
          </Column>
        </Row>
        <VerticalSeparatorDiv />
        <hr style={{ width: '100%' }} />
        <VerticalSeparatorDiv />
        <Table<P5000ListRow>
          highContrast={highContrast}
          items={items}
          searchable
          selectable={false}
          sortable
          onColumnSort={(sort: any) => {
            standardLogger('buc.edit.tools.P5000.overview.sort', { sort: sort })
            _setTableSort(sort)
          }}
          itemsPerPage={_itemsPerPage}
          labels={{}}
          compact
          columns={columns}
        />
        <VerticalSeparatorDiv />
        {t('buc:p5000-source-status-' + sourceStatus)}
        <VerticalSeparatorDiv />
        <HiddenDiv>
          <div ref={componentRef} id='printJS-form'>
            <Table<P5000ListRow>
              // important to it re-renders when sorting changes
              key={JSON.stringify(_tableSort)}
              className='print-version'
              items={items}
              animatable={false}
              searchable={false}
              selectable={false}
              sortable
              sort={_tableSort}
              itemsPerPage={9999}
              labels={{}}
              compact
              columns={columns}
            />
          </div>
        </HiddenDiv>
      </PileCenterDiv>
      <VerticalSeparatorDiv size='3' />
    </NavHighContrast>
  )
}

P5000Overview.propTypes = {
  highContrast: PT.bool.isRequired,
  p5000FromRinaMap: PT.any.isRequired
}

export default P5000Overview
