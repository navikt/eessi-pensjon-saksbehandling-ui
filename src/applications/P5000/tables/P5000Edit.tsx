import {
  BodyLong,
  Tag,
  SortState, VStack, Box
} from '@navikt/ds-react'
import {
  informasjonOmBeregning,
  informasjonOmBeregningLabels,
  ordning,
  relevantForYtelse,
  typePeriode
} from 'src/applications/P5000/P5000.labels'
import P5000EditControls from 'src/applications/P5000/tables/P5000EditControls'
import Input from 'src/components/Forms/Input'
import Select from 'src/components/Select/Select'
import { HiddenDiv, HorizontalLineSeparator } from 'src/components/StyledComponents'
import { LocalStorageEntry, Option } from 'src/declarations/app.d'
import { Sed } from 'src/declarations/buc.d'
import { P5000sFromRinaMap } from 'src/declarations/p5000.d'
import { SedPropType } from 'src/declarations/buc.pt'
import {
  P5000ListRow,
  P5000ListRows,
  P5000SED,
  P5000TableContext,
  P5000UpdatePayload
} from 'src/declarations/p5000'
import { State } from 'src/declarations/reducers'
import useValidation from 'src/hooks/useValidation'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Table, { NewRowValues, RenderEditableOptions, RenderOptions, ItemErrors } from '@navikt/tabell'
import dateDiff, { DateDiff } from 'src/utils/dateDiff'
import { convertFromP5000ListRowsIntoP5000SED, convertP5000SEDToP5000ListRows, sortItems } from 'src/applications/P5000/utils/conversion'
import { P5000EditValidate, P5000EditValidationProps } from './validation'
import PopoverCustomized from "src/components/Tooltip/PopoverCustomized";
import dayjs, {Dayjs} from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)

export interface P5000EditSelector {
  sentP5000info: any
}

export interface P5000EditProps {
  caseId: string
  mainSed: Sed
  onBackClick: () => void
  p5000sFromRinaMap: P5000sFromRinaMap
  p5000WorkingCopy: LocalStorageEntry<P5000SED> | undefined
  updateWorkingCopy: (newSed: P5000SED | undefined, sedId: string) => void
}

export const rangesOverlap = (startDateRange1: Dayjs, endDateRange1: Dayjs,
                       startDateRange2: Dayjs, endDateRange2: Dayjs) => {
  return (startDateRange1.isSame(endDateRange2, 'day') || startDateRange1.isBefore(endDateRange2, 'day')) &&
    (endDateRange1.isSame(startDateRange2, 'day') || endDateRange1.isAfter(startDateRange2, 'day'));
}

const mapState = (state: State): any => ({
  sentP5000info: state.p5000.sentP5000info
})

