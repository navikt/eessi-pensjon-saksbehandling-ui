import Alert from 'components/Alert/Alert'
import useWindowDimensions from 'components/WindowDimension/WindowDimension'
import { Participant, SedContent, SedContentMap, Seds } from 'declarations/buc'
import { SedsPropType } from 'declarations/buc.pt'
import { AllowedLocaleString } from 'declarations/types'
import _ from 'lodash'
import Flag from 'flagg-ikoner'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import PT from 'prop-types'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import * as labels from './SEDP5000.labels'
import WarningCircle from 'assets/icons/WarningCircle'
import TableSorter from 'tabell'
import ReactToPrint from 'react-to-print'
import { Checkbox, Select } from 'nav-frontend-skjema'
import Knapp from 'nav-frontend-knapper'
import { Normaltekst } from 'nav-frontend-typografi'
import CountryData from 'land-verktoy'

export interface SEDP5000Props {
  locale: AllowedLocaleString;
  seds: Seds;
  sedContent: SedContentMap;
}

type ActiveSeds = {[k: string]: boolean}

interface SedSender {
  date: string;
  country: string;
  countryLabel: string;
  institution: string;
  acronym: string;
}

export const SEDP5000Container = styled.div`
  min-height: 500px;
`
export const SEDP5000Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`
export const SEDP5000Checkboxes = styled.div`
  display: flex;
  flex-direction: column;
`
export const HiddenDiv = styled.div`
  display: none;
`
export const ButtonsDiv = styled.div`
  margin-top: '1.5rem;
  margin-bottom: '1.5rem;
`
export const CheckboxLabel = styled.div`
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
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

