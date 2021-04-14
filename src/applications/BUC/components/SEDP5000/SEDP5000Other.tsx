import HelpIcon from 'assets/icons/HelpIcon'
import Trashcan from 'assets/icons/Trashcan'
import Select from 'components/Select/Select'
import { AllowedLocaleString } from 'declarations/app.d'
import { SedContentMap, Seds } from 'declarations/buc'
import { SedsPropType } from 'declarations/buc.pt'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment, { Moment } from 'moment'
import { Checkbox } from 'nav-frontend-skjema'
import { Normaltekst } from 'nav-frontend-typografi'
import NavHighContrast, {
  HighContrastInput,
  HighContrastKnapp,
  HighContrastRadio,
  HighContrastRadioGroup,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import PT from 'prop-types'
import Tooltip from 'rc-tooltip'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactToPrint from 'react-to-print'
import styled from 'styled-components'
import TableSorter, { Context, Item, RenderEditableOptions, Sort } from 'tabell'

import * as labels from './SEDP5000.labels'

export const ButtonsDiv = styled.div`
  margin-top: '1.5rem;
  margin-bottom: '1.5rem;
`
export const Flex = styled.div`
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
export const FlexCenterDiv = styled(FlexDiv)`
  align-items: center;
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
export const OneLineSpan = styled.span`
  white-space: nowrap;
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
  dag: number
  mnd: number
  aar: number
  ytelse: string
  beregning: string
  ordning: string
}

export type SEDP5000OtherRows = Array<SEDP5000OtherRow>

export interface DatePieces {
  years: number
  months: number
  days: number
}

export interface TableContext extends Context {
  items: SEDP5000OtherRows
  seeAsSum: boolean,
  forsikringElklerBosetningsperioder: boolean
}

const SEDP5000Overview: React.FC<SEDP5000Props> = ({
  highContrast, sedContent
}: SEDP5000Props) => {
  const { t } = useTranslation()
  const componentRef = useRef(null)
  const [_forsikringElklerBosetningsperioder, setForsikringElklerBosetningsperioder] = useState<boolean>(true)
  const [_printDialogOpen, setPrintDialogOpen] = useState<boolean>(false)
  const [_tableSort, setTableSort] = useState<Sort>({ column: '', order: 'none' })
  const [_ytelseOption, setYtelseOption] = useState<any | undefined>(undefined)
  const [_items, setItems] = useState<SEDP5000OtherRows | undefined>(undefined)
  const [_seeAsSum, setSeeAsSum] = useState<boolean>(false)

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

  const renderTypeEdit = (options: RenderEditableOptions) => {
    return (
      <Select
        key={'c-tableSorter__edit-type-select-key-' + options.value}
        id='c-tableSorter__edit-type-select-id'
        className='sedP5000Other-type-select'
        highContrast={highContrast}
        feil={options.feil}
        options={typeOptions}
        onChange={(e) => {
          setYtelseOption(e!.value)
          options.setValue({
            'type': e!.value
          })
        }}
        defaultValue={_.find(typeOptions, o => o.value === options.value)}
        selectedValue={_.find(typeOptions, o => o.value === options.value)}
      />
    )
  }

  const renderType = (item: any, value: any) => {
    return (
      <Normaltekst>
        {_.find(typeOptions, t => t.value === value)?.label || t('buc:status-unknown')}
      </Normaltekst>
    )
  }

  const dateTransform = (s: string): string => {
    const r = s.match('^(\\d{2})(\\d{2})(\\d{2})$')
    if (r !== null) {
      const matchedDay = r[1]
      const matchedMonth = r[2]
      const matchedYear = r[3]
      const matchedYearInt = parseInt(matchedYear)
      const currentYear = new Date().getFullYear().toString() // "2010"
      const startPartOfYear = currentYear.substring(0, 2) // "2010" => "20"
      const startPartOfYearInt = parseInt(startPartOfYear) // "20" => 20
      const endPartOfYear = currentYear.substring(2) // "2010" => "10"
      const endPartOfYearInt = parseInt(endPartOfYear) // "10" => 10
      const fullYear = matchedYearInt < endPartOfYearInt ? `${startPartOfYear}${matchedYear}` : `${startPartOfYearInt - 1}${matchedYear}`
      return `${matchedDay}.${matchedMonth}.${fullYear}`
    }
    return s
  }

  const calculateDateDiff = (rawStartDato: string | undefined, rawSluttDato: string | undefined): DatePieces | null => {
    let startdato: Moment | undefined = undefined
    let sluttdato: Moment | undefined = undefined
    let validStartDato: string | undefined = undefined
    let validSluttDato: string | undefined = undefined

    if (rawStartDato?.match('^\\d{6}$')) {
      validStartDato = dateTransform(rawStartDato)
    }
    if (rawSluttDato?.match('^\\d{6}$')) {
      validSluttDato = dateTransform(rawSluttDato)
    }
    if (rawStartDato?.match('(\\d{2}\\.\\d{2}\\.\\d{4}|[0-3][0-9][0-1][0-9]{3})')) {
      validStartDato = rawStartDato
    }
    if (rawSluttDato?.match('(\\d{2}\\.\\d{2}\\.\\d{4}|[0-3][0-9][0-1][0-9]{3})')) {
      validSluttDato = rawSluttDato
    }
    if (!validSluttDato || !validStartDato) {
      return null
    }
    startdato = moment(validStartDato, 'DD.MM.YYYYY')
    sluttdato = moment(validSluttDato, 'DD.MM.YYYYY')

    let years = sluttdato.diff(startdato, 'years')
    startdato.add(years, 'years')
    let months = sluttdato.diff(startdato, 'months')
    startdato.add(months, 'months')
    let days = sluttdato.diff(startdato, 'days')
    return {
      years: years,
      months: months,
      days: days
    }
  }

  const maybeDoSomePrefill = (startdato: string, sluttdato: string, options: RenderEditableOptions<TableContext>) => {
    let dates: DatePieces | null = calculateDateDiff(startdato, sluttdato)
    if (dates) {
      if (options.context.forsikringElklerBosetningsperioder) {
        options.setValue({
          dag: dates.days,
          aar: dates.years,
          mnd: dates.months
        })
      } else {
        options.setValue({
          dag: 0,
          aar: 0,
          mnd: 0
        })
      }
    }
  }

  const renderStartDatoEdit = (options: RenderEditableOptions<TableContext>) => (
    <HighContrastInput
      id='c-tableSorter__edit-startdato-input-id'
      className='c-tableSorter__edit-input'
      label=''
      feil={options.feil}
      placeholder={t('buc:placeholder-date2')}
      onBlur={(e: React.ChangeEvent<HTMLInputElement>) => maybeDoSomePrefill(e.target.value, options.values.sluttdato, options)}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.setValue({
        startdato: e.target.value
      })}
      value={options.value}
    />
  )

  const rendersluttDatoEdit = (options: RenderEditableOptions<TableContext>) => (
    <HighContrastInput
      id='c-tableSorter__edit-sluttdato-input-id'
      className='c-tableSorter__edit-input'
      label=''
      feil={options.feil}
      placeholder={t('buc:placeholder-date2')}
      onBlur={(e: React.ChangeEvent<HTMLInputElement>) => maybeDoSomePrefill(options.values.startdato, e.target.value, options)}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.setValue({
        sluttdato: e.target.value
      })}
      value={options.value}
    />
  )

  const renderDager = (item: any) => {
    return (
      <Normaltekst>
        {item.dag + '/7'}
      </Normaltekst>
    )
  }

  const renderDagerEdit = (options: RenderEditableOptions) => {
    return (
      <HighContrastInput
        type='number'
        id='c-tableSorter__edit-dag-input-id'
        className='c-tableSorter__edit-input'
        label=''
        feil={options.feil}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.setValue({
          dag: parseInt(e.target.value)
        })}
        value={options.value}
      />
    )
  }

  const renderManedEdit = (options: RenderEditableOptions) => {
    return (
      <HighContrastInput
        type='number'
        id='c-tableSorter__edit-maned-input-id'
        className='c-tableSorter__edit-input'
        label=''
        feil={options.feil}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.setValue({
          mnd: parseInt(e.target.value)
        })}
        value={options.value}
      />
    )
  }

  const renderAarEdit = (options: RenderEditableOptions) => {
     return (
      <HighContrastInput
        type='number'
        id='c-tableSorter__edit-aar-input-id'
        className='c-tableSorter__edit-input'
        label=''
        feil={options.feil}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.setValue({
          aar: parseInt(e.target.value)
        })}
        value={options.value}
      />
    )
  }

  const renderYtelseEdit = (options: RenderEditableOptions) => {
    let valueToShow = options.value
    if (options.values && !_.isNil(options.values.type)) {
      if ((options.values.type === '43' || options.values.type === '45') && options.value !== '') {
        options.setValue({
          ytelse: ''
        })
        valueToShow = ''
      }
      if (!(options.values.type === '43' || options.values.type === '45') && options.value === '') {
        options.setValue({
          ytelse: '111'
        })
        valueToShow = '111'
      }
    }
    return (
      <Normaltekst>
        {valueToShow}
      </Normaltekst>
    )
  }

  const renderBeregningEdit = (options: RenderEditableOptions) => {
    return (
      <HighContrastInput
        id='c-tableSorter__edit-beregning-input-id'
        className='c-tableSorter__edit-input'
        label=''
        feil={options.feil}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.setValue({
          beregning: e.target.value
        })}
        value={options.value}
      />
    )
  }

  const renderOrdningEdit = (options: RenderEditableOptions) => {
    return (
      <Normaltekst>
        {options.value}
      </Normaltekst>
    )
  }

  const convertRawP5000toRow = (sedContent: SedContentMap): SEDP5000OtherRows => {
    const res: SEDP5000OtherRows = []

    Object.keys(sedContent).forEach((k: string) => {
      const medlemskap = sedContent[k].pensjon?.medlemskap
      medlemskap?.forEach((m: any) => {
        if (!_.isNil(m) && m.type) {
          let item = {
            type: m.type,
            startdato: m.periode?.fom ? moment(m.periode?.fom, 'YYYY-MM-DD').format('DD.MM.YYYY') : '-',
            sluttdato: m.periode?.tom ? moment(m.periode?.tom, 'YYYY-MM-DD').format('DD.MM.YYYY') : '-',
            aar: parseInt(m.sum?.aar) || 0,
            mnd: parseInt(m.sum?.maaneder) || 0,
            dag: parseInt(m.sum?.dager?.nr || 0),
            ytelse: m.relevans || '-',
            ordning: m.ordning || '-',
            beregning: m.beregning || '-'
          } as SEDP5000OtherRow
          item.key = 'raw-' + item.type + '-' + item.startdato + '-' + item.sluttdato
          res.push(item)
        }
      })
    })

    return res.sort(
      (a, b) => (parseInt(a.type, 10) - parseInt(b.type, 10))
    )
  }

  const sumItems = (items: SEDP5000OtherRows): SEDP5000OtherRows => {
    const res: SEDP5000OtherRows = []
    items.forEach((it) => {
      const found: number = _.findIndex(res, d => d.type === it.type)
      if (found === -1) {
        res.push({
          ...it,
          key: 'sum-' + it.type + '-' + it.startdato + '-' + it.sluttdato
        })
      } else {
        res[found].aar += it.aar
        res[found].mnd += it.mnd
        res[found].dag += it.dag
        res[found].startdato = moment(it.startdato, 'DD.MM.YYYY').isSameOrBefore(moment(res[found].startdato, 'DD.MM.YYYY')) ? it.startdato : res[found].startdato
        res[found].sluttdato = moment(it.sluttdato, 'DD.MM.YYYY').isSameOrAfter(moment(res[found].sluttdato, 'DD.MM.YYYY')) ? it.sluttdato : res[found].sluttdato
        res[found].key = 'sum-' + res[found].type + '-' + res[found].startdato + '-' + res[found].sluttdato
      }
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

  const renderButtons = (item: any, value: any, { seeAsSum, items }: any): JSX.Element => {
    if (seeAsSum) {
      return <div/>
    }
    return (
      <ButtonsDiv>
        <HighContrastKnapp
          kompakt
          mini
          onClick={(e: any) => {
            e.preventDefault()
            e.stopPropagation()
            const answer = window.confirm(t('buc:form-areYouSure'))
            if (answer) {
              let newItems = _.cloneDeep(items)
              newItems = _.filter(newItems, i => i.key !== item.key)
              setItems(newItems)
            }
          }}
        >
          <Trashcan />
        </HighContrastKnapp>
      </ButtonsDiv>
    )
  }

  useEffect(() => {
    if (_items === undefined) {
      let newItems = convertRawP5000toRow(sedContent)
      setItems(newItems)
    }
  }, [_items, sedContent])

  if (_items === undefined) {
    return <div />
  }

  return (
    <NavHighContrast highContrast={highContrast}>
      <SEDP5000Container>
        <SEDP5000Header>
          <FlexCenterDiv>
            <FullWidthDiv>
              <Select
                className='sedP5000Other-select'
                highContrast={highContrast}
                label={t('buc:p5000-4-1-title')}
                options={ytelsestypeOptions}
                onChange={setYtelseOption}
                selectedValue={_ytelseOption}
                defaultValue={_ytelseOption}
              />
            </FullWidthDiv>
            <HorizontalSeparatorDiv />
            <HighContrastRadioGroup
              legend={(
                <OneLineSpan>
                  {t('buc:p5000-4-2-title')}
                </OneLineSpan>
              )}
             >
              <Flex>
                <HighContrastRadio
                  name={'42'}
                  checked={_forsikringElklerBosetningsperioder === true}
                  label={t('ui:yes')}
                  onClick={() => setForsikringElklerBosetningsperioder(true)}
                />
                <HorizontalSeparatorDiv/>
                <HighContrastRadio
                  name={'42'}
                  checked={_forsikringElklerBosetningsperioder === false}
                  label={t('ui:no')}
                  onClick={() => setForsikringElklerBosetningsperioder(false)}
                />
              </Flex>
            </HighContrastRadioGroup>
            <HorizontalSeparatorDiv />
            <Tooltip placement='top' trigger={['hover']} overlay={<span>{t('help')}</span>}>
              <div style={{ minWidth: '28px' }}>
                <HelpIcon className='hjelpetekst__ikon' height={28} width={28} />
              </div>
            </Tooltip>
          </FlexCenterDiv>
          <HorizontalSeparatorDiv/>
          <FlexDiv>
            <Checkbox
              label={t('buc:form-seePeriodsAsSum')}
              checked={_seeAsSum}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSeeAsSum(e.target.checked)}
            />
          </FlexDiv>
        </SEDP5000Header>
        <TableSorter
          highContrast={highContrast}
          items={_seeAsSum ? sumItems(_items) : _items}
          context={{
            items: _items,
            seeAsSum: _seeAsSum,
            forsikringElklerBosetningsperioder: _forsikringElklerBosetningsperioder
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
              key: 'raw-' + item.type + '-' + item.startdato + '-' + item.sluttdato
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
            {
              id: 'type',
              label: t('buc:p5000-type-43113'),
              type: 'string',
              edit: {
                render: renderTypeEdit,
                validation: '.+'
              },
              renderCell: renderType
            },
            {
              id: 'startdato',
              label: t('ui:startDate'),
              type: 'string',
              edit: {
                render: renderStartDatoEdit,
                validation: '(\\d{2}\\.\\d{2}\\.\\d{4}|[0-3][0-9][0-1][0-9]{3})',
                validationMessage: t('buc:validation-badDate2'),
                transform: dateTransform
              }
            },
            {
              id: 'sluttdato',
              label: t('ui:endDate'),
              type: 'string',
              edit: {
                render: rendersluttDatoEdit,
                validation: '(\\d{2}\\.\\d{2}\\.\\d{4}|[0-3][0-9][0-1][0-9]{3})',
                placeholder: t('buc:placeholder-date2'),
                validationMessage: t('buc:validation-badDate2'),
                transform: dateTransform
              }
            },
            {
              id: 'dag',
              label: t('ui:day'),
              type: 'number',
              renderCell: renderDager,
              edit: {
                defaultValue: 0,
                render: renderDagerEdit
              }
            },
            {
              id: 'mnd',
              label: t('ui:month'),
              type: 'number',
              edit: {
                defaultValue: 0,
                validation: '\\d+',
                render: renderManedEdit
              }
            },
            {
              id: 'aar',
              label: t('ui:year'),
              type: 'number',
              edit: {
                defaultValue: 0,
                validation: '\\d+',
                render: renderAarEdit
              }
            },
            {
              id: 'ytelse',
              label: t('buc:p5000-ytelse'),
              type: 'string',
              edit: {
                defaultValue: '111',
                render: renderYtelseEdit
              }
              },
            {
              id: 'beregning',
              label: t('ui:calculationInformation'),
              type: 'string',
              edit: {
                defaultValue: '111',
                validation: '.+',
                render: renderBeregningEdit
              }
            },
            {
              id: 'ordning',
              label: t('ui:scheme'),
              type: 'string',
              edit: {
                defaultValue: '00',
                render: renderOrdningEdit
              }
            },
            {
              id: 'buttons',
              label: '',
              type: 'buttons',
              renderCell: renderButtons
            }
          ]}
        />
        <HiddenDiv>
          <div ref={componentRef} id='printJS-form'>
            <PrintableTableSorter
              // important to it re-renders when sorting changes
              key={JSON.stringify(_tableSort)}
              className='print-version'
              items={_seeAsSum ?  sumItems(_items) : _items}
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
                { id: 'type', label: t('buc:p5000-type-43113'), type: 'string', renderCell: renderType },
                { id: 'startdato', label: t('ui:startDate'), type: 'string' },
                { id: 'sluttdato', label: t('ui:endDate'), type: 'string' },
                { id: 'dag', label: t('ui:day'), type: 'number', renderCell: renderDager },
                { id: 'mnd', label: t('ui:month'), type: 'number' },
                { id: 'aar', label: t('ui:year'), type: 'number' },
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
