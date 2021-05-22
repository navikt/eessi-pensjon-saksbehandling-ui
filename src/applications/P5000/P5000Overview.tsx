import { PrintableTableSorter } from 'components/StyledComponents'
import { SedContent, SedContentMap } from 'declarations/buc'
import { ActiveSeds, SedSender } from 'declarations/p5000'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
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
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactToPrint from 'react-to-print'
import styled from 'styled-components'
import TableSorter, { Sort } from 'tabell'
import * as labels from './P5000.labels'

const CustomSelect = styled(Select)`
  select {
    color: ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]};
    background-color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
  }
`

export interface P5000OverviewProps {
  activeSeds: ActiveSeds
  getSedSender: (sedId: string) => SedSender | undefined
  highContrast: boolean
  sedOriginalContent: SedContentMap
}

export interface P5000OverviewRow {
  key: string
  land: string
  acronym: string
  type: string
  startdato: string
  sluttdato: string
  år: string
  kvartal: string
  måned: string
  uker: string
  dagerEnhet: string
  relevantForYtelse: string
  ordning: string
  informasjonOmBeregning: string
}

export type P5000OverviewRows = Array<P5000OverviewRow>

const P5000Overview: React.FC<P5000OverviewProps> = ({
  activeSeds, getSedSender, highContrast, sedOriginalContent
}: P5000OverviewProps) => {
  const { t } = useTranslation()
  const componentRef = useRef(null)

  const [_itemsPerPage, setItemsPerPage] = useState<number>(30)
  const [_printDialogOpen, setPrintDialogOpen] = useState<boolean>(false)
  const [_tableSort, setTableSort] = useState<Sort>({ column: '', order: 'none' })

  const convertRawP5000toRow = (sedId: string, sedContent: SedContent): P5000OverviewRows => {
    const res: P5000OverviewRows = []
    const sender: SedSender | undefined = getSedSender(sedId)
    const medlemskap = sedContent?.pensjon?.medlemskapboarbeid?.medlemskap
    if (medlemskap) {
      medlemskap.forEach((m: any, i: number) => {
        if (!_.isNil(m)) {
          res.push({
            key: sedId + '-' + i,
            land: sender!.countryLabel || '-',
            acronym: sender!.acronym.indexOf(':') > 0 ? sender!.acronym.split(':')[1] : sender!.acronym,
            type: m.type || '-',
            startdato: m.periode?.fom ? moment(m.periode?.fom, 'YYYY-MM-DD').toDate() : '-',
            sluttdato: m.periode?.tom ? moment(m.periode?.tom, 'YYYY-MM-DD').toDate() : '-',
            år: m.sum?.aar || '-',
            kvartal: m.sum?.kvartal || '-',
            måned: m.sum?.maaneder || '-',
            uker: m.sum?.uker || '-',
            dagerEnhet: (m.sum?.dager?.nr || '-') + '/' + (m.sum?.dager?.type || '-'),
            relevantForYtelse: m.relevans || '-',
            ordning: m.ordning || '-',
            informasjonOmBeregning: m.beregning || '-'
          } as P5000OverviewRow)
        }
      })
    }
    return res
  }


  const getItems = (): P5000OverviewRows => {
    let res: P5000OverviewRows = []
    Object.keys(activeSeds).forEach((key: string) => {
      if (activeSeds[key]) {
        res = res.concat(convertRawP5000toRow(key, sedOriginalContent[key]))
      }
    })
    return res
  }



  const beforePrintOut = (): void => {
  }

  const prepareContent = (): void => {
    standardLogger('buc.edit.tools.P5000.overview.print.button')
    setPrintDialogOpen(true)
  }

  const afterPrintOut = (): void => {
    setPrintDialogOpen(false)
  }

  const itemsPerPageChanged = (e: any): void => {
    standardLogger('buc.edit.tools.P5000.overview.itemsPerPage.select', { value: e.target.value })
    setItemsPerPage(e.target.value === 'all' ? 9999 : parseInt(e.target.value, 10))
  }

  const items = getItems()


  return (
    <NavHighContrast highContrast={highContrast}>
      <VerticalSeparatorDiv />
      <PileCenterDiv>
        <Row>
          <Column>
            <FlexEndDiv style={{flexDirection: 'row-reverse'}}>
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
        <TableSorter
          highContrast={highContrast}
          items={items}
          searchable
          selectable={false}
          sortable
          onColumnSort={(sort: any) => {
            standardLogger('buc.edit.tools.P5000.overview.sort', { sort: sort })
            setTableSort(sort)
          }}
          itemsPerPage={_itemsPerPage}
          labels={labels}
          compact
          columns={[
            { id: 'land', label: t('ui:country'), type: 'string' },
            { id: 'acronym', label: t('ui:_institution'), type: 'string' },
            { id: 'type', label: t('ui:type'), type: 'string' },
            {
              id: 'startdato',
              label: t('ui:startDate'),
              type: 'date',
              renderCell: (item: any, value: any) => (
                <Normaltekst>{_.isDate(value) ? moment(value).format('DD.MM.YYYY') : value}</Normaltekst>
              )
            },
            {
              id: 'sluttdato',
              label: t('ui:endDate'),
              type: 'date',
              renderCell: (item: any, value: any) => (
                <Normaltekst>{_.isDate(value) ? moment(value).format('DD.MM.YYYY') : value}</Normaltekst>
              )
            },
            { id: 'år', label: t('ui:year'), type: 'string' },
            { id: 'kvartal', label: t('ui:quarter'), type: 'string' },
            { id: 'måned', label: t('ui:month'), type: 'string' },
            { id: 'uker', label: t('ui:week'), type: 'string' },
            { id: 'dagerEnhet', label: t('ui:days') + '/' + t('ui:unit'), type: 'string' },
            { id: 'relevantForYtelse', label: t('ui:relevantForPerformance'), type: 'string' },
            { id: 'ordning', label: t('ui:scheme'), type: 'string' },
            { id: 'informasjonOmBeregning', label: t('ui:calculationInformation'), type: 'string' }
          ]}
        />
        <HiddenDiv>
          <div ref={componentRef} id='printJS-form'>
            <PrintableTableSorter
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
              labels={labels}
              compact
              columns={[
                { id: 'land', label: t('ui:country'), type: 'string' },
                { id: 'acronym', label: t('ui:_institution'), type: 'string' },
                { id: 'type', label: t('ui:type'), type: 'string' },
                {
                  id: 'startdato',
                  label: t('ui:startDate'),
                  type: 'date',
                  renderCell: (item: any, value: any) => (
                    <Normaltekst>{_.isDate(value) ? moment(value).format('DD.MM.YYYY') : value}</Normaltekst>
                  )
                },
                {
                  id: 'sluttdato',
                  label: t('ui:endDate'),
                  type: 'date',
                  renderCell: (item: any, value: any) => (
                    <Normaltekst>{_.isDate(value) ? moment(value).format('DD.MM.YYYY') : value}</Normaltekst>
                  )
                },
                { id: 'år', label: t('ui:year'), type: 'string' },
                { id: 'kvartal', label: t('ui:quarter'), type: 'string' },
                { id: 'måned', label: t('ui:month'), type: 'string' },
                { id: 'uker', label: t('ui:week'), type: 'string' },
                { id: 'dagerEnhet', label: t('ui:days') + '/' + t('ui:unit'), type: 'string' },
                { id: 'relevantForYtelse', label: t('ui:relevantForPerformance'), type: 'string' },
                { id: 'ordning', label: t('ui:scheme'), type: 'string' },
                { id: 'informasjonOmBeregning', label: t('ui:calculationInformation'), type: 'string' }
              ]}
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
  sedOriginalContent: PT.any.isRequired
}

export default P5000Overview
