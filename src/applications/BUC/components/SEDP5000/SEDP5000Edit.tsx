import { sendP5000toRina } from 'actions/buc'
import { SEDP5000EditValidate, SEDP5000EditValidationProps } from 'applications/BUC/components/SEDP5000/validation'
import HelpIcon from 'assets/icons/HelpIcon'
import Trashcan from 'assets/icons/Trashcan'
import Select from 'components/Select/Select'
import {
  FlexCenterDiv,
  FlexDiv,
  FlexEndDiv,
  FlexStartDiv,
  FullWidthDiv,
  HiddenDiv,
  OneLineSpan,
  PileCenterDiv,
  PileDiv,
  PrintableTableSorter,
  SEDP5000Header,
  SeparatorSpan
} from 'components/StyledComponents'
import { LocalStorageEntry, LocalStorageValue, P5000EditLocalStorageContent } from 'declarations/app.d'
import { Participant, SedContent, SedContentMap, Seds } from 'declarations/buc'
import { SedsPropType } from 'declarations/buc.pt'
import { SedSender } from 'declarations/p5000'
import { State } from 'declarations/reducers'
import Flag, { AllowedLocaleString } from 'flagg-ikoner'
import useValidation from 'hooks/useValidation'
import CountryData from 'land-verktoy'
import _ from 'lodash'
import md5 from 'md5'
import { standardLogger } from 'metrics/loggers'
import moment, { Moment } from 'moment'
import Alertstripe from 'nav-frontend-alertstriper'
import { Checkbox } from 'nav-frontend-skjema'
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
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
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import TableSorter, { Context, Item, RenderEditableOptions, Sort } from 'tabell'
import * as labels from './SEDP5000.labels'

export interface SEDP5000EditRow extends Item {
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

export type SEDP5000EditRows = Array<SEDP5000EditRow>

export interface DatePieces {
  years: number
  months: number
  days: number
}

export interface TableContext extends Context {
  items: SEDP5000EditRows
  seeAsSum: boolean,
  forsikringElklerBosetningsperioder: boolean
}

const mapState = (state: State): any => ({
  sentP5000info: state.buc.sentP5000info,
  sendingP5000info: state.loading.sendingP5000info
})

export interface SEDP5000EditProps {
  caseId: string
  highContrast: boolean
  fromStorage?: LocalStorageValue<P5000EditLocalStorageContent>
  locale: AllowedLocaleString
  p5000Storage: LocalStorageEntry<P5000EditLocalStorageContent>
  setP5000Storage: (it: LocalStorageEntry<P5000EditLocalStorageContent>) => void
  seds: Seds
  sedContentMap: SedContentMap
}

export const ytelsestypeOptions = [
  { label: '[00] Annet', value: '00' },
  { label: '[01] Annen delvis', value: '01' },
  { label: '[10] Alderspensjon', value: '10' },
  { label: '[11] Delvis alderspensjon', value: '11' },
  { label: '[20] Etterlattepensjon', value: '20' },
  { label: '[21] Etterlattepensjon delvis', value: '21' },
  { label: '[30] Uførepensjon', value: '30' },
  { label: '[31] Uførepensjon delvis', value: '31' }
]

const SEDP5000Edit: React.FC<SEDP5000EditProps> = ({
  caseId,
  highContrast,
  fromStorage = undefined,
  locale,
  p5000Storage,
  setP5000Storage,
  seds,
  sedContentMap
}: SEDP5000EditProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { sentP5000info, sendingP5000info }: any = useSelector<State, any>(mapState)
  const componentRef = useRef(null)
  const [_forsikringElklerBosetningsperioder, setForsikringElklerBosetningsperioder] = useState<boolean>(true)
  const [_printDialogOpen, setPrintDialogOpen] = useState<boolean>(false)
  const [_tableSort, setTableSort] = useState<Sort>({ column: '', order: 'none' })
  const [_ytelseOption, _setYtelseOption] = useState<string | undefined>(undefined)
  const [_items, setItems] = useState<SEDP5000EditRows | undefined>(undefined)
  const [_seeAsSum, setSeeAsSum] = useState<boolean>(false)
  const [_validation, resetValidation, performValidation] = useValidation<SEDP5000EditValidationProps>({}, SEDP5000EditValidate)
  const [_onSaving, _setOnSaving] = useState<boolean>(false)
  const [_savedP5000Info, _setSavedP5000Info] = useState<boolean>(false)
  const [_sedSender, _setSedSender] = useState<SedSender | undefined>(undefined)

  const getSedId = useCallback((): string | undefined => {
    return fromStorage?.id || seds[0]?.id || undefined
  }, [fromStorage, seds])

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
        className='sedP5000Edit-type-select'
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
    const startdato: Moment | undefined = moment(validStartDato, 'DD.MM.YYYYY')
    const sluttdato: Moment | undefined = moment(validSluttDato, 'DD.MM.YYYYY')

    // make the diff calculation include the starting day,
    // so the diff between 01.01.YYYY and 02.01.YYYY is 2 days, not 1
    // startdato.add(-1, 'days')

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

  const maybeDoSomePrefill = (startdato: string, sluttdato: string, options: RenderEditableOptions<TableContext>) => {
    const dates: DatePieces | null = calculateDateDiff(startdato, sluttdato)
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
      onBlur={(e: React.ChangeEvent<HTMLInputElement>) => maybeDoSomePrefill(
        options.values.startdato, e.target.value, options
      )}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.setValue({
        sluttdato: e.target.value
      })}
      value={options.value}
    />
  )

