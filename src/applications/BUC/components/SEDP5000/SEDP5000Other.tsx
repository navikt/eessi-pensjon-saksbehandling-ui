import HelpIcon from 'assets/icons/HelpIcon'
import Trashcan from 'assets/icons/Trashcan'
import Select from 'components/Select/Select'
import { AllowedLocaleString } from 'declarations/app.d'
import { SedContentMap, Seds } from 'declarations/buc'
import { SedsPropType } from 'declarations/buc.pt'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { Checkbox } from 'nav-frontend-skjema'
import { Normaltekst } from 'nav-frontend-typografi'
import NavHighContrast, { HighContrastKnapp, HighContrastInput, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import PT from 'prop-types'
import Tooltip from 'rc-tooltip'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactToPrint from 'react-to-print'
import styled from 'styled-components'
import TableSorter, { Item, RenderEditableOptions, Sort } from 'tabell'

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
  const [_ytelseOption, setYtelseOption] = useState<any | undefined>(undefined)
  const [_items, setItems] = useState<SEDP5000OtherRows | undefined>(undefined)

  const ytelsestypeOptions = [
    { label: '[00] Annet', value: '00' },
    { label: '[01] Annen delvis', value: '01' },
    { label: '[10] Alderspensjon', value: '10' },
    { label: '[11] Delvis alderspensjon', value: '11' },
    { label: '[20] Etterlattepensjon', value: '20' },
    { label: '[21] Etterlattepensjon delvis', value: '21' },
    { label: '[30] Uførepensjon', value: '30' },
    { label: '[31] Uførepensjon delvis', value: '31' }
  ]

  const typeOptions = [
    { value: '10', label: '[10] Pliktige avgiftsperioder' },
    { value: '11', label: '[11] Pliktige avgiftsperioder - ansatt' },
    { value: '12', label: '[12] Pliktige avgiftsperioder - selvstendig næringsdrivende' },
    { value: '13', label: '[13] Pliktige avgiftsperioder - arbeidsledig' },
    { value: '20', label: '[20] Frivillige avgiftsperioder' },
    { value: '21', label: '[21] Frivillige avgiftsperioder - ansatt' },
    { value: '22', label: '[22] Frivillige avgiftsperioder - selvstendig' },
    { value: '23', label: '[23] Frivillige avgiftsperioder - arbeidsledig' },
    { value: '30', label: '[30] Bosettingingsperioder' },
    { value: '40', label: '[40] Likestilte perioder: uten nærmere spesifisering' },
    { value: '41', label: '[41] Likestilte perioder: perioder med sykdom/arbeidsuførhet' },
    { value: '42', label: '[42] Likestilte perioder: perioder med arbeidsledighet uten ytelser' },
    { value: '43', label: '[43] Likestilte perioder: perioder med militærtjeneste' },
    { value: '44', label: '[44] Likestilte perioder: perioder med opplæring eller utdanning' },
    { value: '45', label: '[45] Likestilte perioder: perioder med omsorg for barn' },
    { value: '46', label: '[46] Likestilte perioder: perioder med pensjon' },
    { value: '47', label: '[47] Likestilte perioder: perioder med svangerskaps- eller fødselspermisjon' },
    { value: '48', label: '[48] Likestilte perioder: perioder med førtidspensjon' },
    { value: '49', label: '[49] Likestilte perioder: perioder med arbeidsledighet med dagpenger' },
    { value: '50', label: '[50] Likestilte perioder: perioder hvor det er blitt innvilget uføretrygd' },
    { value: '51', label: '[51] Likestilte perioder: perioder med omsorg for pleietrengende' },
    { value: '52', label: '[52] Likestilte perioder: fiktive perioder etter inntrådt uførhet, dødsdato eller start på pensjon' }
  ]

  const renderEditType = (options: RenderEditableOptions) => {
    return (
      <Select
        key={'c-tableSorter__edit-type-select-key-' + options.defaultValue}
        id={'c-tableSorter__edit-type-select-id'}
        className='sedP5000Other-type-select'
        highContrast={highContrast}
        label='Ytelsestype (4.1)'
        feil={options.feil}
        options={typeOptions}
        onChange={(e) => {
          console.log(e)
          setYtelseOption(e!.value)
          options.onChange(e!.value)
        }}
        defaultValue={_.find(typeOptions, o => o.value === options.defaultValue)}
        selectedValue={options.defaultValue}
      />
    )
  }

  const renderTypeCell = (item: any, value: any) => {
    return <Normaltekst>
      {_.find(typeOptions, t => t.value === value)?.label || 'Ukjent'}
    </Normaltekst>
  }

  const dateTransform = (s: string) => {
    let r = s.match('^(\\d{2})(\\d{2})(\\d{2})$')
    if (r !== null) {
      const matchedYear = parseInt(r[3])
      const currentYear = new Date().getFullYear().toString()
      const startPartOfYear = parseInt(currentYear.substring(0,2)) // 2021 => 20
      const endPartOfYear = parseInt(currentYear.substring(2)) // 2021 => 21
      const fullYear = matchedYear < endPartOfYear ? `${startPartOfYear}${matchedYear}` : `${startPartOfYear - 1}${matchedYear}`
      return r[1] + '.' + r[2] + '.' + fullYear
    }
    return s
  }

  const renderEditOrdning = (options: RenderEditableOptions) => {
    if (options.defaultValue !== '00') {
      options.onChange('00')
    }
    return (
      <Normaltekst>
        00
      </Normaltekst>
    )
  }

  const renderEditYtelse = (options: RenderEditableOptions) => {
    let valueToShow = options.defaultValue
    if (options.values && (options.values['type'] === '43' || options.values['type'] === '45')) {
      if (options.defaultValue !== '') {
        options.onChange('')
        valueToShow = ''
      }
    } else {
      if (options.defaultValue !== '111') {
        valueToShow = '111'
        options.onChange('111')
      }
    }

    return (
      <Normaltekst>
        {valueToShow}
      </Normaltekst>
    )
  }


  const renderEditDager = (options: RenderEditableOptions) => {
    if (options.defaultValue !== '7') {
      options.onChange('7')
    }
    return (
      <Normaltekst>
        7
      </Normaltekst>
    )
  }

  const renderEditAar = (options: RenderEditableOptions) => {
    if (options.defaultValue !== '0' && (options.context as any).checkbox42) {
      options.onChange('0')
    }
    if (options.defaultValue === '0' && !(options.context as any).checkbox42) {
      options.onChange('')
    }
    return (
      <HighContrastInput
        id={'c-tableSorter__edit-aar-input-id'}
        className='c-tableSorter__edit-input'
        label=''
        feil={options.feil}
        onChange={(e: any) => options.onChange(e.target.value)}
        value={options.defaultValue}
      />
    )
  }

  const renderEditBeregning = (options: RenderEditableOptions) => {
    if (!options.defaultValue) {
      options.onChange('111')
    }
    return (
      <HighContrastInput
        id={'c-tableSorter__edit-beregning-input-id'}
        className='c-tableSorter__edit-input'
        label=''
        feil={options.feil}
        onChange={(e: any) => options.onChange(e.target.value)}
        value={options.defaultValue || '111'}
      />
    )
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
      res.push({
        ...data[type],
        key: type + '' + new Date().getTime(),
        type: type
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
            setItems(newItems)
          }}
        >
          <Trashcan />
        </HighContrastKnapp>
      </ButtonsDiv>
    )
  }

  useEffect(() => {
    if (_items === undefined) {
      setItems(convertRawP5000toRow(sedContent))
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
                options={ytelsestypeOptions}
                onChange={setYtelseOption}
                selectedValue={_ytelseOption}
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
            items: _items,
            checkbox42: _checkbox42
          }}
          editable
          searchable={false}
          selectable={false}
          sortable
          onColumnSort={(sort: any) => {
            standardLogger('buc.edit.tools.P5000.other.sort', { sort: sort })
            setTableSort(sort)
          }}
          onRowAdded={(item, context) => {
            const newItems = _.cloneDeep(context.items)
            newItems.unshift({
              ...item,
              key: '' + new Date().getTime()
            })
            setItems(newItems)
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
            { id: 'type', label: t('buc:p5000-type-43113'), type: 'string', edit: {
              render: renderEditType, validation: '.+'
            }, renderCell: renderTypeCell},
            { id: 'startdato', label: t('ui:startDate'), type: 'string', edit: {
              validation: '(\\d{2}\\.\\d{2}\\.\\d{4}|[0-3][0-9][0-1][0-9]{3})',
              placeholder: 'DD.MM.ÅÅÅÅ/DDMMÅÅ',
              validationMessage: 'Vennligst bruk DD-MM-ÅÅÅÅ eller DDMMÅÅ',
                transform: dateTransform
            }},
            { id: 'sluttdato', label: t('ui:endDate'), type: 'string', edit: {
              validation: '(\\d{2}\\.\\d{2}\\.\\d{4}|[0-3][0-9][0-1][0-9]{3})',
              placeholder: 'DD-MM-ÅÅÅÅ/DDMMÅÅ',
              validationMessage: 'Vennligst bruk DD-MM-ÅÅÅÅ eller DDMMÅÅ',
              transform: dateTransform
            }},
            { id: 'dag', label: t('ui:day'), type: 'string', edit: { render: renderEditDager } },
            { id: 'mnd', label: t('ui:month'), type: 'string', edit: { validation: '\\d+'} },
            { id: 'aar', label: t('ui:year'), type: 'string', edit: { validation: '\\d+', render: renderEditAar} },
            { id: 'ytelse', label: t('buc:p5000-ytelse'), type: 'string', edit: { render: renderEditYtelse } },
            { id: 'beregning', label: t('ui:calculationInformation'), type: 'string', edit: {
              validation: '.+', render: renderEditBeregning} },
            { id: 'ordning', label: t('ui:scheme'), type: 'string', edit: {render: renderEditOrdning } },
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
