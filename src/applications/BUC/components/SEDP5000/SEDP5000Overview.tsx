import WarningCircle from 'assets/icons/WarningCircle'
import Alert from 'components/Alert/Alert'
import { PrintableTableSorter, SeparatorSpan } from 'components/StyledComponents'
import { AllowedLocaleString } from 'declarations/app.d'
import { Participant, SedContent, SedContentMap, Seds } from 'declarations/buc'
import { SedsPropType } from 'declarations/buc.pt'
import { ActiveSeds, EmptyPeriodsReport, SedSender } from 'declarations/p5000'
import Flag from 'flagg-ikoner'
import CountryData from 'land-verktoy'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import { Checkbox, Select } from 'nav-frontend-skjema'
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
import NavHighContrast, {
  Column,
  FlexCenterDiv,
  FlexEndSpacedDiv,
  FlexStartDiv,
  HiddenDiv,
  HighContrastKnapp,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  PileDiv,
  PileEndDiv,
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
import * as labels from './SEDP5000.labels'

const CustomSelect = styled(Select)`
  select {
    color: ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]};
    background-color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
  }
`

export interface SEDP5000OverviewProps {
  highContrast: boolean
  locale: AllowedLocaleString
  seds: Seds
  sedContent: SedContentMap
}

export interface SEDP5000OverviewRow {
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

export type SEDP5000OverviewRows = Array<SEDP5000OverviewRow>

const SEDP5000Overview: React.FC<SEDP5000OverviewProps> = ({
  highContrast, locale, seds, sedContent
}: SEDP5000OverviewProps) => {
  const { t } = useTranslation()
  const componentRef = useRef(null)
  const [_activeSeds, setActiveSeds] = useState<ActiveSeds>(_.mapValues(_.keyBy(seds, 'id'), () => true))
  const [_itemsPerPage, setItemsPerPage] = useState<number>(30)
  const [_printDialogOpen, setPrintDialogOpen] = useState<boolean>(false)
  const [_tableSort, setTableSort] = useState<Sort>({ column: '', order: 'none' })

  const convertRawP5000toRow = (sedId: string, sedContent: SedContent): SEDP5000OverviewRows => {
    const res: SEDP5000OverviewRows = []
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
          } as SEDP5000OverviewRow)
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

  const getItems = (): SEDP5000OverviewRows => {
    let res: SEDP5000OverviewRows = []
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
    standardLogger('buc.edit.tools.P5000.overview.print.button')
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
    standardLogger('buc.edit.tools.P5000.overview.itemsPerPage.select', { value: e.target.value })
    setItemsPerPage(e.target.value === 'all' ? 9999 : parseInt(e.target.value, 10))
  }

  const items = getItems()
  const emptyPeriodReport: EmptyPeriodsReport = getEmptyPeriodsReport()
  const warning = hasEmptyPeriods(emptyPeriodReport)

  return (
    <NavHighContrast highContrast={highContrast}>
      <VerticalSeparatorDiv />
      <PileCenterDiv>
        <Row>
          <Column>
            <PileDiv>
              <UndertekstBold>
                {t('buc:p5000-active-seds')}:
              </UndertekstBold>
              <VerticalSeparatorDiv size='0.5' />
              {Object.keys(_activeSeds).map(sedId => {
                const sender: SedSender | undefined = getSedSender(sedId)
                return (
                  <div key={sedId}>
                    <Checkbox
                      data-test-id={'a-buc-c-sedp5000__checkbox-' + sedId}
                      checked={_activeSeds[sedId]}
                      key={sedId}
                      id={'a-buc-c-sedp5000__checkbox-' + sedId}
                      onChange={() => changeActiveSed(sedId)}
                      label={(
                        <FlexEndSpacedDiv style={{ flexWrap: 'wrap' }}>
                          <span>
                            {t('buc:form-dateP5000', { date: sender?.date })}
                          </span>
                          <SeparatorSpan>-</SeparatorSpan>
                          {sender
                            ? (
                              <FlexCenterDiv>
                                <Flag
                                  country={sender?.country}
                                  label={sender?.countryLabel}
                                  size='XS'
                                  type='circle'
                                />
                                <HorizontalSeparatorDiv size='0.2' />
                                <span>{sender?.countryLabel}</span>
                                <SeparatorSpan>-</SeparatorSpan>
                                <span>{sender?.institution}</span>
                              </FlexCenterDiv>
                              )
                            : sedId}
                          {emptyPeriodReport[sedId] && (
                            <>
                              <HorizontalSeparatorDiv size='0.5' />
                              <WarningCircle />
                            </>
                          )}
                        </FlexEndSpacedDiv>
                  )}
                    />
                    <VerticalSeparatorDiv size='0.5' />
                  </div>
                )
              })}
            </PileDiv>
          </Column>
          <Column>
            <PileEndDiv>
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
              <VerticalSeparatorDiv />
              <FlexStartDiv>
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
              </FlexStartDiv>
            </PileEndDiv>
          </Column>
        </Row>
        <VerticalSeparatorDiv />
        {warning && (
          <>
            <Row>
              <Column>
                <Alert
                  type='client'
                  fixed={false}
                  status='WARNING'
                  message={t('buc:form-P5000-warning')}
                />
                <HorizontalSeparatorDiv />
              </Column>
              <Column />
            </Row>
            <VerticalSeparatorDiv />
          </>
        )}
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

SEDP5000Overview.propTypes = {
  highContrast: PT.bool.isRequired,
  locale: PT.oneOf<AllowedLocaleString>(['en', 'nb']).isRequired,
  seds: SedsPropType.isRequired,
  sedContent: PT.any.isRequired
}

export default SEDP5000Overview
