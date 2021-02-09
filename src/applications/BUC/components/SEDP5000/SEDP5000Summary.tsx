import useWindowDimensions from 'components/WindowDimension/WindowDimension'
import { AllowedLocaleString } from 'declarations/app.d'
import { SedContentMap, Seds } from 'declarations/buc'
import { SedsPropType } from 'declarations/buc.pt'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import NavHighContrast, { HighContrastKnapp } from 'nav-hoykontrast'
import PT from 'prop-types'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactToPrint from 'react-to-print'
import styled from 'styled-components'
import TableSorter, { Sort } from 'tabell'
import { VerticalSeparatorDiv } from 'nav-hoykontrast'
import * as labels from './SEDP5000.labels'

export const ButtonsDiv = styled.div`
  margin-top: '1.5rem;
  margin-bottom: '1.5rem;
`
export const CheckboxLabel = styled.div`
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
`
export const HiddenDiv = styled.div`
  display: none;
`
export const PrintableTableSorter = styled(TableSorter)`
  width: 100%;
  margin-top: 0.5rem;
  @media print {
    @page {
      size: A4 landscape;
    }
    td {
      padding: 0.5rem;
    }
  }
`
export const SEDP5000Checkboxes = styled.div`
  display: flex;
  flex-direction: column;
`
export const SEDP5000Container = styled.div`
  margin-top: 1rem;
  min-height: 500px;
`
export const SEDP5000Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`

export interface SEDP5000Props {
  highContrast: boolean
  locale: AllowedLocaleString
  seds: Seds
  sedContent: SedContentMap
}

export interface SEDP5000SummaryRow {
  key: string
  type: string
  sec51aar: string
  sec51maned: string
  sec51dager: string
  sec52aar: string
  sec52maned: string
  sec52dager: string
}

export type SEDP5000SummaryRows = Array<SEDP5000SummaryRow>

const SEDP5000Overview: React.FC<SEDP5000Props> = ({
  highContrast, sedContent
}: SEDP5000Props) => {
  const { t } = useTranslation()
  const { height } = useWindowDimensions()
  const componentRef = useRef(null)
  const [_itemsPerPage] = useState<number>(height < 800 ? 15 : height < 1200 ? 20 : 25)
  const [_printDialogOpen, setPrintDialogOpen] = useState<boolean>(false)
  const [_tableSort, setTableSort] = useState<Sort>({ column: '', order: 'none' })

  const convertRawP5000toRow = (sedContent: SedContentMap): SEDP5000SummaryRows => {
    const res: SEDP5000SummaryRows = []

    const data: any = {
      '11': {
        '5_1': {
          aar: 0, maaneder: 0, dager: 0
        },
        '5_2': {
          aar: 0, maaneder: 0, dager: 0
        },
      },
      '30': {
        '5_1': {
          aar: 0, maaneder: 0, dager: 0
        },
        '5_2': {
          aar: 0, maaneder: 0, dager: 0
        },
      }
    };

    const ks: any = Object.keys(sedContent)

    ks.forEach((k: string) => {
      const medlemskap = sedContent[k].pensjon?.medlemskap
      if (medlemskap) {
        medlemskap.forEach((m: any) => {
          if (!_.isNil(m)) {
            if (m.type === '11' || m.type === '30') {
              data[m.type]['5_1'].aar = data[m.type]['5_1'].aar + (m.sum?.aar ? parseInt(m.sum?.aar) : 0)
              data[m.type]['5_1'].maaneder = data[m.type]['5_1'].maaneder + (m.sum?.maaneder ? parseInt(m.sum?.maaneder) : 0)
              data[m.type]['5_1'].dager = data[m.type]['5_1'].dager + (m.sum?.dager?.nr ? parseInt(m.sum?.dager?.nr) : 0)
              data[m.type]['5_2'].aar = data[m.type]['5_2'].aar + (m.sum?.aar ? parseInt(m.sum?.aar) : 0)
              data[m.type]['5_2'].maaneder = data[m.type]['5_2'].maaneder + (m.sum?.maaneder ? parseInt(m.sum?.maaneder) : 0)
              data[m.type]['5_2'].dager = data[m.type]['5_2'].dager + (m.sum?.dager?.nr ? parseInt(m.sum?.dager?.nr) : 0)
            }
          }
        })
      }
    });

    ['11', '30'].forEach(type => {
      res.push({
        key: type,
        sec51aar: data[type]['5_1']['aar'],
        sec51maned: data[type]['5_1']['maaneder'],
        sec51dager: data[type]['5_1']['dager'],
        sec52aar: data[type]['5_2']['aar'],
        sec52maned: data[type]['5_2']['maaneder'],
        sec52dager: data[type]['5_2']['dager'],
        type: t('buc:P5000-category-' + type)
      })
    })

    return res
  }

  const beforePrintOut = (): void => {
  }

  const prepareContent = (): void => {
    standardLogger('buc.edit.tools.P5000.summary.print.button')
    setPrintDialogOpen(true)
  }

  const afterPrintOut = (): void => {
    setPrintDialogOpen(false)
  }

  const items = convertRawP5000toRow(sedContent)

  return (
    <NavHighContrast highContrast={highContrast}>
      <SEDP5000Container>
        <TableSorter
          highContrast={highContrast}
          items={items}
          searchable={false}
          selectable={false}
          sortable
          onColumnSort={(sort: any) => {
            standardLogger('buc.edit.tools.P5000.summary.sort', { sort: sort })
            setTableSort(sort)
          }}
          itemsPerPage={_itemsPerPage}
          labels={labels}
          compact
          categories={[{
            colSpan: 1,
            label: ''
          }, {
            colSpan: 3,
            label: t('buc:P5000-5-1-title')
          }, {
            colSpan: 3,
            label: t('buc:P5000-5-2-title')
          }]}
          columns={[
            { id: 'type', label: t('ui:type'), type: 'string' },
            { id: 'sec51aar', label: t('ui:year'), type: 'string' },
            { id: 'sec51maned', label: t('ui:month'), type: 'string' },
            { id: 'sec51dager', label: t('ui:days') + '/' + t('ui:unit'), type: 'string' },
            { id: 'sec52aar', label: t('ui:year'), type: 'string' },
            { id: 'sec52maned', label: t('ui:month'), type: 'string' },
            { id: 'sec52dager', label: t('ui:days') + '/' + t('ui:unit'), type: 'string' }
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
              categories={[{
                colSpan: 1,
                label: ''
              }, {
                colSpan: 3,
                label: 'sdfdsfsdf'
              }, {
                colSpan: 3,
                label: 'sdfdsfsdfdf2'
              }]}
              columns={[
                { id: 'type', label: t('ui:type'), type: 'string' },
                { id: 'sec51aar', label: t('ui:year'), type: 'string' },
                { id: 'sec51maned', label: t('ui:month'), type: 'string' },
                { id: 'sec51dager', label: t('ui:days') + '/' + t('ui:unit'), type: 'string' },
                { id: 'sec52aar', label: t('ui:year'), type: 'string' },
                { id: 'sec52maned', label: t('ui:month'), type: 'string' },
                { id: 'sec52dager', label: t('ui:days') + '/' + t('ui:unit'), type: 'string' }
              ]}
            />
          </div>
        </HiddenDiv>
        <VerticalSeparatorDiv data-size='2'/>
        <ButtonsDiv>
          <ReactToPrint
            documentTitle='P5000Summary'
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
        </ButtonsDiv>
      </SEDP5000Container>
    </NavHighContrast>
  )
}

SEDP5000Overview.propTypes = {
  highContrast: PT.bool.isRequired,
  locale: PT.oneOf<AllowedLocaleString>(['en', 'nb']).isRequired,
  seds: SedsPropType.isRequired,
  sedContent: PT.any.isRequired
}

export default SEDP5000Overview
