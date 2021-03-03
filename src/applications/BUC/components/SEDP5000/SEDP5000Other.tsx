import HelpIcon from 'assets/icons/HelpIcon'
import Trashcan from 'assets/icons/Trashcan'
import Select from 'components/Select/Select'
import { AllowedLocaleString } from 'declarations/app.d'
import { SedContentMap, Seds } from 'declarations/buc'
import { SedsPropType } from 'declarations/buc.pt'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { Checkbox } from 'nav-frontend-skjema'
import NavHighContrast, { HighContrastKnapp, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import PT from 'prop-types'
import Tooltip from 'rc-tooltip'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactToPrint from 'react-to-print'
import styled from 'styled-components'
import TableSorter, { Item, Sort } from 'tabell'

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
export const FlexDiv = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-end;
  justify-content: space-between;
`
export const FullWidthDiv = styled.div`
  width: 100%;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
`
export const SEDP5000Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export interface SEDP5000Props {
  highContrast: boolean
  locale: AllowedLocaleString
  seds: Seds
  sedContent: SedContentMap
}

export interface SEDP5000OtherRow extends Item {
  type: string
  startdato: string
  sluttdato: string
  dag: string
  mnd: string
  aar: string
  ytelse: string
  beregning: string
  ordning: string
}

export type SEDP5000OtherRows = Array<SEDP5000OtherRow>

const SEDP5000Overview: React.FC<SEDP5000Props> = ({
  highContrast, sedContent
}: SEDP5000Props) => {
  const { t } = useTranslation()
  const componentRef = useRef(null)
  const [_checkbox42, setCheckbox42] = useState<boolean>(false)
  const [_printDialogOpen, setPrintDialogOpen] = useState<boolean>(false)
  const [_tableSort, setTableSort] = useState<Sort>({ column: '', order: 'none' })
  const [_items, setItems] = useState<SEDP5000OtherRows | undefined>(undefined)

  const x = (x: any) => {
    setItems(x)
  }
  const convertRawP5000toRow = (sedContent: SedContentMap): SEDP5000OtherRows => {
    const res: SEDP5000OtherRows = []
    const data: any = {}

    Object.keys(sedContent).forEach((k: string) => {
      const medlemskap = sedContent[k].pensjon?.medlemskap
      medlemskap?.forEach((m: any) => {
        if (!_.isNil(m) && m.type) {
          if (!Object.prototype.hasOwnProperty.call(data, m.type)) {
            data[m.type] = {
              startdato: '09.04.1994',
              sluttdato: '09.04.1994',
              dag: '2',
              mnd: '8',
              aar: '11',
              ytelse: '111',
              beregning: '111',
              ordning: '00'
            }
          }
        }
      })
    })

    Object.keys(data).sort(
      (a, b) => (parseInt(a, 10) - parseInt(b, 10))
    ).forEach((type: string) => {
      // @ts-ignore
      const label = labels.type[type]
      res.push({
        ...data[type],
        key: type + '' + new Date().getTime(),
        type: label + ' [' + type + ']'
      })
    })

    return res
  }

  const beforePrintOut = (): void => {}

  const prepareContent = (): void => {
    standardLogger('buc.edit.tools.P5000.summary.print.button')
    setPrintDialogOpen(true)
  }

  const afterPrintOut = (): void => {
    setPrintDialogOpen(false)
  }

  const renderButtonsCell = (item: any, value: any, { items }: any): JSX.Element => {
    return (
      <ButtonsDiv>
        <HighContrastKnapp
          kompakt
          mini
          onClick={(e: any) => {
            e.preventDefault()
            e.stopPropagation()
            let newItems = _.cloneDeep(items)
            newItems = _.filter(newItems, i => i.key !== item.key)
            x(newItems)
          }}
        >
          <Trashcan />
        </HighContrastKnapp>
      </ButtonsDiv>
    )
  }

  useEffect(() => {
    if (_items === undefined) {
      x(convertRawP5000toRow(sedContent))
    }
  }, [_items, sedContent])

  if (_items === undefined) {
    return <div />
  }

  return (
    <NavHighContrast highContrast={highContrast}>
      <SEDP5000Container>
        <SEDP5000Header>
          <FlexDiv>
            <FullWidthDiv>
              <label className='skjemaelement__label'>
                {t('buc:p5000-4-1-title')}
              </label>
              <Select
                className='sedP5000Other-select'
                highContrast={highContrast}
                label='Ytelsestype (4.1)'
                options={[{ label: 'Alderspensjon', value: 'Alderspensjon' }]}
              />
            </FullWidthDiv>
            <HorizontalSeparatorDiv />
            <Checkbox
              data-test-id='a-buc-c-sedp5000other__checkbox'
              checked={_checkbox42}
              id='a-buc-c-sedp5000_other__checkbox'
              onChange={() => setCheckbox42(!_checkbox42)}
              label={(
                <CheckboxLabel>
                  <span>
                    {t('buc:p5000-4-2-title')}
                  </span>
                </CheckboxLabel>
              )}
            />
            <HorizontalSeparatorDiv />
            <Tooltip placement='top' trigger={['hover']} overlay={<span>{t('help')}</span>}>
              <div style={{ minWidth: '28px' }}>
                <HelpIcon className='hjelpetekst__ikon' height={28} width={28} />
              </div>
            </Tooltip>
          </FlexDiv>
          <FlexDiv />
        </SEDP5000Header>
        <VerticalSeparatorDiv data-size='0.5'>&nbsp;</VerticalSeparatorDiv>
        <TableSorter
          highContrast={highContrast}
          items={_items}
          context={{
            items: _items
          }}
          editable
          searchable={false}
          selectable={false}
          sortable
          onColumnSort={(sort: any) => {
            standardLogger('buc.edit.tools.P5000.other.sort', { sort: sort })
            setTableSort(sort)
          }}
          onRowAdded={(item: any) => {
            const newItems = _.cloneDeep(_items)
            newItems.unshift({
              ...item,
              key: '' + new Date().getTime()
            })
            x(newItems)
          }}
          itemsPerPage={25}
          labels={labels}
          compact
          categories={[{
            colSpan: 3,
            label: ''
          }, {
            colSpan: 3,
            label: t('buc:Periodesum')
          }, {
            colSpan: 4,
            label: ''
          }]}
          columns={[
            { id: 'type', label: t('buc:p5000-type-43113'), type: 'string' },
            { id: 'startdato', label: t('ui:startDate'), type: 'string' },
            { id: 'sluttdato', label: t('ui:endDate'), type: 'string' },
            { id: 'dag', label: t('ui:day'), type: 'string' },
            { id: 'mnd', label: t('ui:month'), type: 'string' },
            { id: 'aar', label: t('ui:year'), type: 'string' },
            { id: 'ytelse', label: t('buc:p5000-ytelse'), type: 'string' },
            { id: 'beregning', label: t('ui:calculationInformation'), type: 'string' },
            { id: 'ordning', label: t('ui:scheme'), type: 'string' },
            { id: 'buttons', label: '', type: 'buttons', renderCell: renderButtonsCell }
          ]}
        />
        <HiddenDiv>
          <div ref={componentRef} id='printJS-form'>
            <PrintableTableSorter
              // important to it re-renders when sorting changes
              key={JSON.stringify(_tableSort)}
              className='print-version'
              items={_items}
              editable={false}
              animatable={false}
              searchable={false}
              selectable={false}
              sortable
              sort={_tableSort}
              itemsPerPage={9999}
              labels={labels}
              compact
              categories={[{
                colSpan: 3,
                label: ''
              }, {
                colSpan: 3,
                label: t('buc:Periodesum')
              }, {
                colSpan: 4,
                label: ''
              }]}
              columns={[
                { id: 'type', label: t('buc:p5000_type_43113'), type: 'string' },
                { id: 'startdato', label: t('ui:startDate'), type: 'string' },
                { id: 'sluttdato', label: t('ui:endDate'), type: 'string' },
                { id: 'dag', label: t('ui:day'), type: 'string' },
                { id: 'mnd', label: t('ui:month'), type: 'string' },
                { id: 'aar', label: t('ui:year'), type: 'string' },
                { id: 'ytelse', label: t('buc:p5000-ytelse'), type: 'string' },
                { id: 'beregning', label: t('ui:calculationInformation'), type: 'string' },
                { id: 'ordning', label: t('ui:scheme'), type: 'string' }
              ]}
            />
          </div>
        </HiddenDiv>
        <VerticalSeparatorDiv data-size='2' />
        <ButtonsDiv>
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
          <HorizontalSeparatorDiv />
          <HighContrastKnapp
            onCLick={() => {}}
          >
            {t('buc:form-send-to-RINA')}
          </HighContrastKnapp>
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
