import { PrintableTableSorter } from 'components/StyledComponents'
import { SakTypeMap, SakTypeValue, SedContent, SedContentMap } from 'declarations/buc.d'
import { ActiveSeds } from 'declarations/p5000'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import Alertstripe from 'nav-frontend-alertstriper'
import NavHighContrast, {
  Column,
  FlexEndSpacedDiv,
  HiddenDiv,
  HighContrastKnapp,
  PileCenterDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import PT from 'prop-types'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import TableSorter, { Sort } from 'tabell'
import * as labels from './SEDP5000.labels'

export interface SEDP5000SumProps {
  activeSeds: ActiveSeds
  highContrast: boolean
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

const mapState = (state: State): any => ({
  sakType: state.app.params.sakType as SakTypeValue
})

export type SEDP5000SumRows = Array<SEDP5000SumRow>

const SEDP5000Sum: React.FC<SEDP5000SumProps> = ({
  activeSeds, highContrast,  sedContent
}: SEDP5000SumProps) => {
  const { t } = useTranslation()

  const { sakType } = useSelector<State, any>(mapState)
  const componentRef = useRef(null)
  const [_itemsPerPage] = useState<number>(30)
  const [_printDialogOpen, setPrintDialogOpen] = useState<boolean>(false)
  const [_tableSort, setTableSort] = useState<Sort>({ column: '', order: 'none' })

  const convertRawP5000toRow = (sedContent: SedContent): SEDP5000SumRows => {
    const res: SEDP5000SumRows = []
    const data: any = {}
    const medlemskap = sedContent?.pensjon?.medlemskapboarbeid?.medlemskap
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
          data[m.type]['5_1'].aar += (m.sum?.aar ? parseInt(m.sum?.aar) : 0)
          data[m.type]['5_1'].maaneder += (m.sum?.maaneder ? parseInt(m.sum?.maaneder) : 0)
          data[m.type]['5_1'].dager += (m.sum?.dager?.nr ? parseInt(m.sum?.dager?.nr) : 0)

          if (data[m.type]['5_1'].dager >= 30) {
            const extraMonths = Math.floor(data[m.type]['5_1'].dager / 30)
            const remainingDays = (data[m.type]['5_1'].dager) % 30
            data[m.type]['5_1'].dager = remainingDays
            data[m.type]['5_1'].maaneder += extraMonths
          }
          if (data[m.type]['5_1'].maaneder >= 12) {
            const extraYears = Math.floor(data[m.type]['5_1'].maaneder / 12)
            const remainingMonths = (data[m.type]['5_1'].maaneder) % 12
            data[m.type]['5_1'].maaneder = remainingMonths
            data[m.type]['5_1'].aar += extraYears
          }
        }
        data[m.type]['5_2'].aar = data[m.type]['5_2'].aar + (m.sum?.aar ? parseInt(m.sum?.aar) : 0)
        data[m.type]['5_2'].maaneder = data[m.type]['5_2'].maaneder + (m.sum?.maaneder ? parseInt(m.sum?.maaneder) : 0)
        data[m.type]['5_2'].dager = data[m.type]['5_2'].dager + (m.sum?.dager?.nr ? parseInt(m.sum?.dager?.nr) : 0)

        if (data[m.type]['5_2'].dager >= 30) {
          const extraMonths = Math.floor(data[m.type]['5_2'].dager / 30)
          const remainingDays = (data[m.type]['5_2'].dager) % 30
          data[m.type]['5_2'].dager = remainingDays
          data[m.type]['5_2'].maaneder += extraMonths
        }
        if (data[m.type]['5_2'].maaneder >= 12) {
          const extraYears = Math.floor(data[m.type]['5_2'].maaneder / 12)
          const remainingMonths = (data[m.type]['5_2'].maaneder) % 12
          data[m.type]['5_2'].maaneder = remainingMonths
          data[m.type]['5_2'].aar += extraYears
        }
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

  const getItems = (): SEDP5000SumRows => {
    let res: SEDP5000SumRows = []
    Object.keys(activeSeds).forEach((key: string) => {
      if (activeSeds[key]) {
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
        <Row>
          <Column/>
          <Column>
            <FlexEndSpacedDiv style={{ flexDirection: 'row-reverse' }}>
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
            </FlexEndSpacedDiv>
          </Column>
        </Row>
        <VerticalSeparatorDiv />
        {sakType === SakTypeMap.GJENLEV && (
          <>
            <Row>
              <Column>
                <Alertstripe type='advarsel'>
                  {t('buc:warning-P5000SumGjenlevende')}
                </Alertstripe>
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
      </PileCenterDiv>
      <VerticalSeparatorDiv size='3' />
    </NavHighContrast>
  )
}

SEDP5000Sum.propTypes = {
  highContrast: PT.bool.isRequired,
  sedContent: PT.any.isRequired
}

export default SEDP5000Sum