const P5000Edit: React.FC<P5000EditProps> = ({
  caseId,
  p5000sFromRinaMap,
  p5000WorkingCopy,
  mainSed,
  onBackClick,
  updateWorkingCopy
}: P5000EditProps) => {
  const { t } = useTranslation()
  const { sentP5000info }: any = useSelector<State, any>(mapState)
  const componentRef = useRef(null)

  const [_validation, _resetValidation, _performValidation] = useValidation<P5000EditValidationProps>(P5000EditValidate, "", {})
  const [_itemsPerPage, _setItemsPerPage] = useState<number>(30)
  const [_items, sourceStatus] = convertP5000SEDToP5000ListRows({
    seds: [mainSed],
    p5000sFromRinaMap,
    p5000WorkingCopy,
    selectRowsContext: 'forCertainTypesOnly'
  })
  const [renderPrintTable, setRenderPrintTable] = useState<boolean>(false)

  const [_ytelseOption, _setYtelseOption] = useState<string | null>(() => (
    !_.isNil(p5000WorkingCopy)
      ? p5000WorkingCopy?.content?.pensjon?.medlemskapboarbeid?.enkeltkrav?.krav
      : p5000sFromRinaMap?.[mainSed.id]?.pensjon?.medlemskapboarbeid?.enkeltkrav?.krav
  ))
  const [_tableSort, _setTableSort] = useState<SortState>(() => ({ orderBy: '', direction: 'none' }))

  const [_forsikringEllerBosetningsperioder, _setForsikringEllerBosetningsperioder] = useState<string | null | undefined>(() =>
    !_.isNil(p5000WorkingCopy)
      ? p5000WorkingCopy?.content?.pensjon?.medlemskapboarbeid?.gyldigperiode
      : p5000sFromRinaMap[mainSed.id]?.pensjon?.medlemskapboarbeid?.gyldigperiode
  )
  const [typeOptions] = useState<Array<Option>>(() => Object.keys(typePeriode)
    .sort((a: string | number, b: string | number) => (_.isNumber(a) ? a : parseInt(a)) > (_.isNumber(b) ? b : parseInt(b)) ? 1 : -1)
    .map((e: string | number) => ({ label: '[' + e + '] ' + _.get(typePeriode, e), value: '' + e })))

  const [_itemsEditing, _setItemsEditing] = useState<any>({})
  const [_addRowEditing, _setAddRowEditing] = useState<any>(false)


  const beregningOptions: Array<Option> = [
    { label: '000 - ' + informasjonOmBeregningLabels['000'], value: '000' },
    { label: '001 - ' + informasjonOmBeregningLabels['001'], value: '001' },
    { label: '010 - ' + informasjonOmBeregningLabels['010'], value: '010' },
    { label: '011 - ' + informasjonOmBeregningLabels['011'], value: '011' },
    { label: '100 - ' + informasjonOmBeregningLabels['100'], value: '100' },
    { label: '101 - ' + informasjonOmBeregningLabels['101'], value: '101' },
    { label: '110 - ' + informasjonOmBeregningLabels['110'], value: '110' },
    { label: '111 - ' + informasjonOmBeregningLabels['111'], value: '111' }
  ]

  const renderTypeAdd = (options: RenderEditableOptions<P5000ListRow, P5000TableContext, string>) => {
    return (
      <Select
        size='small'
        noMarginTop
        key='c-table--edit-type-select-key-'
        id='c-table--edit-type-select-id'
        className='P5000Edit-type-select input-focus'
        error={options.error}
        options={typeOptions}
        menuPortalTarget={document.body}
        onChange={(e: unknown) => {options.setValues({ type: (e as Option).value }); _setAddRowEditing(true)}}
        defaultValue={_.find(typeOptions, o => o.value === options.value) ?? null}
        value={_.find(typeOptions, o => o.value === options.value) ?? null}
      />
    )
  }
  const renderTypeEdit = (options: RenderEditableOptions<P5000ListRow, P5000TableContext, string>) => {
    return (
      <Select
        size='small'
        noMarginTop
        key='c-table--edit-type-select-key-'
        id='c-table--edit-type-select-id'
        className='P5000Edit-type-select input-focus'
        error={options.error}
        options={typeOptions}
        menuPortalTarget={document.body}
        onChange={(e: unknown) => options.setValues({ type: (e as Option).value })}
        defaultValue={_.find(typeOptions, o => o.value === options.value) ?? null}
        value={_.find(typeOptions, o => o.value === options.value) ?? null}
      />
    )
  }

  const renderType = ({ value }: RenderOptions<P5000ListRow, P5000TableContext, string>) => {
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
      return dayjs(s).format('DD.MM.YYYY')
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
    const startdato: Dayjs | undefined = dayjs(validStartDato, 'DD.MM.YYYY')
    const sluttdato: Dayjs | undefined = dayjs(validSluttDato, 'DD.MM.YYYY')

    if (!startdato.isValid() || !sluttdato.isValid()) {
      return null
    }
    return dateDiff(validStartDato, validSluttDato)
  }

  const maybeDoSomePrefill = (
    startdato: string | undefined,
    sluttdato: string | undefined,
    options: RenderEditableOptions<P5000ListRow, P5000TableContext, any>
  ) => {
    const dates: DateDiff | null = calculateDateDiff(startdato, sluttdato)
    if (dates) {
      if (options.context.forsikringEllerBosetningsperioder === '1') {
        return {
          dag: dates.days,
          aar: dates.years,
          mnd: dates.months
        }
      }
      if (options.context.forsikringEllerBosetningsperioder === '0') {
        return {
          dag: 0,
          aar: 0,
          mnd: 0
        }
      }
    }
    return {}
  }

  const startDatoRef = useRef()
  const sluttDatoRef = useRef()
  const aarRef = useRef()
  const maanedRef = useRef()
  const dagerRef = useRef()

  const renderStartDatoEdit = (options: RenderEditableOptions<P5000ListRow, P5000TableContext, string>) => (
    <Input
      size='small'
      namespace='c-table--edit'
      id='startdato-input-id'
      className='c-table--edit-input'
      label='startdato'
      hideLabel
      error={options.error}
      placeholder={t('buc:placeholder-date2')}
      onChanged={(newStartdato: string) => {
        const otherDate: string | undefined = dateTransform(options.values.sluttdato)
        const extra = maybeDoSomePrefill(newStartdato, otherDate, options)
        options.setValues({ ...extra, startdato: newStartdato })
      }}
      onEnterPress={(e: string) => {
        options.onEnter({ startdato: e })
      }}
      value={dateTransform(options.value) ?? ''}
    />
  )

  const renderStartDatoAdd = (options: RenderEditableOptions<P5000ListRow, P5000TableContext, string>) => (
    <Input
      reference={startDatoRef}
      size='small'
      namespace='c-table--edit'
      id='startdato-input-id'
      className='c-table--edit-input'
      label='startdato'
      hideLabel
      error={options.error}
      placeholder={t('buc:placeholder-date2')}
      onChange={() => _setAddRowEditing(true)}
      onChanged={(newStartdato: string) => {
        const otherDate: string | undefined = dateTransform(options.values.sluttdato)
        const extra = maybeDoSomePrefill(newStartdato, otherDate, options)
        options.setValues({ ...extra, startdato: newStartdato })
      }}
      onEnterPress={(e: string) => {
        options.onEnter({ startdato: e })
      }}
      value={dateTransform(options.value) ?? ''}
    />
  )

  const renderSluttDatoEdit = (options: RenderEditableOptions<P5000ListRow, P5000TableContext, string>) => (
    <Input
      size='small'
      namespace='c-table--edit'
      id='sluttdato-input-id'
      className='c-table--edit-input'
      label='sluttdato'
      hideLabel
      error={options.error}
      placeholder={t('buc:placeholder-date2')}
      onChanged={(newSluttdato: string) => {
        const otherDate: string | undefined = dateTransform(options.values.startdato)
        const extra = maybeDoSomePrefill(otherDate, newSluttdato, options)
        options.setValues({ ...extra, sluttdato: newSluttdato })
      }}
      onEnterPress={(e: string) => {
        options.onEnter({ sluttdato: e })
      }}
      value={dateTransform(options.value) ?? ''}
    />
  )

  const renderSluttDatoAdd = (options: RenderEditableOptions<P5000ListRow, P5000TableContext, string>) => (
    <Input
      reference={sluttDatoRef}
      size='small'
      namespace='c-table--edit'
      id='sluttdato-input-id'
      className='c-table--edit-input'
      label='sluttdato'
      hideLabel
      error={options.error}
      placeholder={t('buc:placeholder-date2')}
      onChange={() => _setAddRowEditing(true)}
      onChanged={(newSluttdato: string) => {
        const otherDate: string | undefined = dateTransform(options.values.startdato)
        const extra = maybeDoSomePrefill(otherDate, newSluttdato, options)
        options.setValues({ ...extra, sluttdato: newSluttdato })
      }}
      onEnterPress={(e: string) => {
        options.onEnter({ sluttdato: e })
      }}
      value={dateTransform(options.value) ?? ''}
    />
  )

  const checkForBosetningsperioder = (options: RenderEditableOptions<P5000ListRow, P5000TableContext, any>, what: string, others: Array<string>) => {
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

  const renderDagerEdit = (options: RenderEditableOptions<P5000ListRow, P5000TableContext, string>) => {
    const value = checkForBosetningsperioder(options, 'dag', ['mnd', 'aar'])
    return (
      <Input
        size='small'
        aria-invalid={!!options.error}
        aria-label='dag'
        data-testid='c-table--edit-dag-input-id'
        error={options.error}
        namespace='c-table--edit'
        id='dag-input-id'
        label='dag'
        hideLabel
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

  const renderDagerAdd = (options: RenderEditableOptions<P5000ListRow, P5000TableContext, string>) => {
    const value = checkForBosetningsperioder(options, 'dag', ['mnd', 'aar'])
    return (
      <Input
        reference={dagerRef}
        size='small'
        aria-invalid={!!options.error}
        aria-label='dag'
        data-testid='c-table--edit-dag-input-id'
        error={options.error}
        namespace='c-table--edit'
        id='dag-input-id'
        label='dag'
        hideLabel
        onChange={() => _setAddRowEditing(true)}
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

  const renderManedEdit = (options: RenderEditableOptions<P5000ListRow, P5000TableContext, string>) => {
    const value = checkForBosetningsperioder(options, 'mnd', ['dag', 'aar'])
    return (
      <Input
        size='small'
        aria-invalid={!!options.error}
        aria-label='mnd'
        namespace='c-table--edit'
        data-testid='mnd-input-id'
        error={options.error}
        id='mnd-input-id'
        label='mnd'
        hideLabel
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

  const renderManedAdd = (options: RenderEditableOptions<P5000ListRow, P5000TableContext, string>) => {
    const value = checkForBosetningsperioder(options, 'mnd', ['dag', 'aar'])
    return (
      <Input
        reference={maanedRef}
        size='small'
        aria-invalid={!!options.error}
        aria-label='mnd'
        namespace='c-table--edit'
        data-testid='mnd-input-id'
        error={options.error}
        id='mnd-input-id'
        label='mnd'
        hideLabel
        onChange={() => _setAddRowEditing(true)}
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

  const renderAarEdit = (options: RenderEditableOptions<P5000ListRow, P5000TableContext, string>) => {
    const value = checkForBosetningsperioder(options, 'aar', ['mnd', 'dag'])
    return (
      <Input
        size='small'
        aria-invalid={!!options.error}
        aria-label='aar'
        data-testid='c-table--edit-aar-input-id'
        error={options.error}
        id='aar-input-id'
        namespace='c-table--edit'
        label='aar'
        hideLabel
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

  const renderAarAdd = (options: RenderEditableOptions<P5000ListRow, P5000TableContext, string>) => {
    const value = checkForBosetningsperioder(options, 'aar', ['mnd', 'dag'])
    return (
      <Input
        reference={aarRef}
        size='small'
        aria-invalid={!!options.error}
        aria-label='aar'
        data-testid='c-table--edit-aar-input-id'
        error={options.error}
        id='aar-input-id'
        namespace='c-table--edit'
        label='aar'
        hideLabel
        onChange={() => _setAddRowEditing(true)}
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

  const renderYtelse = ({ value } : RenderOptions<P5000ListRow, P5000TableContext, string>) => {
    return (
      <PopoverCustomized
        label={(
          <div style={{ maxWidth: '300px' }}>
            {_.get(relevantForYtelse, value)}
          </div>
        )}
      >
        <BodyLong>
          {value}
        </BodyLong>
      </PopoverCustomized>
    )
  }

  const renderYtelseEdit = (options: RenderEditableOptions<P5000ListRow, P5000TableContext, string>) => {
    let valueToShow = options.value
    if (options.values && !_.isNil(options.values.type)) {
      if (options.value !== '') {
        if (options.values.type === '43') {
          options.setValues({
            ytelse: ''
          })
          valueToShow = ''
        }
        if (options.values.type === '45' && options.value !== '100') {
          options.setValues({
            ytelse: '100'
          })
          valueToShow = '100'
        }
        if (!(options.values.type === '43' || options.values.type === '45') && options.value !== '111') {
          options.setValues({
            ytelse: '111'
          })
          valueToShow = '111'
        }
      }
      if (options.value === '' && !(options.values.type === '43')) {
        if (options.values.type === '45') {
          options.setValues({
            ytelse: '100'
          })
          valueToShow = '100'
        }
        else {
          options.setValues({
            ytelse: '111'
          })
          valueToShow = '111'
        }
      }
    }
    return (
      <PopoverCustomized
        label={(
          <div style={{ maxWidth: '300px' }}>
            {_.get(relevantForYtelse, valueToShow!)}
          </div>
        )}
      >
        <BodyLong>
          {valueToShow}
        </BodyLong>
      </PopoverCustomized>
    )
  }

  const onColumnSort = (sort: SortState) => {
    _setTableSort(sort)
  }

  const renderOrdning = ({ value } : RenderOptions<P5000ListRow, P5000TableContext, string>) => {
    return (
      <PopoverCustomized
        label={(
          <div style={{ maxWidth: '300px' }}>
            {_.get(ordning, value)}
          </div>
        )}
      >
        <BodyLong>
          {value}
        </BodyLong>
      </PopoverCustomized>
    )
  }

  const renderOrdningEdit = ({ value }: RenderEditableOptions<P5000ListRow, P5000TableContext, string>) => (
    <PopoverCustomized
      label={(
        <div style={{ maxWidth: '300px' }}>
          {value ? _.get(ordning, value) : ''}
        </div>
      )}
    >
      <BodyLong>
        {value}
      </BodyLong>
    </PopoverCustomized>
  )

  const renderStatus = ({ value }: RenderOptions<P5000ListRow, P5000TableContext, string>) => (
    <div>
      {(value === 'rina') && <Tag size='small' variant='info'>RINA</Tag>}
      {(value === 'new') && <Tag size='small' variant='success'>Ny</Tag>}
      {(value === 'edited') && <Tag size='small' variant='warning'>Endret</Tag>}
    </div>
  )

  const renderBeregning = ({ value } : RenderOptions<P5000ListRow, P5000TableContext, string>) => {
    return (
      <PopoverCustomized
        label={(
          <div style={{ maxWidth: '300px' }}>
            {_.get(informasjonOmBeregning, value)}
          </div>
        )}
      >
        <BodyLong>
          {value}
        </BodyLong>
      </PopoverCustomized>
    )
  }

  const renderBeregningEdit = (options: RenderEditableOptions<P5000ListRow, P5000TableContext, string>) => {
    if (options.values && !_.isNil(options.values.type)) {
      if ((options.values.type === '41' || options.values.type === '50') && options.value !== '000') {
        options.setValues({ beregning: '000' })
      }
    }

    return (
      <Select
        noMarginTop
        size='small'
        key='c-table--edit-beregning-select-key'
        id='c-table--edit-beregning-select-id'
        className='P5000Edit-type-select input-focus'
        error={options.error}
        options={beregningOptions}
        menuPortalTarget={document.body}
        onChange={(e: unknown) => options.setValues({ beregning: (e as Option).value })}
        defaultValue={_.find(beregningOptions, o => o.value === options.value) ?? null}
        value={_.find(beregningOptions, o => o.value === options.value) ?? null}
      />
    )
  }

  const renderBeregningAdd = (options: RenderEditableOptions<P5000ListRow, P5000TableContext, string>) => {
    if (options.values && !_.isNil(options.values.type)) {
      if ((options.values.type === '41' || options.values.type === '50') && options.value !== '000') {
        options.setValues({ beregning: '000' })
      }
    }

    return (
      <Select
        noMarginTop
        size='small'
        key='c-table--edit-beregning-select-key'
        id='c-table--edit-beregning-select-id'
        className='P5000Edit-type-select input-focus'
        error={options.error}
        options={beregningOptions}
        menuPortalTarget={document.body}
        onChange={(e: unknown) => {options.setValues({ beregning: (e as Option).value }); _setAddRowEditing(true)}}
        defaultValue={_.find(beregningOptions, o => o.value === options.value) ?? null}
        value={_.find(beregningOptions, o => o.value === options.value) ?? null}
      />
    )
  }

  const testDate = (value: undefined | null | string | Date): boolean => {
    if (_.isNil(value)) {
      return false
    }
    if (_.isDate(value)) {
      return true
    }
    if (value.match('^(\\d{2}\\.\\d{2}\\.\\d{4})')) {
      return dayjs(value, 'DD.MM.YYYY').isValid()
    }
    if (value.match('^\\d{6}')) {
      return dayjs(dateTransform(value), 'DD.MM.YYYY').isValid()
    }
    return false
  }

  const   testFloat = (value: undefined | null | string): boolean => {
    if(value === "") return true;
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
      items: sortItems(items)
    })
  }

  const renderDateCell = ({ value }: RenderOptions<P5000ListRow, P5000TableContext, string>) => (
    <BodyLong>{_.isDate(value) ? dayjs(value).format('DD.MM.YYYY') : value}</BodyLong>
  )

  const beforeRowEdited = (item: P5000ListRow, context: P5000TableContext | undefined): ItemErrors | undefined => {
    const errors: ItemErrors = {}
    const startdato = dayjs(dateTransform(item.startdato), 'DD.MM.YYYY')
    const sluttdato = dayjs(dateTransform(item.sluttdato), 'DD.MM.YYYY')

    if (startdato.isValid() && sluttdato.isValid()) {
      if (startdato.isAfter(sluttdato)) {
        errors.sluttdato = t('message:validation-endDateBeforeStartDate')
      }

      if (context?.items) {
        for (let i = 0; i < context.items.length; i++) {
          const otherItem: P5000ListRow = context.items[i]
          if (item.key === otherItem.key) {
            continue
          }
          const thisStartdato = dayjs(otherItem.startdato)
          const thisSluttdato = dayjs(otherItem.sluttdato)
          if (item.type === otherItem.type && rangesOverlap(startdato,sluttdato, thisStartdato, thisSluttdato)) {
            errors.startdato = t('message:validation-overlapDate', {
              perioder: dayjs(otherItem.startdato).format('DD.MM.YYYY') + '/' + dayjs(otherItem.sluttdato).format('DD.MM.YYYY')
            })
            break
          }
        }
      }
    }

    if(_.isEmpty(errors)) {
      _setItemsEditing((current: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {[item.key]: removedKey, ...rest} = current
        return rest
      })
    }
    return !_.isEmpty(errors) ? errors : undefined
  }

  const beforeRowAdded = (newRowValues: NewRowValues, context: P5000TableContext): ItemErrors | undefined => {
    const errors: ItemErrors = {}
    const typeValue = newRowValues.type
    const startdatovalue: string | undefined = newRowValues.startdato
    const sluttdatovalue: string | undefined = newRowValues.sluttdato

    const startdato = dayjs(dateTransform(startdatovalue), 'DD.MM.YYYY')
    const sluttdato = dayjs(dateTransform(sluttdatovalue), 'DD.MM.YYYY')

    if (startdato.isValid() && sluttdato.isValid()) {
      if (startdato.isAfter(sluttdato)) {
        errors.sluttdato = t('message:validation-endDateBeforeStartDate')
      }

      for (let i = 0; i < context.items.length; i++) {
        const item: P5000ListRow = context.items[i]

        const thisStartdato = dayjs(item.startdato)
        const thisSluttdato = dayjs(item.sluttdato)

        if (item.type === typeValue && rangesOverlap(startdato, sluttdato, thisStartdato, thisSluttdato)) {
          errors.startdato = t('message:validation-overlapDate', {
            perioder: dayjs(item.startdato).format('DD.MM.YYYY') + '/' + dayjs(item.sluttdato).format('DD.MM.YYYY')
          })
          break
        }
      }
    }

    if(_.isEmpty(errors)) {
      _setAddRowEditing(false)
    }
    return !_.isEmpty(errors) ? errors : undefined
  }

  const onSave = (payload: P5000UpdatePayload) => {
    let templateForP5000: P5000SED | undefined = _.cloneDeep(p5000WorkingCopy?.content)
    if (_.isNil(templateForP5000)) {
      templateForP5000 = _.cloneDeep(p5000sFromRinaMap[mainSed.id])
    }
    if (templateForP5000) {
      const newP5000FromStorage: P5000SED = convertFromP5000ListRowsIntoP5000SED(payload, templateForP5000)
      updateWorkingCopy(newP5000FromStorage, mainSed.id)
    }
  }

  useEffect(() => {
    if (!_.isNil(sentP5000info) && !_.isNil(p5000WorkingCopy)) {
      updateWorkingCopy(undefined, mainSed.id)
    }
  }, [sentP5000info, p5000WorkingCopy])

  if (_items === undefined) {
    return <div />
  }

  const tableId = 'P5000Edit-table'

  return (
    <>
      <VStack
        paddingBlock="0 12"
        align="center"
      >
        <Box
          width="100%"
          paddingBlock="0 4"
        >
          <P5000EditControls
            items={_items}
            caseId={caseId}
            componentRef={componentRef}
            ytelseOption={_ytelseOption}
            setYtelseOption={_setYtelseOption}
            forsikringEllerBosetningsperioder={_forsikringEllerBosetningsperioder}
            setForsikringEllerBosetningsperioder={_setForsikringEllerBosetningsperioder}
            itemsPerPage={_itemsPerPage}
            onBackClick={onBackClick}
            onSave={onSave}
            performValidation={_performValidation}
            p5000WorkingCopy={p5000WorkingCopy}
            p5000sFromRinaMap={p5000sFromRinaMap}
            p5000changed={sourceStatus !== 'rina'}
            resetValidation={_resetValidation}
            setItemsPerPage={_setItemsPerPage}
            setRenderPrintTable={setRenderPrintTable}
            validation={_validation}
            sedId={mainSed.id}
            editingRow={Object.keys(_itemsEditing).length > 0 || _addRowEditing}
          />
          <HorizontalLineSeparator />
        </Box>
        <Table<P5000ListRow, P5000TableContext>
          id={tableId}
          animatable={false}
          items={_items}
          error={_validation['P5000Edit-tabell']?.feilmelding}
          loading={!!sentP5000info}
          labels={{
            selectAllTitle: t('p5000:sum-only-5.1-title'),
            selectAll: t('p5000:sum-only-5.1-description'),
            flagged: t('p5000:uft-flagged')
          }}
          context={{
            items: _items,
            forsikringEllerBosetningsperioder: _forsikringEllerBosetningsperioder
          }}
          editable
          fullWidth
          allowNewRows={_forsikringEllerBosetningsperioder === '1'}
          searchable={false}
          selectable
          showSelectAll={false}
          coloredSelectedRow={false}
          flaggable={_.find(_items, 'flagIkon') !== undefined}
          onRowSelectChange={onRowSelectChange}
          sortable
          onColumnSort={onColumnSort}
          sort={_tableSort}
          onRowsChanged={onRowsChanged}
          beforeRowAdded={beforeRowAdded}
          showResetButtonAddRow={true}
          onResetRowAdd={() => _setAddRowEditing(false)}
          beforeRowEdited={beforeRowEdited}
          onRowEdit={(item) => {
            _setItemsEditing({
              ..._itemsEditing,
              [item.key]: item
            })
          }}
          onResetRowEdit={(key) => {
            _setItemsEditing((current: any) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const {[key]: removedKey, ...rest} = current
              return rest
            })
          }}
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
              render: renderStatus,
              edit: {
                render: () => <div />
              },
              add: {
                defaultValue: 'new',
                render: () => <div />
              }
            },
            {
              id: 'type',
              label: t('p5000:type-43113'),
              type: 'string',
              add: {
                render: renderTypeAdd,
                validation: [{
                  mandatory: (context: P5000TableContext) => (context.forsikringEllerBosetningsperioder !== '0'),
                  test: '^.+$',
                  message: t('message:validation-chooseType')
                }]
              },
              edit: {
                render: renderTypeEdit,
                validation: [{
                  mandatory: (context: P5000TableContext) => (context.forsikringEllerBosetningsperioder !== '0'),
                  test: '^.+$',
                  message: t('message:validation-chooseType')
                }]
              },
              render: renderType
            },
            {
              id: 'startdato',
              label: t('ui:startDate'),
              type: 'date',
              render: renderDateCell,
              add: {
                render: renderStartDatoAdd,
                reference: {startDatoRef},
                validation: [{
                  mandatory: (context: P5000TableContext) => (context.forsikringEllerBosetningsperioder !== '0'),
                  test: testDate,
                  message: t('message:validation-invalidDate')
                }],
                placeholder: t('buc:placeholder-date2'),
                transform: dateTransform
              },
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
              render: renderDateCell,
              add: {
                render: renderSluttDatoAdd,
                reference: {sluttDatoRef},
                validation: [{
                  mandatory: (context: P5000TableContext) => (context.forsikringEllerBosetningsperioder === '1'),
                  test: testDate,
                  message: t('message:validation-invalidDate')
                }],
                placeholder: t('buc:placeholder-date2'),
                transform: dateTransform
              },
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
              align: 'center',
              add: {
                defaultValue: 0,
                validation: [{
                  test: testFloat,
                  message: t('message:validation-addPositiveNumber')
                }],
                render: renderAarAdd,
                reference: {aarRef}
              },
              edit: {
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
              align: 'center',
              add: {
                defaultValue: 0,
                validation: [{
                  test: testFloat,
                  message: t('message:validation-addPositiveNumber')
                }],
                render: renderManedAdd,
                reference: {maanedRef}
              },
              edit: {
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
              align: 'center',
              type: 'string',
              add: {
                defaultValue: 0,
                render: renderDagerAdd,
                reference: {dagerRef},
                validation: [{
                  test: testFloat,
                  message: t('message:validation-addPositiveNumber')
                }]
              },
              edit: {
                render: renderDagerEdit,
                validation: [{
                  test: testFloat,
                  message: t('message:validation-addPositiveNumber')
                }]
              }
            },
            {
              id: 'ytelse',
              label: t('p5000:ytelse'),
              align: 'center',
              render: renderYtelse,
              type: 'string',
              add: {
                defaultValue: '111',
                render: renderYtelseEdit
              },
              edit: {
                render: renderYtelseEdit
              }
            },
            {
              id: 'beregning',
              label: t('ui:calculationInformation'),
              align: 'center',
              render: renderBeregning,
              type: 'string',
              add: {
                defaultValue: '111',
                validation: [{
                  test: '^.+$',
                  message: t('message:validation-addBeregning')
                }],
                render: renderBeregningAdd
              },
              edit: {
                validation: [{
                  mandatory: true,
                  test: '^.+$',
                  message: t('message:validation-addBeregning')
                }],
                render: renderBeregningEdit
              }
            },
            {
              id: 'ordning',
              label: t('ui:scheme'),
              align: 'center',
              render: renderOrdning,
              type: 'string',
              add: {
                defaultValue: '00',
                render: renderOrdningEdit
              },
              edit: {
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
        <Box paddingBlock="4 0">
          {renderPrintTable && (
            <HiddenDiv>
              <div ref={componentRef} id='printJS-form'>
                <Table
                // important to it re-renders when sorting changes
                  className='print-version'
                  fullWidth
                  items={_items}
                  editable={false}
                  animatable={false}
                  searchable={false}
                  selectable={false}
                  sortable
                  sort={_tableSort}
                  itemsPerPage={9999}
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
                    { id: 'type', label: t('p5000:type-43113'), type: 'string', render: renderType },
                    { id: 'startdato', label: t('ui:startDate'), type: 'string', render: renderDateCell },
                    { id: 'sluttdato', label: t('ui:endDate'), type: 'string', render: renderDateCell },
                    { id: 'dag', label: t('ui:day'), type: 'number', align: 'center' },
                    { id: 'mnd', label: t('ui:month'), type: 'number', align: 'center' },
                    { id: 'aar', label: t('ui:year'), type: 'number', align: 'center' },
                    { id: 'ytelse', label: t('p5000:ytelse'), type: 'string', align: 'center' },
                    { id: 'beregning', label: t('ui:calculationInformation'), type: 'string', align: 'center' },
                    { id: 'ordning', label: t('ui:scheme'), type: 'string', align: 'center' }
                  ]}
                />
              </div>
            </HiddenDiv>
          )}
        </Box>
      </VStack>
    </>
  )
}

P5000Edit.propTypes = {
  mainSed: SedPropType.isRequired,
  p5000sFromRinaMap: PT.any.isRequired
}

export default P5000Edit
