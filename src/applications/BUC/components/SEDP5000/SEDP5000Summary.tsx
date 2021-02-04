import useWindowDimensions from 'components/WindowDimension/WindowDimension'
import { AllowedLocaleString } from 'declarations/app.d'
import { Participant, SedContent, SedContentMap, Seds } from 'declarations/buc'
import { SedsPropType } from 'declarations/buc.pt'
import CountryData from 'land-verktoy'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import NavHighContrast, { HighContrastKnapp } from 'nav-hoykontrast'
import PT from 'prop-types'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactToPrint from 'react-to-print'
import styled from 'styled-components'
import TableSorter, { Sort } from 'tabell'
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

type ActiveSeds = {[k: string]: boolean}

export interface SEDP5000Props {
  highContrast: boolean
  locale: AllowedLocaleString
  seds: Seds
  sedContent: SedContentMap
}

interface SedSender {
  date: string
  country: string
  countryLabel: string
  institution: string
  acronym: string
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
  highContrast, locale, seds, sedContent
}: SEDP5000Props) => {
  const { t } = useTranslation()
  const { height } = useWindowDimensions()
  const componentRef = useRef(null)
  const [_activeSeds, ] = useState<ActiveSeds>(_.mapValues(_.keyBy(seds, 'id'), () => true))
  const [_itemsPerPage, ] = useState<number>(height < 800 ? 15 : height < 1200 ? 20 : 25)
  const [_printDialogOpen, setPrintDialogOpen] = useState<boolean>(false)
  const [_tableSort, setTableSort] = useState<Sort>({ column: '', order: 'none' })

  const convertRawP5000toRow = (sedId: string, sedContent: SedContent): SEDP5000SummaryRows => {
    const res: SEDP5000SummaryRows = []
    const sender: SedSender | undefined = getSedSender(sedId)
    const medlemskap = sedContent.pensjon?.medlemskap
    if (medlemskap) {
      medlemskap.forEach((m: any, i: number) => {
        if (!_.isNil(m)) {
          res.push({
            key: sedId + '-' + i,
            'sec51aar': m.sum?.aar || '-',
            'sec51maned': m.sum?.maaneder || '-',
            'sec51dager': (m.sum?.dager?.nr || '-') + '/' + (m.sum?.dager?.type || '-'),
            'sec52aar': m.sum?.aar || '-',
            'sec52maned': m.sum?.maaneder || '-',
            'sec52dager': (m.sum?.dager?.nr || '-') + '/' + (m.sum?.dager?.type || '-'),
            type: sender!.acronym.indexOf(':') > 0 ? sender!.acronym.split(':')[1] : sender!.acronym
          } as SEDP5000SummaryRow)
        }
      })
    }
    return res
  }

  const getSedSender = (sedId: string): SedSender | undefined => {
    const sed = _.find(seds, { id: sedId })
    if (!sed) {
      return undefined
    }
    const sender: Participant | undefined = sed.participants?.find((participant: Participant) => participant.role === 'Sender')
    if (sender) {
      return {
        date: moment(sed.lastUpdate).format('DD.MM.YYYY'),
        countryLabel: CountryData.getCountryInstance(locale).findByValue(sender.organisation.countryCode).label,
        country: sender.organisation.countryCode,
        institution: sender.organisation.name,
        acronym: sender.organisation.acronym || '-'
      }
    }
    return undefined
  }

  const getItems = (): SEDP5000SummaryRows => {
    let res: SEDP5000SummaryRows = []
    Object.keys(_activeSeds).forEach((key: string) => {
      if (_activeSeds[key]) {
        res = res.concat(convertRawP5000toRow(key, sedContent[key]))
      }
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

  const items = getItems()

  return (
    <NavHighContrast highContrast={highContrast}>
      <SEDP5000Container>
        <TableSorter
          highContrast={highContrast}
          items={items}
          searchable
          selectable={false}
          sortable
          onColumnSort={(sort: any) => {
            standardLogger('buc.edit.tools.P5000.summary.sort', { sort: sort })
            setTableSort(sort)
          }}
          itemsPerPage={_itemsPerPage}
          labels={labels}
          compact
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
