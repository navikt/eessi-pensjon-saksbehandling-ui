import { resetSentP5000info, sendP5000toRina } from 'actions/p5000'
import HelpIcon from 'assets/icons/HelpIcon'
import Alert from 'components/Alert/Alert'
import Select from 'components/Select/Select'
import { OneLineSpan } from 'components/StyledComponents'
import { LocalStorageValue, Option, Options } from 'declarations/app.d'
import { P5000FromRinaMap, Seds } from 'declarations/buc'
import { SedsPropType } from 'declarations/buc.pt'
import { P5000ListRow, P5000ListRows, P5000SED, P5000TableContext, P5000UpdatePayload } from 'declarations/p5000'
import { State } from 'declarations/reducers'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import * as Moment from 'moment'
import { extendMoment } from 'moment-range'
import Alertstripe from 'nav-frontend-alertstriper'
import EtikettBase from 'nav-frontend-etiketter'
import { Select as NavSelect } from 'nav-frontend-skjema'
import { Normaltekst } from 'nav-frontend-typografi'
import {
  AlignEndRow,
  Column,
  FlexCenterDiv,
  FlexDiv,
  FlexEndDiv,
  FullWidthDiv,
  HiddenDiv,
  HighContrastHovedknapp,
  HighContrastInput,
  HighContrastKnapp,
  HighContrastLink,
  HighContrastRadio,
  HighContrastRadioGroup,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  PileDiv,
  themeKeys,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import PT from 'prop-types'
import Tooltip from 'rc-tooltip'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import styled from 'styled-components'
import Table, { Column as TableColumn, RenderEditableOptions, Sort } from 'tabell'
import { convertFromP5000ListRowsIntoP5000SED, convertP5000SEDToP5000ListRows } from './conversion'
import P5000HelpModal from './P5000HelpModal'
import { P5000EditValidate, P5000EditValidationProps } from './validation'

const moment = extendMoment(Moment)

const CustomSelect = styled(NavSelect)`
  select {
    color: ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]};
    background-color: ${({ theme }) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
  }
`
const MyAlert = styled(Alert)`
  position: relative !important;
`

export interface DatePieces {
  years: number
  months: number
  days: number
}

const mapState = (state: State): any => ({
  highContrast: state.ui.highContrast,
  sentP5000info: state.p5000.sentP5000info,
  sendingP5000info: state.loading.sendingP5000info
})

export interface P5000EditProps {
  caseId: string
  seds: Seds
  p5000FromRinaMap: P5000FromRinaMap
  p5000FromStorage: LocalStorageValue<P5000SED> | undefined
  saveP5000ToStorage: ((newSed: P5000SED, sedId: string) => void) | undefined
  removeP5000FromStorage: ((sedId: string) => void) | undefined
}

export const ytelsestypeOptions: Options = [
  { label: '[00] Annet', value: '00' },
  { label: '[01] Annen delvis', value: '01' },
  { label: '[10] Alderspensjon', value: '10' },
  { label: '[11] Delvis alderspensjon', value: '11' },
  { label: '[20] Etterlattepensjon', value: '20' },
  { label: '[21] Etterlattepensjon delvis', value: '21' },
  { label: '[30] Uførepensjon', value: '30' },
  { label: '[31] Uførepensjon delvis', value: '31' }
]

export const typeOptions: Options = [
  { value: '10', label: '[10] Pliktige avgiftsperioder' },
  { value: '11', label: '[11] Pliktige avgiftsperioder - ansatt' },
  { value: '12', label: '[12] Pliktige avgiftsperioder - selvstendig næringsdrivende' },
  { value: '13', label: '[13] Pliktige avgiftsperioder - arbeidsledig' },
  { value: '20', label: '[20] Frivillige avgiftsperioder' },
  { value: '21', label: '[21] Frivillige avgiftsperioder - ansatt' },
  { value: '22', label: '[22] Frivillige avgiftsperioder - selvstendig' },
  { value: '23', label: '[23] Frivillige avgiftsperioder - arbeidsledig' },
  { value: '30', label: '[30] Bosettingsperioder' },
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

const P5000Edit: React.FC<P5000EditProps> = ({
  caseId,
  p5000FromRinaMap,
  p5000FromStorage,
  seds, // always array with 1 element
  removeP5000FromStorage,
  saveP5000ToStorage
}: P5000EditProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { highContrast, sentP5000info, sendingP5000info }: any = useSelector<State, any>(mapState)
  const componentRef = useRef(null)

  const [_items, sourceStatus] = convertP5000SEDToP5000ListRows(seds, 'edit', p5000FromRinaMap, p5000FromStorage)
  const [_itemsPerPage, _setItemsPerPage] = useState<number>(30)
  const [_printDialogOpen, _setPrintDialogOpen] = useState<boolean>(false)
  const [renderPrintTable, _setRenderPrintTable] = useState<boolean>(false)
  const [_tableSort, _setTableSort] = useState<Sort>({ column: '', order: 'none' })
  const [_showHelpModal, _setShowHelpModal] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useValidation<P5000EditValidationProps>({}, P5000EditValidate)
  const [_ytelseOption, _setYtelseOption] = useState<string | undefined>(
    !_.isNil(p5000FromStorage)
      ? p5000FromStorage?.content?.pensjon?.medlemskapboarbeid?.enkeltkrav?.krav
      : p5000FromRinaMap[seds[0].id]?.pensjon?.medlemskapboarbeid?.enkeltkrav?.krav
  )

  const [_forsikringEllerBosetningsperioder, _setForsikringEllerBosetningsperioder] = useState<string | undefined>(
    !_.isNil(p5000FromStorage)
      ? p5000FromStorage?.content?.pensjon?.medlemskapboarbeid?.gyldigperiode
      : p5000FromRinaMap[seds[0].id]?.pensjon?.medlemskapboarbeid?.gyldigperiode
  )

  const beforePrintOut = (): void => {
    _setPrintDialogOpen(true)
  }

  const prepareContent = (): void => {
    _setRenderPrintTable(true)
    standardLogger('buc.edit.tools.P5000.edit.print.button')
  }

  const afterPrintOut = (): void => {
    _setPrintDialogOpen(false)
    _setRenderPrintTable(false)
  }

  const onSave = (payload: P5000UpdatePayload) => {
    let templateForP5000: P5000SED | undefined = _.cloneDeep(p5000FromStorage?.content)
    if (_.isNil(templateForP5000)) {
      templateForP5000 = _.cloneDeep(p5000FromRinaMap[seds[0].id])
    }
    if (templateForP5000) {
      const newP5000FromStorage: P5000SED = convertFromP5000ListRowsIntoP5000SED(payload, seds[0].id, templateForP5000)
      saveP5000ToStorage!(newP5000FromStorage, seds[0].id)
    }
  }

  const renderTypeEdit = (options: RenderEditableOptions) => {
    return (
      <Select
        key={'c-table__edit-type-select-key-'}
        id='c-table__edit-type-select-id'
        className='P5000Edit-type-select input-focus'
        highContrast={highContrast}
        feil={options.feil}
        options={typeOptions}
        menuPortalTarget={document.body}
        onChange={(e) => options.setValue({ type: e!.value })}
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

  const dateTransform = (s: undefined | string | Date): string | undefined => {
    if (s === undefined) {
      return undefined
    }
    if (_.isDate(s)) {
      return moment(s).format('DD.MM.YYYY')
    }
    const r = s.match('^(\\d{2})(\\d{2})(\\d{2})$')
    if (r !== null) {
      const matchedDay = r[1]
      const matchedMonth = r[2]
      const matchedYear = r[3]
      const matchedYearInt = parseInt(matchedYear)
      //  010139 => 01.01.2039. 010140 => 01.01.1940
      const fullYear = matchedYearInt < 40 ? `20${matchedYear}` : `19${matchedYear}`
      return `${matchedDay}.${matchedMonth}.${fullYear}`
    }
    return s
  }

  const calculateDateDiff = (rawStartDato: string | undefined, rawSluttDato: string | undefined): DatePieces | null => {
    let validStartDato: string | undefined
    let validSluttDato: string | undefined

    if (rawStartDato?.trim().match('^[0-3][0-9][0-1][0-9]{3}$')) {
      validStartDato = dateTransform(rawStartDato?.trim())
    }
    if (rawSluttDato?.trim().match('^[0-3][0-9][0-1][0-9]{3}$')) {
      validSluttDato = dateTransform(rawSluttDato.trim())
    }
    if (rawStartDato?.trim().match('^[0-3][0-9]\\.[0-1][0-9]\\.\\d{4}$')) {
      validStartDato = rawStartDato.trim()
    }
    if (rawSluttDato?.trim().match('^[0-3][0-9]\\.[0-1][0-9]\\.\\d{4}$')) {
      validSluttDato = rawSluttDato.trim()
    }
    if (!validSluttDato || !validStartDato) {
      return null
    }
    const startdato: Moment.Moment | undefined = moment(validStartDato, 'DD.MM.YYYY')
    const sluttdato: Moment.Moment | undefined = moment(validSluttDato, 'DD.MM.YYYY')

    if (!startdato.isValid() || !sluttdato.isValid()) {
      return null
    }

    // make the diff calculation include the starting day,
    // so the diff between 01.01.YYYY and 02.01.YYYY is 2 days, not 1
    startdato.add(-1, 'days')

    let years = sluttdato.diff(startdato, 'years')
    startdato.add(years, 'years')
    let months = sluttdato.diff(startdato, 'months')
    startdato.add(months, 'months')
    let days = sluttdato.diff(startdato, 'days')

    // from 01.01.1970 to 31.12.1079 --> convert 30/11/8 d/m/y to 0/0/9
    // from 01.05.1995 to 31.12.2017 --> convert 30/7/22 d/y/m to 0/8/22
    if (days === 30) {
      days = 0
      months += 1
    }

    if (months === 12) {
      months = 0
      years += 1
    }

    return {
      years: years,
      months: months,
      days: days
    }
  }

  const maybeDoSomePrefill = (startdato: string | undefined, sluttdato: string | undefined, options: RenderEditableOptions<P5000TableContext>) => {
    const dates: DatePieces | null = calculateDateDiff(startdato, sluttdato)
    if (dates) {
      if (options.context.forsikringEllerBosetningsperioder === '1') {
        options.setValue({
          dag: dates.days,
          aar: dates.years,
          mnd: dates.months
        })
      }
      if (options.context.forsikringEllerBosetningsperioder === '0') {
        options.setValue({
          dag: 0,
          aar: 0,
          mnd: 0
        })
      }
    }
  }

  const renderStartDatoEdit = (options: RenderEditableOptions<P5000TableContext>) => (
    <HighContrastInput
      id='c-table__edit-startdato-input-id'
      className='c-table__edit-input'
      label=''
      feil={options.feil}
      placeholder={t('buc:placeholder-date2')}
      onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
        const otherDate: string | undefined = dateTransform(options.values.sluttdato)
        maybeDoSomePrefill(e.target.value, otherDate, options)
      }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.setValue({
        startdato: e.target.value
      })}
      value={dateTransform(options.value) ?? ''}
    />
  )

  const renderSluttDatoEdit = (options: RenderEditableOptions<P5000TableContext>) => (
    <HighContrastInput
      id='c-table__edit-sluttdato-input-id'
      className='c-table__edit-input'
      label=''
      feil={options.feil}
      placeholder={t('buc:placeholder-date2')}
      onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
        const otherDate: string | undefined = dateTransform(options.values.startdato)
        maybeDoSomePrefill(otherDate, e.target.value, options)
      }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.setValue({
        sluttdato: e.target.value
      })}
      value={dateTransform(options.value) ?? ''}
    />
  )

  const renderDager = (item: any) => {
    return (
      <Normaltekst>
        {item.dag}
      </Normaltekst>
    )
  }

  const checkForBosetningsperioder = (options: RenderEditableOptions<P5000TableContext>, what: string, others: Array<string>) => {
    let _value: string | number
    /*
      if forsikringEllerBosetningsperioder is true, render dag/mmd/aar as '' if they are nil or 0
      BUT if we have non-0 values in the other fields, leave it as 0 if it was 0

      if forsikringEllerBosetningsperioder is false, render dag/mmd/aar as 0 if they are nil or ''
     */

    if (options.context.forsikringEllerBosetningsperioder === '1') {
      if (options.value === 0 && options.values[others[0]] === 0 && options.values[others[1]] === 0) {
        options.setValue({
          [what]: '',
          [others[0]]: '',
          [others[1]]: ''
        })
        _value = ''
        return _value
      } else {
        _value = options.value
      }
    } else {
      if (_.isNil(options.value) || options.value === '') {
        _value = 0
      } else {
        _value = options.value
      }
    }
    if (_value !== options.value) {
      options.setValue({
        [what]: _value
      })
    }
    return _value
  }

  const renderDagerEdit = (options: RenderEditableOptions<P5000TableContext>) => {
    const value = checkForBosetningsperioder(options, 'dag', ['mnd', 'aar'])
    return (
      <HighContrastInput
        aria-invalid={!!options.feil}
        aria-label='dag'
        data-test-id='c-table__edit-dag-input-id'
        feil={options.feil}
        id='c-table__edit-dag-input-id'
        label=''
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          options.setValue({
            dag: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
          })
        }}
        placeholder=''
        value={'' + value}
      />
    )
  }

  const renderManedEdit = (options: RenderEditableOptions<P5000TableContext>) => {
    const value = checkForBosetningsperioder(options, 'mnd', ['dag', 'aar'])
    return (
      <HighContrastInput
        aria-invalid={!!options.feil}
        aria-label='mnd'
        data-test-id='c-table__edit-mnd-input-id'
        feil={options.feil}
        id='c-table__edit-mnd-input-id'
        label=''
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          options.setValue({
            mnd: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
          })
        }}
        placeholder=''
        value={'' + value}
      />
    )
  }

  const renderAarEdit = (options: RenderEditableOptions<P5000TableContext>) => {
    const value = checkForBosetningsperioder(options, 'aar', ['mnd', 'dag'])
    return (
      <HighContrastInput
        aria-invalid={!!options.feil}
        aria-label='aar'
        data-test-id='c-table__edit-aar-input-id'
        feil={options.feil}
        id='c-table__edit-aar-input-id'
        label=''
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          options.setValue({
            aar: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
          })
        }}
        placeholder=''
        value={'' + value}
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

  const renderOrdningEdit = (options: RenderEditableOptions) => (
    <Normaltekst>
      {options.value}
    </Normaltekst>
  )

  const renderStatus = (item: any, value: any) => {
    if (value === 'rina') {
      return <EtikettBase mini type='info'>RINA</EtikettBase>
    }
    if (value === 'new') {
      return <EtikettBase mini type='suksess'>Ny</EtikettBase>
    }
    if (value === 'edited') {
      return <EtikettBase mini type='fokus'>Endret</EtikettBase>
    }
    return <div />
  }

  const renderBeregningEdit = (options: RenderEditableOptions) => {
    return (
      <HighContrastInput
        id='c-table__edit-beregning-input-id'
        className='c-table__edit-input'
        label=''
        feil={options.feil}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.setValue({
          beregning: e.target.value
        })}
        value={options.value}
      />
    )
  }

  const setYtelseOption = (o: Option | null) => {
    _resetValidation('P5000Edit-ytelse-select')
    _setYtelseOption(o?.value)
    onSave({
      ytelseOption: o?.value
    })
  }

  const setForsikringEllerBosetningsperioder = (value: string) => {
    // _resetValidation('P5000Edit-ytelse-select')
    _setForsikringEllerBosetningsperioder(value)
    onSave({
      forsikringEllerBosetningsperioder: value
    })
  }

  const testDate = (value: undefined | null | string | Date): boolean => {
    if (_.isNil(value)) {
      return false
    }
    if (_.isDate(value)) {
      return true
    }
    if (value.match('^(\\d{2}\\.\\d{2}\\.\\d{4})')) {
      return moment(value, 'DD.MM.YYYY').isValid()
    }
    if (value.match('^\\d{6}')) {
      return moment(dateTransform(value), 'DD.MM.YYYY').isValid()
    }
    return false
  }

  const testFloat = (value: undefined | null | string): boolean => {
    if (_.isNil(value)) {
      return false
    }
    try {
      const _value = parseFloat(value)
      return value === '' + _value && _value >= 0
    } catch (error) {
      return false
    }
  }

  const itemsPerPageChanged = (e: any): void => {
    _setItemsPerPage(e.target.value === 'all' ? 9999 : parseInt(e.target.value, 10))
  }

  const onRowSelectChange = (items: P5000ListRows) => {
    let newItems: P5000ListRows = _.cloneDeep(_items)
    newItems = newItems.map(item => {
      const newItem = _.cloneDeep(item)
      const found: boolean = _.find(items, (it: P5000ListRow) => it.key === newItem.key) !== undefined
      newItem.selected = found
      return newItem
    })
    onSave({
      items: newItems
    })
  }

  const onRowsChanged = (items: P5000ListRows) => {
    onSave({
      items: items
    })
  }

  const handleOverforTilRina = () => {
    const valid: boolean = _performValidation({
      p5000sed: p5000FromStorage?.content!
    })
    if (valid) {
      const payload: P5000SED = _.cloneDeep(p5000FromStorage!.content)
      payload.pensjon.medlemskapTotal?.forEach((p, i) => {
        const period = _.cloneDeep(p)
        delete period.key
        payload.pensjon.medlemskapTotal[i] = period
      })
      payload.pensjon.trygdetid?.forEach((p, i) => {
        const period = _.cloneDeep(p)
        delete period.key
        payload.pensjon.trygdetid[i] = period
      })
      payload.pensjon.medlemskapboarbeid.medlemskap?.forEach((p, i) => {
        const period = _.cloneDeep(p)
        delete period.key
        delete period.selected
        payload.pensjon.medlemskapboarbeid.medlemskap[i] = period
      })
      if (window.confirm(t('buc:form-areYouSureSendToRina'))) {
        dispatch(sendP5000toRina(caseId, seds[0].id, payload))
      }
    }
  }

  const renderDateCell = (item: P5000ListRow, value: any) => (
    <Normaltekst>{_.isDate(value) ? moment(value).format('DD.MM.YYYY') : value}</Normaltekst>
  )

  const resetP5000 = () => {
    dispatch(resetSentP5000info())
  }

  const beforeRowEdited = (item: P5000ListRow, context: P5000TableContext) => {
    const startdato = moment(dateTransform(item.startdato), 'DD.MM.YYYY')
    const sluttdato = moment(dateTransform(item.sluttdato), 'DD.MM.YYYY')

    if (startdato.isValid() && sluttdato.isValid()) {
      if (startdato.isAfter(sluttdato)) {
        if (!item.feil) {
          item.feil = {}
        }
        item.feil = {
          ...item.feil,
          startdato: t('buc:validation-endDateBeforeStartDate')
        }
        return false
      }
      const range = moment.range(startdato, sluttdato)
      let overlapError: boolean = false

      for (let i = 0; i < context.items.length; i++) {
        const otherItem: P5000ListRow = context.items[i]
        if (item.key === otherItem.key) {
          continue
        }
        const thisRange = moment.range(moment(otherItem.startdato), moment(otherItem.sluttdato))
        if (item.type === otherItem.type && range.overlaps(thisRange)) {
          item.feil = {
            ...item.feil,
            startdato: t('buc:validation-overlapDate', {
              perioder: moment(otherItem.startdato).format('DD.MM.YYYY') + '/' + moment(otherItem.sluttdato).format('DD.MM.YYYY')
            })
          }
          overlapError = true
          break
        }
      }
      return !overlapError
    }
    return true
  }

  const beforeRowAdded = (columns: Array<TableColumn<P5000ListRow, P5000TableContext>>, context: P5000TableContext) => {
    const typeValue = _.find(columns, { id: 'type' })?.edit?.value
    const startdatovalue: string | undefined = _.find(columns, { id: 'startdato' })?.edit?.value
    const startdatoindex: number = _.findIndex(columns, { id: 'sluttdato' })
    const sluttdatovalue: string | undefined = _.find(columns, { id: 'sluttdato' })?.edit?.value
    const sluttdatoindex: number = _.findIndex(columns, { id: 'sluttdato' })
    const startdato = moment(dateTransform(startdatovalue), 'DD.MM.YYYY')
    const sluttdato = moment(dateTransform(sluttdatovalue), 'DD.MM.YYYY')

    if (startdato.isValid() && sluttdato.isValid()) {
      if (startdato.isAfter(sluttdato)) {
        columns[sluttdatoindex].feil = t('buc:validation-endDateBeforeStartDate')
        return false
      }
      const range = moment.range(startdato, sluttdato)
      let overlapError: boolean = false

      for (let i = 0; i < context.items.length; i++) {
        const item: P5000ListRow = context.items[i]
        const thisRange = moment.range(moment(item.startdato), moment(item.sluttdato))
        if (item.type === typeValue && range.overlaps(thisRange)) {
          columns[startdatoindex].feil = t('buc:validation-overlapDate', {
            perioder: moment(item.startdato).format('DD.MM.YYYY') + '/' + moment(item.sluttdato).format('DD.MM.YYYY')
          })
          overlapError = true
          break
        }
      }
      return !overlapError
    }
    return true
  }

  useEffect(() => {
    if (!_.isNil(sentP5000info) && !_.isNil(p5000FromStorage)) {
      if (removeP5000FromStorage) {
        removeP5000FromStorage(seds[0].id)
      }
    }
  }, [sentP5000info, removeP5000FromStorage, p5000FromStorage, seds])

  if (_items === undefined) {
    return <div />
  }

  const canSend = !!_ytelseOption

  return (
    <>
      <VerticalSeparatorDiv />
      {_showHelpModal && <P5000HelpModal highContrast={highContrast} onClose={() => _setShowHelpModal(false)} />}
      <PileCenterDiv>
        <PileDiv>
          <AlignEndRow>
            <Column>
              <FullWidthDiv>
                <Select
                  key={'ytelse' + _ytelseOption}
                  className='P5000Edit-ytelse-select'
                  feil={_validation['P5000Edit-ytelse-select']?.feilmelding}
                  highContrast={highContrast}
                  id='P5000Edit-ytelse-select'
                  label={t('buc:p5000-4-1-title')}
                  menuPortalTarget={document.body}
                  options={ytelsestypeOptions}
                  onChange={setYtelseOption}
                  selectedValue={_.find(ytelsestypeOptions, y => y.value === _ytelseOption) ?? null}
                  defaultValue={_.find(ytelsestypeOptions, y => y.value === _ytelseOption) ?? null}
                />
              </FullWidthDiv>
            </Column>
            <Column>
              <FlexCenterDiv>
                <HighContrastRadioGroup
                  feil={_validation['P5000Edit-forsikringEllerBosetningsperioder']?.feilmelding}
                  id='P5000Edit-forsikringEllerBosetningsperioder'
                  legend={(
                    <FlexCenterDiv>
                      <OneLineSpan>
                        {t('buc:p5000-4-2-title')}
                      </OneLineSpan>
                      <HorizontalSeparatorDiv />
                      <Tooltip
                        placement='top' trigger={['hover']} overlay={(
                          <>
                            <Normaltekst>{t('buc:help-p5000-1')}</Normaltekst>
                            <Normaltekst>{t('buc:help-p5000-2')}</Normaltekst>
                          </>
                    )}
                      >
                        <div style={{ width: '28px', height: '28px' }}>
                          <HelpIcon className='hjelpetekst__ikon' height={28} width={28} />
                        </div>
                      </Tooltip>
                    </FlexCenterDiv>
              )}
                >
                  <FlexEndDiv>
                    <HighContrastRadio
                      name='42'
                      checked={_forsikringEllerBosetningsperioder === '1'}
                      label={t('ui:yes')}
                      onClick={() => setForsikringEllerBosetningsperioder('1')}
                    />
                    <HorizontalSeparatorDiv />
                    <HighContrastRadio
                      name='42'
                      checked={_forsikringEllerBosetningsperioder === '0'}
                      label={t('ui:no')}
                      onClick={() => setForsikringEllerBosetningsperioder('0')}
                    />
                  </FlexEndDiv>
                </HighContrastRadioGroup>
              </FlexCenterDiv>
            </Column>
            <HorizontalSeparatorDiv />
            <Column>
              <FlexEndDiv style={{ flexDirection: 'row-reverse' }}>
                <CustomSelect
                  id='itemsPerPage'
                  bredde='s'
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
              </FlexEndDiv>
            </Column>
            <Column>
              <FlexEndDiv>
                <HighContrastHovedknapp
                  disabled={sendingP5000info || !canSend}
                  spinner={sendingP5000info}
                  onClick={handleOverforTilRina}
                >
                  {sendingP5000info ? t('ui:sending') : t('buc:form-send-to-RINA')}
                </HighContrastHovedknapp>
                <HorizontalSeparatorDiv />
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
                  content={() => componentRef.current}
                />
              </FlexEndDiv>
            </Column>
          </AlignEndRow>
          <VerticalSeparatorDiv />
          <AlignEndRow>
            <Column />
            <Column flex='2'>
              {sentP5000info === null && (
                <MyAlert
                  status='WARNING' message={(
                    <FlexDiv>
                      <Normaltekst>
                        {t('buc:warning-failedP5000Sending')}
                      </Normaltekst>
                      <HighContrastHovedknapp
                        onClick={resetP5000}
                      >OK
                      </HighContrastHovedknapp>
                    </FlexDiv>
                )}
                />
              )}
              {!_.isNil(sentP5000info) && (
                <MyAlert
                  status='OK' message={(
                    <FlexDiv>
                      <Normaltekst>
                        {t('buc:warning-okP5000Sending', { caseId: caseId })}
                      </Normaltekst>
                      <HighContrastHovedknapp
                        onClick={resetP5000}
                      >OK
                      </HighContrastHovedknapp>
                    </FlexDiv>
                )}
                />
              )}
            </Column>
            <Column>
              {sourceStatus !== 'rina' && (
                <div style={{ whiteSpace: 'nowrap' }}>
                  <span>
                    {t('buc:p5000-saved-working-copy')}
                  </span>
                  <HorizontalSeparatorDiv size='0.5' />
                  <HighContrastLink style={{ display: 'inline-block' }} href='#' onClick={() => _setShowHelpModal(true)}>
                    {t('ui:hva-betyr-det')}
                  </HighContrastLink>
                </div>
              )}
            </Column>
          </AlignEndRow>
          <VerticalSeparatorDiv />
          <AlignEndRow>
            <Column>
              <Alertstripe type='advarsel'>
                <FlexCenterDiv>
                  {t('buc:warning-P5000Edit-instructions-li1')}
                  <HorizontalSeparatorDiv size='0.5' />
                  <Tooltip
                    placement='top' trigger={['hover']} overlay={(
                      <div style={{ maxWidth: '600px' }}>
                        <Normaltekst>{t('buc:warning-P5000Edit-instructions-li1-help')}</Normaltekst>
                      </div>
                  )}
                  >
                    <div style={{ minWidth: '28px' }}>
                      <HelpIcon className='hjelpetekst__ikon' height={28} width={28} />
                    </div>
                  </Tooltip>
                </FlexCenterDiv>
              </Alertstripe>
            </Column>
            <Column />
          </AlignEndRow>
          <VerticalSeparatorDiv />
          <hr style={{ width: '100%' }} />
          <VerticalSeparatorDiv />
          <Table<P5000ListRow, P5000TableContext>
            key={'P5000Edit-table-' + _itemsPerPage + '-sort-' + JSON.stringify(_tableSort)}
            animatable={false}
            highContrast={highContrast}
            items={_items}
            loading={!!sentP5000info}
            context={{
              items: _items,
              forsikringEllerBosetningsperioder: _forsikringEllerBosetningsperioder
            }}
            editable
            allowNewRows
            searchable={false}
            selectable
            coloredSelectedRow={false}
            onRowSelectChange={onRowSelectChange}
            sortable
            onColumnSort={(sort: any) => {
              standardLogger('buc.edit.tools.P5000.edit.sort', { sort: sort })
              _setTableSort(sort)
            }}
            onRowsChanged={onRowsChanged}
            beforeRowAdded={beforeRowAdded}
            beforeRowEdited={beforeRowEdited}
            itemsPerPage={_itemsPerPage}
            compact
            categories={[{
              colSpan: 4,
              label: '',
              border: false
            }, {
              colSpan: 3,
              label: t('buc:Periodesum')
            }, {
              colSpan: 4,
              label: '',
              border: false
            }]}
            columns={[
              {
                id: 'status',
                label: t('ui:status'),
                type: 'string',
                renderCell: renderStatus,
                edit: {
                  defaultValue: 'new',
                  render: () => <div />
                }
              },
              {
                id: 'type',
                label: t('buc:p5000-type-43113'),
                type: 'string',
                edit: {
                  render: renderTypeEdit,
                  validation: [{
                    mandatory: (context: P5000TableContext) => (context.forsikringEllerBosetningsperioder !== '0'),
                    test: '^.+$',
                    message: t('buc:validation-chooseType')
                  }]
                },
                renderCell: renderType
              },
              {
                id: 'startdato',
                label: t('ui:startDate'),
                type: 'date',
                renderCell: renderDateCell,
                edit: {
                  render: renderStartDatoEdit,
                  validation: [{
                    mandatory: (context: P5000TableContext) => (context.forsikringEllerBosetningsperioder !== '0'),
                    test: testDate,
                    message: t('buc:validation-invalidDate')
                  }],
                  placeholder: t('buc:placeholder-date2'),
                  transform: dateTransform
                }
              },
              {
                id: 'sluttdato',
                label: t('ui:endDate'),
                type: 'date',
                renderCell: renderDateCell,
                edit: {
                  render: renderSluttDatoEdit,
                  validation: [{
                    mandatory: (context: P5000TableContext) => (context.forsikringEllerBosetningsperioder === '1'),
                    test: testDate,
                    message: t('buc:validation-invalidDate')
                  }],
                  placeholder: t('buc:placeholder-date2'),
                  transform: dateTransform
                }
              },
              {
                id: 'aar',
                label: t('ui:year'),
                type: 'string',
                edit: {
                  defaultValue: 0,
                  validation: [{
                    test: testFloat,
                    message: t('buc:validation-addPositiveNumber')
                  }],
                  render: renderAarEdit
                }
              },
              {
                id: 'mnd',
                label: t('ui:month'),
                type: 'string',
                edit: {
                  defaultValue: 0,
                  validation: [{
                    test: testFloat,
                    message: t('buc:validation-addPositiveNumber')
                  }],
                  render: renderManedEdit
                }
              },
              {
                id: 'dag',
                label: t('ui:day'),
                type: 'string',
                renderCell: renderDager,
                edit: {
                  defaultValue: 0,
                  render: renderDagerEdit,
                  validation: [{
                    test: testFloat,
                    message: t('buc:validation-addPositiveNumber')
                  }]
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
                  validation: [{
                    test: '^.+$',
                    message: t('buc:validation-addBeregning')
                  }],
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
                type: 'buttons'
              }
            ]}
          />
          <VerticalSeparatorDiv />
          {renderPrintTable && (
            <HiddenDiv>
            <div ref={componentRef} id='printJS-form'>
              <Table
              // important to it re-renders when sorting changes
                className='print-version'
                items={_items}
                editable={false}
                animatable={false}
                searchable={false}
                selectable={false}
                sortable
                sort={_tableSort}
                itemsPerPage={9999}
                labels={{}}
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
                  { id: 'status', label: t('ui:status'), type: 'string' },
                  { id: 'type', label: t('buc:p5000-type-43113'), type: 'string', renderCell: renderType },
                  { id: 'startdato', label: t('ui:startDate'), type: 'string', renderCell: renderDateCell },
                  { id: 'sluttdato', label: t('ui:endDate'), type: 'string', renderCell: renderDateCell },
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
          )}
        </PileDiv>
      </PileCenterDiv>
      <VerticalSeparatorDiv size='3' />
    </>
  )
}

P5000Edit.propTypes = {
  seds: SedsPropType.isRequired,
  p5000FromRinaMap: PT.any.isRequired
}

export default P5000Edit