  const renderDager = (item: any) => {
    return (
      <Normaltekst>
        {item.dag}
      </Normaltekst>
    )
  }

  const maybeDoSomeMonthAndYearUpdate = (dayString: string, options: RenderEditableOptions<TableContext>) => {
    const day = parseInt(dayString)
    if (options.values.startdato && day > 31) {
      const sluttdato = moment(options.values.startdato, 'DD.MM.YYYY')
      if (sluttdato) {
        sluttdato.add(day, 'days')
        maybeDoSomePrefill(options.values.startdato, sluttdato.format('DD.MM.YYYY'), options)
      }
    }
  }

  const renderDagerEdit = (options: RenderEditableOptions<TableContext>) => {
    return (
      <HighContrastInput
        type='number'
        id='c-tableSorter__edit-dag-input-id'
        className='c-tableSorter__edit-input'
        label=''
        feil={options.feil}
        onBlur={(e: React.ChangeEvent<HTMLInputElement>) => maybeDoSomeMonthAndYearUpdate(
          e.target.value, options
        )}
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

  const setYtelseOption = (o: any) => {
    resetValidation('sedP5000Edit-ytelse-select')
    _setYtelseOption(o?.value ?? '')
  }

  const convertRawP5000toRow = (sedContent: SedContent): SEDP5000EditRows => {
    const res: SEDP5000EditRows = []
    const medlemskap = sedContent?.pensjon?.medlemskap
    medlemskap?.forEach((m: any) => {
      if (!_.isNil(m) && m.type) {
        const item = {
          type: m.type,
          startdato: m.periode?.fom ? moment(m.periode?.fom, 'YYYY-MM-DD').format('DD.MM.YYYY') : '-',
          sluttdato: m.periode?.tom ? moment(m.periode?.tom, 'YYYY-MM-DD').format('DD.MM.YYYY') : '-',
          aar: parseInt(m.sum?.aar) || 0,
          mnd: parseInt(m.sum?.maaneder) || 0,
          dag: parseInt(m.sum?.dager?.nr || 0),
          ytelse: m.relevans || '-',
          ordning: m.ordning || '-',
          beregning: m.beregning || '-'
        } as SEDP5000EditRow
        item.key = 'raw-' + item.type + '-' + item.startdato + '-' + item.sluttdato
        res.push(item)
      }
    })

    return res.sort(
      (a, b) => (parseInt(a.type, 10) - parseInt(b.type, 10))
    )
  }

  const sumItems = (items: SEDP5000EditRows): SEDP5000EditRows => {
    const res: SEDP5000EditRows = []
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

  const renderButtons = (item: any, value: any, { seeAsSum, items }: any): JSX.Element => {
    if (seeAsSum) {
      return <div />
    }
    return (
      <FlexStartDiv>
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
      </FlexStartDiv>
    )
  }

  const handleOverforTilRina = () => {
    _setSavedP5000Info(false)
    const data: SEDP5000EditValidationProps = {
      ytelseOption: _ytelseOption
    }
    const valid: boolean = performValidation(data)
    if (valid) {
      const sedId = getSedId()
      if (sedId) {
        const newSedContent: SedContent = _.cloneDeep(sedContentMap[sedId])
        if (_.isNil(newSedContent.pensjon)) {
          newSedContent.pensjon = {}
        }
        newSedContent.pensjon.medlemskap = _items?.map(item => {
          const medlemskap: any = {}
          medlemskap.relevans = item.ytelse /// ???
          medlemskap.ordning = item.ordning
          medlemskap.land = 'NO'
          medlemskap.sum = {
            kvaltal: null,
            aar: '' + item.aar,
            uker: null,
            dager: {
              nr: '' + item.dag,
              type: '7'
            },
            maaneder: '' + item.mnd
          }
          medlemskap.yrke = null
          medlemskap.gyldigperiode = null
          medlemskap.type = item.type
          medlemskap.beregning = item.beregning
          medlemskap.periode = {
            fom: moment(item.startdato, 'DD.MM.YYYY').format('YYYY-MM-DD'),
            tom: moment(item.sluttdato, 'DD.MM.YYYY').format('YYYY-MM-DD')
          }
          medlemskap.enkeltkrav = {
            krav: _ytelseOption
          }
          return medlemskap
        })
        if (window.confirm(t('buc:form-areYouSureSendToRina'))) {
          dispatch(sendP5000toRina(caseId, getSedId(), newSedContent))
        }
      }
    }
  }

  const addEntryToP5000Storage = (newEntry: LocalStorageValue<P5000EditLocalStorageContent>):
    LocalStorageEntry<P5000EditLocalStorageContent> => {
    const newP5000Storage = _.cloneDeep(p5000Storage)
    if (Object.prototype.hasOwnProperty.call(newP5000Storage, caseId)) {
      let entries: Array<LocalStorageValue<P5000EditLocalStorageContent>> = _.cloneDeep(newP5000Storage[caseId])
      const index: number = _.findIndex(entries, e => e.id === getSedId())
      if (index >= 0) {
        entries[index] = newEntry
      } else {
        entries = entries.concat(newEntry)
      }
      newP5000Storage[caseId] = entries
    } else {
      newP5000Storage[caseId] = [newEntry] as Array<LocalStorageValue<P5000EditLocalStorageContent>>
    }
    return newP5000Storage
  }

  const removeEntryFromP5000Storage = (sedId: string) => {
    const newP5000Storage = _.cloneDeep(p5000Storage)
    if (Object.prototype.hasOwnProperty.call(newP5000Storage, caseId)) {
      const index: number = _.findIndex(newP5000Storage[caseId], e => e.id === sedId)
      if (index >= 0) {
        newP5000Storage[caseId].splice(index, 1)
      }
      if (newP5000Storage[caseId].length === 0) {
        delete newP5000Storage[caseId]
      }
    }
    return newP5000Storage
  }

  const onSave = () => {
    _setOnSaving(true)
    const newEntry = {
      id: getSedId()!,
      date: new Date().toLocaleString(),
      content: {
        items: _items,
        ytelseOption: _ytelseOption
      }
    } as LocalStorageValue<P5000EditLocalStorageContent>
    const newP5000Storage = addEntryToP5000Storage(newEntry)
    setP5000Storage(newP5000Storage)
    _setSavedP5000Info(true)
    _setOnSaving(false)
  }

  const tableSorterKey = md5(
    JSON.stringify(_tableSort) + '-' +
    JSON.stringify((_items ?? '') + '-' +
      (_ytelseOption ?? '')
    ))

  // when I swap from P5000 Seds (and have a different sed ID), need to refresh items / senders
  // only if we are not loading from storage
  useEffect(() => {
    if (fromStorage) {
      console.log('Getting from storage')
      setItems(fromStorage.content.items)
      _setYtelseOption(fromStorage?.content.ytelseOption)
      _setSedSender(getSedSender(fromStorage.id))
    } else {
      const _sedId = getSedId()
      if (_sedId) {
        console.log('Getting from sedContent')
        const newItems: SEDP5000EditRows = convertRawP5000toRow(sedContentMap[_sedId])
        setItems(newItems)
        _setSedSender(getSedSender(_sedId))
      }
    }
  }, [fromStorage, seds, getSedId])

  useEffect(() => {
    if (!_.isNil(sentP5000info) &&
      p5000Storage && p5000Storage[caseId] &&
    _.find(p5000Storage[caseId], c => c.id === getSedId()) !== undefined
    ) {
      const newP5000Storage = removeEntryFromP5000Storage(getSedId()!)
      setP5000Storage(newP5000Storage)
    }
  }, [sentP5000info, caseId, getSedId])

  if (_items === undefined) {
    return <div />
  }

  return (
    <NavHighContrast highContrast={highContrast}>
      <VerticalSeparatorDiv />
      <PileCenterDiv>
        <PileDiv>
          <FlexDiv>
            <UndertekstBold>
              {t('buc:p5000-active-seds')}:
            </UndertekstBold>
            <HorizontalSeparatorDiv />
            <FlexDiv>
              {_sedSender && (
                <>
                  <span>
                    {t('buc:form-dateP5000', { date: _sedSender?.date })}
                  </span>
                  <SeparatorSpan>-</SeparatorSpan>
                  <FlexCenterDiv>
                    <Flag
                      country={_sedSender?.country}
                      label={_sedSender?.countryLabel}
                      size='XS'
                      type='circle'
                    />
                    <HorizontalSeparatorDiv data-size='0.2' />
                    <span>{_sedSender?.countryLabel}</span>
                    <SeparatorSpan>-</SeparatorSpan>
                    <span>{_sedSender?.institution}</span>
                  </FlexCenterDiv>
                </>
              )}
            </FlexDiv>
          </FlexDiv>
          <VerticalSeparatorDiv />
          <SEDP5000Header>
            <FlexCenterDiv>
              <FullWidthDiv>
                <Select
                  key={getSedId() + '-' + _ytelseOption}
                  className='sedP5000Edit-ytelse-select'
                  feil={_validation['sedP5000Edit-ytelse-select']?.feilmelding}
                  highContrast={highContrast}
                  id='sedP5000Edit-ytelse-select'
                  label={t('buc:p5000-4-1-title')}
                  menuPortalTarget={document.body}
                  options={ytelsestypeOptions}
                  onChange={setYtelseOption}
                  selectedValue={_.find(ytelsestypeOptions, y => y.value === _ytelseOption) ?? null}
                  defaultValue={_.find(ytelsestypeOptions, y => y.value === _ytelseOption) ?? null}
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
                <FlexEndDiv>
                  <HighContrastRadio
                    name='42'
                    checked={_forsikringElklerBosetningsperioder === true}
                    label={t('ui:yes')}
                    onClick={() => setForsikringElklerBosetningsperioder(true)}
                  />
                  <HorizontalSeparatorDiv />
                  <HighContrastRadio
                    name='42'
                    checked={_forsikringElklerBosetningsperioder === false}
                    label={t('ui:no')}
                    onClick={() => setForsikringElklerBosetningsperioder(false)}
                  />
                </FlexEndDiv>
              </HighContrastRadioGroup>
              <HorizontalSeparatorDiv />
              <Tooltip placement='top' trigger={['hover']} overlay={<span>{t('help')}</span>}>
                <div style={{ minWidth: '28px' }}>
                  <HelpIcon className='hjelpetekst__ikon' height={28} width={28} />
                </div>
              </Tooltip>
            </FlexCenterDiv>
            <HorizontalSeparatorDiv />
            <PileDiv>
              <Checkbox
                label={t('buc:form-seePeriodsAsSum')}
                checked={_seeAsSum}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSeeAsSum(e.target.checked)}
              />
              <VerticalSeparatorDiv />
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
                  content={() => componentRef.current}
                />
                <HorizontalSeparatorDiv />
                <HighContrastKnapp
                  disabled={sendingP5000info}
                  spinner={sendingP5000info}
                  onClick={handleOverforTilRina}
                >
                  {sendingP5000info ? t('ui:sending') : t('buc:form-send-to-RINA')}
                </HighContrastKnapp>
                <HorizontalSeparatorDiv />
                <HighContrastKnapp
                  onClick={onSave}
                  disabled={_onSaving}
                  spinner={_onSaving}
                >
                  {_onSaving ? t('ui:saving') : t('ui:save')}
                </HighContrastKnapp>
              </FlexStartDiv>
              <VerticalSeparatorDiv />
              <FlexDiv>
                <FullWidthDiv>
                  {sentP5000info === null
                    ? (
                      <Alertstripe type='advarsel'>
                        {t('buc:warning-failedP5000Sending')}
                      </Alertstripe>
                      )
                    : (
                        _savedP5000Info === true
                          ? (
                            <Alertstripe type='suksess'>
                              {t('buc:p5000-saved-svarsed-draft', { caseId: caseId })}
                            </Alertstripe>
                            )
                          : (
                              !_.isNil(sentP5000info)
                                ? (
                                  <Alertstripe type='suksess'>
                                    {t('buc:warning-okP5000Sending')}
                                  </Alertstripe>
                                  )
                                : null
                            )
                      )}
                </FullWidthDiv>
              </FlexDiv>
            </PileDiv>
          </SEDP5000Header>
          <VerticalSeparatorDiv />
          <hr style={{ width: '100%' }} />
          <VerticalSeparatorDiv />
          <TableSorter
            key={tableSorterKey}
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
              standardLogger('buc.edit.tools.P5000.edit.sort', { sort: sort })
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
                  validation: [{
                    pattern: '^.+$',
                    message: t('buc:validation-chooseType')
                  }]
                },
                renderCell: renderType
              },
              {
                id: 'startdato',
                label: t('ui:startDate'),
                type: 'string',
                edit: {
                  render: renderStartDatoEdit,
                  validation: [{
                    pattern: '^(\\d{2}\\.\\d{2}\\.\\d{4}|[0-3][0-9][0-1][0-9]{3})$',
                    message: t('buc:validation-badDate2')
                  }],
                  transform: dateTransform
                }
              },
              {
                id: 'sluttdato',
                label: t('ui:endDate'),
                type: 'string',
                edit: {
                  render: rendersluttDatoEdit,
                  validation: [{
                    pattern: '^(\\d{2}\\.\\d{2}\\.\\d{4}|[0-3][0-9][0-1][0-9]{3})$',
                    message: t('buc:validation-badDate2')
                  }],
                  placeholder: t('buc:placeholder-date2'),
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
                  render: renderDagerEdit,
                  validation: [{
                    pattern: '^\\d+$',
                    message: t('buc:validation-addPositiveNumber')
                  }]
                }
              },
              {
                id: 'mnd',
                label: t('ui:month'),
                type: 'number',
                edit: {
                  defaultValue: 0,
                  validation: [{
                    pattern: '^\\d+$',
                    message: t('buc:validation-addPositiveNumber')
                  }],
                  render: renderManedEdit
                }
              },
              {
                id: 'aar',
                label: t('ui:year'),
                type: 'number',
                edit: {
                  defaultValue: 0,
                  validation: [{
                    pattern: '^\\d+$',
                    message: t('buc:validation-addPositiveNumber')
                  }],
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
                  validation: [{
                    pattern: '^.+$',
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
                type: 'buttons',
                renderCell: renderButtons
              }
            ]}
          />
          <HiddenDiv>
            <div ref={componentRef} id='printJS-form'>
              <PrintableTableSorter
              // important to it re-renders when sorting changes
                key={tableSorterKey}
                className='print-version'
                items={_seeAsSum ? sumItems(_items) : _items}
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
          <VerticalSeparatorDiv data-size='3' />
        </PileDiv>
      </PileCenterDiv>
    </NavHighContrast>
  )
}

SEDP5000Edit.propTypes = {
  highContrast: PT.bool.isRequired,
  seds: SedsPropType.isRequired,
  sedContentMap: PT.any.isRequired
}

export default SEDP5000Edit
