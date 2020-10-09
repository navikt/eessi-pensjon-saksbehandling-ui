import WarningCircle from 'assets/icons/WarningCircle'
import Alert from 'components/Alert/Alert'
import { HighContrastKnapp, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'components/StyledComponents'
import useWindowDimensions from 'components/WindowDimension/WindowDimension'
import { Participant, SedContent, SedContentMap, Seds } from 'declarations/buc'
import { SedsPropType } from 'declarations/buc.pt'
import { AllowedLocaleString } from 'declarations/app.d'
import Flag from 'flagg-ikoner'
import CountryData from 'land-verktoy'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import { Checkbox, Select } from 'nav-frontend-skjema'
import { Normaltekst } from 'nav-frontend-typografi'
import { theme, themeHighContrast, themeKeys } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactToPrint from 'react-to-print'
import styled, { ThemeProvider } from 'styled-components'
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
const CustomCheckbox = styled(Checkbox)`
  margin-bottom: 0.5rem;
`
const CustomSelect = styled(Select)`
  select {
    color: ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]};
    background-color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
  }
`
const FlexDiv = styled.div`
  display: flex;
`
export const HiddenDiv = styled.div`
  display: none;
`
const MarginDiv = styled.div`
  margin-left: 1rem;
  margin-right: 1rem;
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
const Sender = styled.div`
  display: flex;
  align-items: center;
`
const SeparatorSpan = styled.span`
  margin-left: 0.25rem;
  margin-right: 0.25rem;
`

type ActiveSeds = {[k: string]: boolean}

type EmptyPeriodsReport = {[k: string]: boolean}

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

export interface SEDP5000Row {
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

export type SEDP5000Rows = Array<SEDP5000Row>

const SEDP5000: React.FC<SEDP5000Props> = ({
  highContrast, locale, seds, sedContent
}: SEDP5000Props) => {
  const { t } = useTranslation()
  const { height } = useWindowDimensions()
  const componentRef = useRef(null)
  const [_activeSeds, setActiveSeds] = useState<ActiveSeds>(_.mapValues(_.keyBy(seds, 'id'), () => true))
  const [_itemsPerPage, setItemsPerPage] = useState<number>(height < 800 ? 15 : height < 1200 ? 20 : 25)
  const [_printDialogOpen, setPrintDialogOpen] = useState<boolean>(false)
  const [_tableSort, setTableSort] = useState<Sort>({ column: '', order: 'none' })

  const convertRawP5000toRow = (sedId: string, sedContent: SedContent): SEDP5000Rows => {
    const res: SEDP5000Rows = []
    const sender: SedSender | undefined = getSedSender(sedId)
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
        } as SEDP5000Row)
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
        acronym: sender.organisation.acronym
      }
    }
    return undefined
  }

  const getItems = (): SEDP5000Rows => {
    let res: SEDP5000Rows = []
    Object.keys(_activeSeds).forEach((key: string) => {
      if (_activeSeds[key]) {
        res = res.concat(convertRawP5000toRow(key, sedContent[key]))
      }
    })
    return res
  }

  const getEmptyPeriodsReport = (): EmptyPeriodsReport => {
    const res: EmptyPeriodsReport = {}
    Object.keys(_activeSeds).forEach((key: string) => {
      if (_activeSeds[key]) {
        res[key] = sedContent[key]?.pensjon?.medlemskapAnnen?.length > 0
      }
    })
    return res
  }

  const hasEmptyPeriods = (emptyPeriodsReport: EmptyPeriodsReport): boolean => {
    return Object.values(emptyPeriodsReport).indexOf(true) >= 0
  }

  const beforePrintOut = (): void => {
  }

  const prepareContent = (): void => {
    standardLogger('buc.edit.tools.P5000.print.button')
    setPrintDialogOpen(true)
  }

  const afterPrintOut = (): void => {
    setPrintDialogOpen(false)
  }

  const changeActiveSed = (sedId: string): void => {
    const newActiveSeds = _.cloneDeep(_activeSeds)
    newActiveSeds[sedId] = !_activeSeds[sedId]
    setActiveSeds(newActiveSeds)
  }

  const itemsPerPageChanged = (e: any): void => {
    standardLogger('buc.edit.tools.P5000.itemsPerPage.select', { value: e.target.value })
    setItemsPerPage(e.target.value === 'all' ? 9999 : parseInt(e.target.value, 10))
  }

  const items = getItems()
  const emptyPeriodReport: EmptyPeriodsReport = getEmptyPeriodsReport()
  const warning = hasEmptyPeriods(emptyPeriodReport)

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <SEDP5000Container>
        <SEDP5000Header>
          <SEDP5000Checkboxes>
            {Object.keys(_activeSeds).map(sedId => {
              const sender: SedSender | undefined = getSedSender(sedId)
              return (
                <CustomCheckbox
                  data-test-id={'a-buc-c-sedp5000__checkbox-' + sedId}
                  checked={_activeSeds[sedId]}
                  key={sedId}
                  id={'a-buc-c-sedp5000__checkbox-' + sedId}
                  onChange={() => changeActiveSed(sedId)}
                  label={(
                    <CheckboxLabel>
                      <span>
                        {t('buc:form-dateP5000', { date: sender?.date })}
                      </span>
                      <SeparatorSpan>-</SeparatorSpan>
                      {sender ? (
                        <Sender>
                          <Flag
                            country={sender?.country}
                            label={sender?.countryLabel}
                            size='XS'
                            type='circle'
                          />
                          <span>{sender?.countryLabel}</span>
                          <SeparatorSpan>-</SeparatorSpan>
                          <span>{sender?.institution}</span>
                        </Sender>
                      ) : sedId}
                      {emptyPeriodReport[sedId] && (
                        <>
                          <HorizontalSeparatorDiv data-size='0.5' />
                          <WarningCircle />
                        </>
                      )}
                    </CheckboxLabel>
                  )}
                />
              )
            })}
          </SEDP5000Checkboxes>
          <FlexDiv>
            {warning && (
              <MarginDiv>
                <Alert
                  type='client'
                  fixed={false}
                  status='WARNING'
                  message={t('buc:form-P5000-warning')}
                />
              </MarginDiv>
            )}
            <CustomSelect
              bredde='l'
              id='itemsPerPage'
              label={t('ui:itemsPerPage')}
              onChange={itemsPerPageChanged}
              value={_itemsPerPage === 9999 ? 'all' : '' + _itemsPerPage}
            >
              <option value='15'>15</option>
              <option value='20'>20</option>
              <option value='25'>25</option>
              <option value='all'>{t('ui:all')}</option>
            </CustomSelect>
          </FlexDiv>
        </SEDP5000Header>
        <VerticalSeparatorDiv data-size='0.5'>&nbsp;</VerticalSeparatorDiv>
        <TableSorter
          highContrast={highContrast}
          items={items}
          searchable
          selectable={false}
          sortable
          onColumnSort={(sort: any) => {
            standardLogger('buc.edit.tools.P5000.sort', { sort: sort })
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
        <ButtonsDiv>
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
        </ButtonsDiv>
      </SEDP5000Container>
    </ThemeProvider>
  )
}

SEDP5000.propTypes = {
  highContrast: PT.bool.isRequired,
  locale: PT.oneOf<AllowedLocaleString>(['en', 'nb']).isRequired,
  seds: SedsPropType.isRequired,
  sedContent: PT.any.isRequired
}

export default SEDP5000