const SEDP5000: React.FC<SEDP5000Props> = ({ locale, seds, sedContent }: SEDP5000Props) => {
  const { t } = useTranslation()
  const { height } = useWindowDimensions()
  const [itemsPerPage, setItemsPerPage] = useState<number>(height < 800 ? 15 : height < 1200 ? 20 : 25)
  const [activeSeds, setActiveSeds] = useState<ActiveSeds>(_.mapValues(_.keyBy(seds, 'id'), () => true))
  const [tableSort, setTableSort] = useState<any>({ column: '', order: 'none' })
  const [printDialogOpen, setPrintDialogOpen] = useState<boolean>(false)
  const componentRef = useRef(null)

  const convertRawP5000toRow = (sedId: string, sedContent: SedContent): Array<any> => {
    const res: Array<any> = []
    const sender = getSedSender(sedId)
    const medlemskap = sedContent.pensjon?.medlemskap
    if (medlemskap) {
      medlemskap.forEach((m: any, i: number) => {
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
        })
      })
    }
    return res
  }

  const getSedSender = (sedId: string): SedSender | undefined => {
    const sed = _.find(seds, { id: sedId })
    if (!sed) {
      return undefined
    }

    const sender: Participant | undefined = sed.participants.find((participant: Participant) => participant.role === 'Sender')
    if (sender) {
      return {
        date: moment(sed.lastUpdate).format('DD.MM.YYYY'),
        countryLabel: CountryData.getCountryInstance(locale).findByValue(sender.organisation.countryCode).label,
        country: sender.organisation.countryCode,
        institution: sender.organisation.name,
        acronym: sender.organisation.acronym
      }
    }
    return undefined
  }

  const getItems = () => {
    let res: Array<any> = []
    Object.keys(activeSeds).forEach((key: string) => {
      if (activeSeds[key]) {
        res = res.concat(convertRawP5000toRow(key, sedContent[key]))
      }
    })
    return res
  }

  type EmptyPeriodsReport = {[k: string]: boolean}

  const getEmptyPeriodsReport = (): EmptyPeriodsReport => {
    const res: EmptyPeriodsReport = {}
    Object.keys(activeSeds).forEach((key: string) => {
      if (activeSeds[key]) {
        res[key] = sedContent[key]?.pensjon?.medlemskapAnnen?.length > 0
      }
    })
    return res
  }

  const hasEmptyPeriods = (emptyPeriodsReport: EmptyPeriodsReport) => {
    return Object.values(emptyPeriodsReport).indexOf(true) >= 0
  }

  const beforePrintOut = () => {
  }

  const prepareContent = () => {
    standardLogger('buc.edit.tools.P5000.print.button')
    setPrintDialogOpen(true)
  }

  const afterPrintOut = () => {
    setPrintDialogOpen(false)
  }

  const changeActiveSed = (sedId: string) => {
    const newActiveSeds = _.cloneDeep(activeSeds)
    newActiveSeds[sedId] = !activeSeds[sedId]
    setActiveSeds(newActiveSeds)
  }

  const itemsPerPageChanged = (e: any) => {
    standardLogger('buc.edit.tools.P5000.itemsPerPage.select', { value: e.target.value })
    setItemsPerPage(e.target.value === 'all' ? 9999 : parseInt(e.target.value, 10))
  }

  const items = getItems()
  const emptyPeriodReport: EmptyPeriodsReport = getEmptyPeriodsReport()
  const warning = hasEmptyPeriods(emptyPeriodReport)

  return (
    <SEDP5000Container>
      <SEDP5000Header>
        <SEDP5000Checkboxes>
          {Object.keys(activeSeds).map(sedId => {
            const sender: SedSender | undefined = getSedSender(sedId)
            return (
              <Checkbox
                key={sedId}
                id={'checkbox-' + sedId}
                className='mb-2'
                checked={activeSeds[sedId]}
                onChange={() => changeActiveSed(sedId)}
                label={(
                  <CheckboxLabel>
                    <span>{t('buc:form-dateP5000', { date: sender?.date })}</span>
                    <span className='ml-1 mr-1'>-</span>
                    {sender ? (
                      <div className='d-flex align-items-center'>
                        <Flag
                          type='circle'
                          className='ml-1 mr-1'
                          size='S'
                          country={sender?.country}
                          label={sender?.countryLabel}
                        />
                        <span>{sender?.countryLabel}</span>
                        <span className='ml-1 mr-1'>-</span>
                        <span>{sender?.institution}</span>
                      </div>
                    ) : sedId}
                    {emptyPeriodReport[sedId] ? <WarningCircle className='ml-2' /> : null}
                  </CheckboxLabel>
                )}
              />
            )
          })}
        </SEDP5000Checkboxes>
        <div className='d-flex'>
          {warning ? (
            <Alert
              className='ml-4 mr-4'
              type='client'
              fixed={false}
              status='WARNING'
              message={t('buc:form-P5000-warning')}
            />
          ) : null}
          <Select
            id='itemsPerPage'
            bredde='l'
            label={t('ui:itemsPerPage')}
            value={itemsPerPage === 9999 ? 'all' : '' + itemsPerPage}
            onChange={itemsPerPageChanged}
          >
            <option value='15'>15</option>
            <option value='20'>20</option>
            <option value='25'>25</option>
            <option value='all'>{t('ui:all')}</option>
          </Select>
        </div>
      </SEDP5000Header>
      <TableSorter
        className='w-100 mt-2'
        items={items}
        searchable
        selectable={false}
        sortable
        onColumnSort={(sort: any) => {
          standardLogger('buc.edit.tools.P5000.sort', { sort: sort })
          setTableSort(sort)
        }}
        itemsPerPage={itemsPerPage}
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
            key={JSON.stringify(tableSort)}
            className='print-version'
            items={items}
            animatable={false}
            searchable={false}
            selectable={false}
            sortable
            sort={tableSort}
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
      <ButtonsDiv>
        <ReactToPrint
          documentTitle='P5000'
          onBeforePrint={beforePrintOut}
          onBeforeGetContent={prepareContent}
          onAfterPrint={afterPrintOut}
          trigger={() =>
            <Knapp
              disabled={printDialogOpen}
              spinner={printDialogOpen}
            >
              {t('ui:print')}
            </Knapp>}
          content={() => {
            return componentRef.current
          }}
        />
      </ButtonsDiv>
    </SEDP5000Container>
  )
}

SEDP5000.propTypes = {
  seds: SedsPropType.isRequired,
  sedContent: PT.any.isRequired
}

export default SEDP5000
