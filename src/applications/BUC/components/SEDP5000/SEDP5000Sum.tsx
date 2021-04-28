import {
  FlexCenterDiv,
  FlexDiv,
  FlexEndDiv,
  FlexStartDiv,
  HiddenDiv,
  PileDiv,
  PileCenterDiv,
  PrintableTableSorter,
  SEDP5000Header,
  SeparatorSpan
} from 'components/StyledComponents'
import { AllowedLocaleString } from 'declarations/app.d'
import { Participant, SedContent, SedContentMap, Seds } from 'declarations/buc'
import { SedsPropType } from 'declarations/buc.pt'
import { ActiveSeds, SedSender } from 'declarations/p5000'
import Flag from 'flagg-ikoner'
import CountryData from 'land-verktoy'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import { Checkbox } from 'nav-frontend-skjema'
import { UndertekstBold } from 'nav-frontend-typografi'
import NavHighContrast, { HighContrastKnapp, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import PT from 'prop-types'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactToPrint from 'react-to-print'
import TableSorter, { Sort } from 'tabell'
import * as labels from './SEDP5000.labels'

export interface SEDP5000Props {
  highContrast: boolean
  locale: AllowedLocaleString
  seds: Seds
  sedContent: SedContentMap
}

export interface SEDP5000SumRow {
  key: string
  type: string
  sec51aar: string
  sec51maned: string
  sec51dager: string
  sec52aar: string
  sec52maned: string
  sec52dager: string
}

export type SEDP5000SumRows = Array<SEDP5000SumRow>

const SEDP5000Sum: React.FC<SEDP5000Props> = ({
  highContrast, locale, seds, sedContent
}: SEDP5000Props) => {
  const { t } = useTranslation()
  const componentRef = useRef(null)
  const [_activeSeds, setActiveSeds] = useState<ActiveSeds>(_.mapValues(_.keyBy(seds, 'id'), () => true))
  const [_itemsPerPage] = useState<number>(30)
  const [_printDialogOpen, setPrintDialogOpen] = useState<boolean>(false)
  const [_tableSort, setTableSort] = useState<Sort>({ column: '', order: 'none' })

  const changeActiveSed = (sedId: string): void => {
    const newActiveSeds = _.cloneDeep(_activeSeds)
    newActiveSeds[sedId] = !_activeSeds[sedId]
    setActiveSeds(newActiveSeds)
  }

  const convertRawP5000toRow = (sedContent: SedContent): SEDP5000SumRows => {
    const res: SEDP5000SumRows = []
    const data: any = {}
    const medlemskap = sedContent?.pensjon?.medlemskap
    medlemskap?.forEach((m: any) => {
      if (!_.isNil(m) && m.type) {
        if (!Object.prototype.hasOwnProperty.call(data, m.type)) {
          data[m.type] = {
            '5_1': {
              aar: 0, maaneder: 0, dager: 0
            },
            '5_2': {
              aar: 0, maaneder: 0, dager: 0
            }
          }
        }
        if (m.type !== '45') {
          data[m.type]['5_1'].aar = data[m.type]['5_1'].aar + (m.sum?.aar ? parseInt(m.sum?.aar) : 0)
          data[m.type]['5_1'].maaneder = data[m.type]['5_1'].maaneder + (m.sum?.maaneder ? parseInt(m.sum?.maaneder) : 0)
          data[m.type]['5_1'].dager = data[m.type]['5_1'].dager + (m.sum?.dager?.nr ? parseInt(m.sum?.dager?.nr) : 0)
        }
        data[m.type]['5_2'].aar = data[m.type]['5_2'].aar + (m.sum?.aar ? parseInt(m.sum?.aar) : 0)
        data[m.type]['5_2'].maaneder = data[m.type]['5_2'].maaneder + (m.sum?.maaneder ? parseInt(m.sum?.maaneder) : 0)
        data[m.type]['5_2'].dager = data[m.type]['5_2'].dager + (m.sum?.dager?.nr ? parseInt(m.sum?.dager?.nr) : 0)
      }
    })

    Object.keys(data).sort(
      (a, b) => (parseInt(a, 10) - parseInt(b, 10))
    ).forEach((type: string) => {
      // @ts-ignore
      const label = labels.type[type]
      res.push({
        key: type,
        sec51aar: data[type]['5_1'].aar,
        sec51maned: data[type]['5_1'].maaneder,
        sec51dager: data[type]['5_1'].dager,
        sec52aar: data[type]['5_2'].aar,
        sec52maned: data[type]['5_2'].maaneder,
        sec52dager: data[type]['5_2'].dager,
        type: label + ' [' + type + ']'
      })
    })

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

  const getItems = (): SEDP5000SumRows => {
    let res: SEDP5000SumRows = []
    Object.keys(_activeSeds).forEach((key: string) => {
      if (_activeSeds[key]) {
        res = res.concat(convertRawP5000toRow(sedContent[key]))
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
      <PileCenterDiv>
        <SEDP5000Header>
          <PileDiv>
            <UndertekstBold>
              {t('buc:p5000-active-seds')}:
            </UndertekstBold>
            <VerticalSeparatorDiv data-size='0.5' />
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
                      <FlexEndDiv>
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
                              <HorizontalSeparatorDiv data-size='0.2' />
                              <span>{sender?.countryLabel}</span>
                              <SeparatorSpan>-</SeparatorSpan>
                              <span>{sender?.institution}</span>
                            </FlexCenterDiv>
                            )
                          : sedId}
                      </FlexEndDiv>
                    )}
                  />
                  <VerticalSeparatorDiv data-size='0.5' />
                </div>
              )
            })}
          </PileDiv>
          <FlexDiv>
            <FlexStartDiv>
              <ReactToPrint
                documentTitle='P5000Sum'
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
          </FlexDiv>
        </SEDP5000Header>
        <VerticalSeparatorDiv />
        <hr />
        <VerticalSeparatorDiv />
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
            label: t('buc:p5000-5-1-title')
          }, {
            colSpan: 3,
            label: t('buc:p5000-5-2-title')
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
        <VerticalSeparatorDiv data-size='2' />
      </PileCenterDiv>
    </NavHighContrast>
  )
}

SEDP5000Sum.propTypes = {
  highContrast: PT.bool.isRequired,
  locale: PT.oneOf<AllowedLocaleString>(['en', 'nb']).isRequired,
  seds: SedsPropType.isRequired,
  sedContent: PT.any.isRequired
}

export default SEDP5000Sum
