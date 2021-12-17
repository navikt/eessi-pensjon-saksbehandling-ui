import {
  Alert,
  BodyLong,
  Button,
  HelpText,
  Link,
  Loader,
  Radio,
  RadioGroup,
  Select as NavSelect,
  Tag
} from '@navikt/ds-react'
import { resetSentP5000info, sendP5000toRina } from 'actions/p5000'
import {
  informasjonOmBeregning,
  ordning,
  relevantForYtelse,
  typePeriode,
  ytelseType
} from 'applications/P5000/P5000.labels'
import Input from 'components/Forms/Input'
import Modal from 'components/Modal/Modal'
import Select from 'components/Select/Select'
import { OneLineSpan } from 'components/StyledComponents'
import { LocalStorageValue, Option } from 'declarations/app.d'
import { P5000FromRinaMap, Seds } from 'declarations/buc'
import { SedsPropType } from 'declarations/buc.pt'
import { P5000ListRow, P5000ListRows, P5000SED, P5000TableContext, P5000UpdatePayload } from 'declarations/p5000'
import { State } from 'declarations/reducers'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import * as Moment from 'moment'
import { extendMoment } from 'moment-range'
import {
  AlignEndRow,
  Column,
  FlexCenterDiv,
  FlexCenterSpacedDiv,
  FlexEndDiv,
  FullWidthDiv,
  HiddenDiv,
  HorizontalSeparatorDiv,
  PileCenterDiv,
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
import dateDiff, { DateDiff } from 'utils/dateDiff'
import { convertFromP5000ListRowsIntoP5000SED, convertP5000SEDToP5000ListRows } from './conversion'
import P5000HelpModal from './P5000HelpModal'
import { P5000EditValidate, P5000EditValidationProps } from './validation'

const moment = extendMoment(Moment)

const Radio42 = styled(Radio)`
  margin-bottom: 0.3rem !important;
  margin-top: 0.3rem;
`
export const AlertstripeDiv = styled.div`
  margin: 0.5rem;
  min-width: 50%;
`

const mapState = (state: State): any => ({
  sentP5000info: state.p5000.sentP5000info,
  sendingP5000info: state.loading.sendingP5000info
})

export interface P5000EditProps {
  caseId: string
  seds: Seds
  onBackClick: () => void
  p5000FromRinaMap: P5000FromRinaMap
  p5000FromStorage: LocalStorageValue<P5000SED> | undefined
  saveP5000ToStorage: ((newSed: P5000SED | undefined, sedId: string, sort?: Sort) => void) | undefined
  removeP5000FromStorage: ((sedId: string) => void) | undefined
}

const P5000Edit: React.FC<P5000EditProps> = ({
  caseId,
  p5000FromRinaMap,
  p5000FromStorage,
  seds, // always array with 1 element
  onBackClick,
  removeP5000FromStorage,
  saveP5000ToStorage
}: P5000EditProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { sentP5000info, sendingP5000info }: any = useSelector<State, any>(mapState)
  const componentRef = useRef(null)

  const [_items, sourceStatus] = convertP5000SEDToP5000ListRows(seds, 'edit', p5000FromRinaMap, p5000FromStorage, false)
  const [_itemsPerPage, _setItemsPerPage] = useState<number>(30)
  const [_printDialogOpen, _setPrintDialogOpen] = useState<boolean>(false)
  const [renderPrintTable, _setRenderPrintTable] = useState<boolean>(false)
  const [_showHelpModal, _setShowHelpModal] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useValidation<P5000EditValidationProps>({}, P5000EditValidate)
  const [_ytelseOption, _setYtelseOption] = useState<string | undefined>(() =>
    !_.isNil(p5000FromStorage)
      ? p5000FromStorage?.content?.pensjon?.medlemskapboarbeid?.enkeltkrav?.krav
      : p5000FromRinaMap[seds[0].id]?.pensjon?.medlemskapboarbeid?.enkeltkrav?.krav
  )
  const [_showModal, _setShowModal] = useState<boolean>(false)
  const [_tableSort, _setTableSort] = useState<Sort>(() => (!_.isNil(p5000FromStorage) && _.isEmpty(p5000FromStorage?.sort) ? p5000FromStorage?.sort! : { column: '', order: 'none' }))
  const [_forsikringEllerBosetningsperioder, _setForsikringEllerBosetningsperioder] = useState<string | undefined>(
    !_.isNil(p5000FromStorage)
      ? p5000FromStorage?.content?.pensjon?.medlemskapboarbeid?.gyldigperiode
      : p5000FromRinaMap[seds[0].id]?.pensjon?.medlemskapboarbeid?.gyldigperiode
  )
  const [typeOptions] = useState<Array<Option>>(() => Object.keys(typePeriode)
    .sort((a: string | number, b: string | number) => (_.isNumber(a) ? a : parseInt(a)) > (_.isNumber(b) ? b : parseInt(b)) ? 1 : -1)
    .map((e: string | number) => ({ label: '[' + e + '] ' + _.get(typePeriode, e), value: '' + e })))

  const [ytelseOptions] = useState<Array<Option>>(() => Object.keys(ytelseType)
    .sort((a: string | number, b: string | number) => (_.isNumber(a) ? a : parseInt(a)) > (_.isNumber(b) ? b : parseInt(b)) ? 1 : -1)
    .map((e: string | number) => ({ label: '[' + e + '] ' + _.get(ytelseType, e), value: '' + e })))

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

  const onSaveSort = (sort: Sort) => {
    saveP5000ToStorage!(undefined, seds[0].id, sort)
  }

  const onSave = (payload: P5000UpdatePayload) => {
    let templateForP5000: P5000SED | undefined = _.cloneDeep(p5000FromStorage?.content)
    if (_.isNil(templateForP5000)) {
      templateForP5000 = _.cloneDeep(p5000FromRinaMap[seds[0].id])
    }
    if (templateForP5000) {
      const newP5000FromStorage: P5000SED = convertFromP5000ListRowsIntoP5000SED(payload, seds[0].id, templateForP5000)
      saveP5000ToStorage!(newP5000FromStorage, seds[0].id, _tableSort)
    }
  }

  const renderTypeEdit = (options: RenderEditableOptions) => {
    return (
      <Select
        size='small'
        key='c-table__edit-type-select-key-'
        id='c-table__edit-type-select-id'
        className='P5000Edit-type-select input-focus'
        error={options.error}
        options={typeOptions}
        menuPortalTarget={document.body}
        onChange={(e: unknown) => options.setValues({ type: (e as Option).value })}
        defaultValue={_.find(typeOptions, o => o.value === options.value)}
        value={_.find(typeOptions, o => o.value === options.value)}
      />
    )
  }

  const renderType = (item: any, value: any) => {
    return (
      <BodyLong>
        {_.find(typeOptions, t => t.value === value)?.label || t('buc:status-unknown')}
      </BodyLong>
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

  const calculateDateDiff = (rawStartDato: string | undefined, rawSluttDato: string | undefined): DateDiff | null => {
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
    return dateDiff(validStartDato, validSluttDato)
  }

  const maybeDoSomePrefill = (startdato: string | undefined, sluttdato: string | undefined, options: RenderEditableOptions<P5000TableContext>) => {
    const dates: DateDiff | null = calculateDateDiff(startdato, sluttdato)
    if (dates) {
      if (options.context.forsikringEllerBosetningsperioder === '1') {
        options.setValues({
          dag: dates.days,
          aar: dates.years,
          mnd: dates.months
        })
      }
      if (options.context.forsikringEllerBosetningsperioder === '0') {
        options.setValues({
          dag: 0,
          aar: 0,
          mnd: 0
        })
      }
    }
  }

  const renderStartDatoEdit = (options: RenderEditableOptions<P5000TableContext>) => (
    <div style={{ marginTop: '0.5rem' }}>
      <Input
        size='small'
        namespace='c-table__edit'
        id='startdato-input-id'
        className='c-table__edit-input'
        label='startdato'
        hideLabel
        error={options.error}
        placeholder={t('buc:placeholder-date2')}
        onChanged={(e: string) => {
          options.setValues({ startdato: e })
          const otherDate: string | undefined = dateTransform(options.values.sluttdato)
          maybeDoSomePrefill(e, otherDate, options)
        }}
        onEnterPress={(e: string) => {
          options.onEnter({ startdato: e })
        }}
        value={dateTransform(options.value) ?? ''}
      />
    </div>
  )

  const renderSluttDatoEdit = (options: RenderEditableOptions<P5000TableContext>) => (
    <div style={{ marginTop: '0.5rem' }}>
      <Input
        size='small'
        namespace='c-table__edit'
        id='sluttdato-input-id'
        className='c-table__edit-input'
        label='sluttdato'
        hideLabel
        error={options.error}
        placeholder={t('buc:placeholder-date2')}
        onChanged={(e: string) => {
          options.setValues({ sluttdato: e })
          const otherDate: string | undefined = dateTransform(options.values.startdato)
          maybeDoSomePrefill(otherDate, e, options)
        }}
        onEnterPress={(e: string) => {
          options.onEnter({ sluttdato: e })
        }}
        value={dateTransform(options.value) ?? ''}
      />
    </div>
  )

  const renderDager = (item: any) => {
    return (
      <BodyLong>
        {item.dag}
      </BodyLong>
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
        options.setValues({
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
      options.setValues({
        [what]: _value
      })
    }
    return _value
  }

  const renderDagerEdit = (options: RenderEditableOptions<P5000TableContext>) => {
    const value = checkForBosetningsperioder(options, 'dag', ['mnd', 'aar'])
    return (
      <Input
        size='small'
        aria-invalid={!!options.error}
        aria-label='dag'
        data-test-id='c-table__edit-dag-input-id'
        error={options.error}
        namespace='c-table__edit'
        id='dag-input-id'
        label=''
        onChanged={(e: string) => {
          options.setValues({
            dag: isNaN(parseFloat(e)) ? 0 : parseFloat(e)
          })
        }}
        onEnterPress={(e: string) => {
          options.onEnter({ dag: isNaN(parseFloat(e)) ? 0 : parseFloat(e) })
        }}
        placeholder=''
        value={'' + value}
      />
    )
  }

  const renderManedEdit = (options: RenderEditableOptions<P5000TableContext>) => {
    const value = checkForBosetningsperioder(options, 'mnd', ['dag', 'aar'])
    return (
      <Input
        size='small'
        aria-invalid={!!options.error}
        aria-label='mnd'
        namespace='c-table__edit'
        data-test-id='mnd-input-id'
        error={options.error}
        id='mnd-input-id'
        label=''
        onChanged={(e: string) => {
          options.setValues({
            mnd: isNaN(parseFloat(e)) ? 0 : parseFloat(e)
          })
        }}
        onEnterPress={(e: string) => {
          options.onEnter({ mnd: isNaN(parseFloat(e)) ? 0 : parseFloat(e) })
        }}
        placeholder=''
        value={'' + value}
      />
    )
  }

  const renderAarEdit = (options: RenderEditableOptions<P5000TableContext>) => {
    const value = checkForBosetningsperioder(options, 'aar', ['mnd', 'dag'])
    return (
      <Input
        size='small'
        aria-invalid={!!options.error}
        aria-label='aar'
        data-test-id='c-table__edit-aar-input-id'
        error={options.error}
        id='aar-input-id'
        namespace='c-table__edit'
        label=''
        onChanged={(e: string) => {
          options.setValues({
            aar: isNaN(parseFloat(e)) ? 0 : parseFloat(e)
          })
        }}
        onEnterPress={(e: string) => {
          options.onEnter({ aar: isNaN(parseFloat(e)) ? 0 : parseFloat(e) })
        }}
        placeholder=''
        value={'' + value}
      />
    )
  }

  const renderYtelse = (item: any, value: any) => {
    return (
      <div style={{ marginTop: '0.5rem' }}>
        <Tooltip
          overlay={(
            <div style={{ maxWidth: '300px' }}>
              {_.get(relevantForYtelse, value.startsWith('0') ? value : parseInt(value))}
            </div>
          )}
          placement='top'
          trigger={['hover']}
        >
          <BodyLong>
            {value}
          </BodyLong>
        </Tooltip>
      </div>
    )
  }

  const renderYtelseEdit = (options: RenderEditableOptions) => {
    let valueToShow = options.value
    if (options.values && !_.isNil(options.values.type)) {
      if ((options.values.type === '43' || options.values.type === '45') && options.value !== '') {
        options.setValues({
          ytelse: ''
        })
        valueToShow = ''
      }
      if (!(options.values.type === '43' || options.values.type === '45') && options.value === '') {
        options.setValues({
          ytelse: '111'
        })
        valueToShow = '111'
      }
    }
    return (
      <div style={{ marginTop: '0.5rem' }}>
        <Tooltip
          overlay={(
            <div style={{ maxWidth: '300px' }}>
              {_.get(relevantForYtelse, valueToShow.startsWith('0') ? valueToShow : parseInt(valueToShow))}
            </div>
          )}
          placement='top'
          trigger={['hover']}
        >
          <BodyLong>
            {valueToShow}
          </BodyLong>
        </Tooltip>
      </div>
    )
  }

  const onColumnSort = (sort: Sort) => {
    standardLogger('buc.edit.tools.P5000.edit.sort', { sort: sort })
    _setTableSort(sort)
    onSaveSort(sort)
  }

  const renderOrdning = (item: any, value: any) => {
    return (
      <div style={{ marginTop: '0.5rem' }}>
        <Tooltip
          overlay={(
            <div style={{ maxWidth: '300px' }}>
              {_.get(ordning, value.startsWith('0') ? value : parseInt(value))}
            </div>
          )}
          placement='top'
          trigger={['hover']}
        >
          <BodyLong>
            {value}
          </BodyLong>
        </Tooltip>
      </div>
    )
  }

  const renderOrdningEdit = (options: RenderEditableOptions) => (
    <div style={{ marginTop: '0.5rem' }}>
      <Tooltip
        overlay={(
          <div style={{ maxWidth: '300px' }}>
            {_.get(ordning, options.value.startsWith('0') ? options.value : parseInt(options.value))}
          </div>
        )}
        placement='top'
        trigger={['hover']}
      >
        <BodyLong>
          {options.value}
        </BodyLong>
      </Tooltip>
    </div>
  )

  const renderStatus = (item: any, value: any) => {
    if (value === 'rina') {
      return <Tag size='small' variant='info'>RINA</Tag>
    }
    if (value === 'new') {
      return <Tag size='small' variant='success'>Ny</Tag>
    }
    if (value === 'edited') {
      return <Tag size='small' variant='warning'>Endret</Tag>
    }
    return <div />
  }

  const renderBeregning = (item: any, value: any) => {
    return (
      <div style={{ marginTop: '0.5rem' }}>
        <Tooltip
          overlay={(
            <div style={{ maxWidth: '300px' }}>
              {_.get(informasjonOmBeregning, value.startsWith('0') ? value : parseInt(value))}
            </div>
          )}
          placement='top'
          trigger={['hover']}
        >
          <BodyLong>
            {value}
          </BodyLong>
        </Tooltip>
      </div>
    )
  }

  const renderBeregningEdit = (options: RenderEditableOptions) => {
    return (
      <Input
        size='small'
        namespace='c-table__edit'
        id='beregning-input-id'
        className='c-table__edit-input'
        label=''
        error={options.error}
        onChanged={(e: string) => options.setValues({ beregning: e })}
        onEnterPress={(e: string) => { options.onEnter({ beregning: e }) }}
        value={options.value}
      />
    )
  }

  const setYtelseOption = (o: unknown) => {
    _resetValidation('P5000Edit-ytelse-select')
    _setYtelseOption((o as Option)?.value)
    onSave({
      ytelseOption: (o as Option)?.value
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
    _resetValidation('P5000Edit-tabell')
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
    <BodyLong>{_.isDate(value) ? moment(value).format('DD.MM.YYYY') : value}</BodyLong>
  )

  const resetP5000 = () => {
    dispatch(resetSentP5000info())
  }

  const beforeRowEdited = (item: P5000ListRow, context: P5000TableContext) => {
    const startdato = moment(dateTransform(item.startdato), 'DD.MM.YYYY')
    const sluttdato = moment(dateTransform(item.sluttdato), 'DD.MM.YYYY')

    if (startdato.isValid() && sluttdato.isValid()) {
      if (startdato.isAfter(sluttdato)) {
        if (!item.error) {
          item.error = {}
        }
        item.error = {
          ...item.error,
          startdato: t('message:validation-endDateBeforeStartDate')
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
          item.error = {
            ...item.error,
            startdato: t('message:validation-overlapDate', {
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
        columns[sluttdatoindex].error = t('message:validation-endDateBeforeStartDate')
        return false
      }
      const range = moment.range(startdato, sluttdato)
      let overlapError: boolean = false

      for (let i = 0; i < context.items.length; i++) {
        const item: P5000ListRow = context.items[i]
        const thisRange = moment.range(moment(item.startdato), moment(item.sluttdato))
        if (item.type === typeValue && range.overlaps(thisRange)) {
          columns[startdatoindex].error = t('message:validation-overlapDate', {
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
    if (!_.isUndefined(sentP5000info) && !_showModal) {
      _setShowModal(true)
    }
  }, [sentP5000info, _showModal])

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

  const modalClose = () => {
    _setShowModal(false)
    // modal leaves this class on body, stops scrolling. Hack to resume scrolling
    document.getElementById('root')?.classList.remove('ReactModal__Body--open')
  }

  const canSend = !!_ytelseOption

  return (
    <>
      <Modal
        open={_showModal}
        appElementId='p5000Edit'
        onModalClose={modalClose}
        modal={{
          closeButton: false,
          modalContent: (
            <div>
              {_.isNull(sentP5000info) && (
                <PileCenterDiv>
                  <AlertstripeDiv>
                    <Alert variant='warning'>
                      {t('message:warning-failedP5000Sending')}
                    </Alert>
                  </AlertstripeDiv>
                  <VerticalSeparatorDiv />
                  <FlexCenterSpacedDiv>
                    <div />
                    <Button
                      variant='primary'
                      onClick={() => {
                        resetP5000()
                        modalClose()
                      }}
                    >OK
                    </Button>
                    <div />
                  </FlexCenterSpacedDiv>
                </PileCenterDiv>
              )}
              {!_.isNil(sentP5000info) && (
                <PileCenterDiv>
                  <Alert variant='info'>
                    {t('message:warning-okP5000Sending', { caseId: caseId })}
                  </Alert>
                  <VerticalSeparatorDiv />
                  <FlexCenterSpacedDiv>
                    <div />
                    <Button
                      variant='primary'
                      onClick={() => {
                        resetP5000()
                        modalClose()
                        setTimeout(onBackClick, 200)
                      }}
                    >OK
                    </Button>
                    <div />
                  </FlexCenterSpacedDiv>
                </PileCenterDiv>
              )}

            </div>
          )
        }}
      />
      <P5000HelpModal
        open={_showHelpModal}
        onClose={() => _setShowHelpModal(false)}
      />
      <PileCenterDiv className='foo'>
        <AlignEndRow style={{ width: '100%' }}>
          <Column>
            <FullWidthDiv>
              <Select
                key={'ytelse' + _ytelseOption}
                className='P5000Edit-ytelse-select'
                error={_validation['P5000Edit-ytelse-select']?.feilmelding}
                id='P5000Edit-ytelse-select'
                label={t('buc:p5000-4-1-title')}
                menuPortalTarget={document.body}
                options={ytelseOptions}
                onChange={setYtelseOption}
                defaultValue={_.find(ytelseOptions, y => y.value === _ytelseOption) ?? null}
                value={_.find(ytelseOptions, y => y.value === _ytelseOption) ?? null}
              />
            </FullWidthDiv>
          </Column>
          <Column>
            <FlexCenterDiv>
              <RadioGroup
                value={_forsikringEllerBosetningsperioder}
                error={_validation['P5000Edit-forsikringEllerBosetningsperioder']?.feilmelding}
                id='P5000Edit-forsikringEllerBosetningsperioder'
                onChange={setForsikringEllerBosetningsperioder}
                legend={(
                  <FlexCenterDiv>
                    <OneLineSpan>
                      {t('buc:p5000-4-2-title')}
                    </OneLineSpan>
                    <HorizontalSeparatorDiv />
                    <HelpText>
                      <div style={{ maxWidth: '600px' }}>
                        <BodyLong>{t('message:help-p5000-1')}</BodyLong>
                        <BodyLong>{t('message:help-p5000-2')}</BodyLong>
                      </div>
                    </HelpText>
                  </FlexCenterDiv>
              )}
              >
                <FlexEndDiv>
                  <Radio42 value='1'>
                    {t('ui:yes')}
                  </Radio42>
                  <HorizontalSeparatorDiv />
                  <Radio42
                    style={{ marginBottom: '0.3rem', marginTop: '0.3rem' }}
                    value='0'
                  >
                    {t('ui:no')}
                  </Radio42>
                </FlexEndDiv>
              </RadioGroup>
            </FlexCenterDiv>
          </Column>
          <HorizontalSeparatorDiv />
          <Column>
            <FlexEndDiv>
              <NavSelect
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
              </NavSelect>
              <HorizontalSeparatorDiv />
              <Button
                variant='primary'
                disabled={sendingP5000info || !canSend}
                onClick={handleOverforTilRina}
              >
                {sendingP5000info && <Loader />}
                {sendingP5000info ? t('ui:sending') : t('buc:form-send-to-RINA')}
              </Button>
              <HorizontalSeparatorDiv />
              <ReactToPrint
                documentTitle='P5000Sum'
                onAfterPrint={afterPrintOut}
                onBeforePrint={beforePrintOut}
                onBeforeGetContent={prepareContent}
                trigger={() => (
                  <Button
                    variant='secondary'
                    disabled={_printDialogOpen}
                  >
                    {_printDialogOpen && <Loader />}
                    {t('ui:print')}
                  </Button>
                )}
                content={() => componentRef.current}
              />
            </FlexEndDiv>
          </Column>
        </AlignEndRow>
        <VerticalSeparatorDiv />
        <AlignEndRow style={{ width: '100%' }}>
          <Column />
          <Column>
            {sourceStatus !== 'rina' && (
              <div style={{ whiteSpace: 'nowrap' }}>
                <span>
                  {t('buc:p5000-saved-working-copy')}
                </span>
                <HorizontalSeparatorDiv size='0.5' />
                <Link style={{ display: 'inline-block' }} href='#' onClick={() => _setShowHelpModal(true)}>
                  {t('ui:hva-betyr-det')}
                </Link>
              </div>
            )}
          </Column>
        </AlignEndRow>
        <VerticalSeparatorDiv />
        <AlignEndRow style={{ width: '100%' }}>
          <Column>
            <Alert variant='warning'>
              <FlexCenterDiv>
                {t('message:warning-P5000Edit-instructions-li1')}
                <HorizontalSeparatorDiv size='0.5' />
                <HelpText>
                  <div style={{ maxWidth: '600px' }}>
                    <BodyLong>{t('message:warning-P5000Edit-instructions-li1-help')}</BodyLong>
                  </div>
                </HelpText>
              </FlexCenterDiv>
            </Alert>
          </Column>
          <Column />
        </AlignEndRow>
        <VerticalSeparatorDiv />
        <hr style={{ width: '100%' }} />
        <VerticalSeparatorDiv />
        <Table<P5000ListRow, P5000TableContext>
          key={'P5000Edit-table-' + _itemsPerPage + '-sort-' + JSON.stringify(_tableSort) + '-storage-' + !_.isEmpty(p5000FromStorage)}
          animatable={false}
          items={_items}
          error={_validation['P5000Edit-tabell']?.feilmelding}
          loading={!!sentP5000info}
          context={{
            items: _items,
            forsikringEllerBosetningsperioder: _forsikringEllerBosetningsperioder
          }}
          editable
          allowNewRows={_forsikringEllerBosetningsperioder === '1'}
          searchable={false}
          selectable
          showSelectAll={false}
          coloredSelectedRow={false}
          onRowSelectChange={onRowSelectChange}
          sortable
          onColumnSort={onColumnSort}
          sort={_tableSort}
          onRowsChanged={onRowsChanged}
          beforeRowAdded={beforeRowAdded}
          beforeRowEdited={beforeRowEdited}
          itemsPerPage={_itemsPerPage}
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
                  message: t('message:validation-chooseType')
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
                  message: t('message:validation-invalidDate')
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
                  message: t('message:validation-invalidDate')
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
                  message: t('message:validation-addPositiveNumber')
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
                  message: t('message:validation-addPositiveNumber')
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
                  message: t('message:validation-addPositiveNumber')
                }]
              }
            },
            {
              id: 'ytelse',
              label: t('buc:p5000-ytelse'),
              renderCell: renderYtelse,
              type: 'string',
              edit: {
                defaultValue: '111',
                render: renderYtelseEdit
              }
            },
            {
              id: 'beregning',
              label: t('ui:calculationInformation'),
              renderCell: renderBeregning,
              type: 'string',
              edit: {
                defaultValue: '111',
                validation: [{
                  test: '^.+$',
                  message: t('message:validation-addBeregning')
                }],
                render: renderBeregningEdit
              }
            },
            {
              id: 'ordning',
              label: t('ui:scheme'),
              renderCell: renderOrdning,
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
