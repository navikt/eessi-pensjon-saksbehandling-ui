import React, {useEffect, useState} from 'react'

import { TextField } from '@navikt/ds-react'
import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {useTranslation} from "react-i18next";

dayjs.extend(customParseFormat)

export interface DateFieldProps {
  namespace: string
  error: string | null | undefined
  id: string
  label: string
  description?: string
  uiFormat ?: string
  finalFormat ?: string
  onChanged: (dato: string) => void
  dateValue: string | undefined
  hideLabel?: boolean
  index?: number
}

const parseDate = (date: string | undefined): Dayjs | undefined => {
  if (!date || date === '') return undefined
  let newDate: Dayjs
  if (date.match(/\d{2}[.]\d{2}[.]\d{4}/)) {
    newDate = dayjs(date, 'DD.MM.YYYY')
  } else if (date.match(/\d{2}[.]\d{2}[.]\d{2}/)) {
    newDate = dayjs(date, 'DD.MM.YY')
  } else if (date.match(/\d{4}-\d{2}-\d{2}/)) {
    newDate = dayjs(date, 'YYYY-MM-DD')
  } else if (date.match(/^\d{6}$/)) {
    newDate = dayjs(date, 'DDMMYY')
  } else if (date.match(/^\d{8}$/)) {
    newDate = dayjs(date, 'DDMMYYYY')
  } else {
    return undefined
  }
  return newDate
}

export const isDateValidFormat = (date: string | undefined): boolean => {
  if (!date) return true
  const formats = ["YYYY-MM-DD", "DD.MM.YYYY", "DD.MM.YY", "DDMMYY", "DDMMYYYY"]
  for(const format of formats){
    if(dayjs(date, format, true).isValid()){
      return true
    }
  }
  return false
}

const toDateFormat = (date: string | undefined, format: string): string => {
  const newDate = parseDate(date?.trim())
  if (!newDate) { return '' }
  return newDate.isValid() ? newDate!.format(format) : ''
}

const DateField = ({
  namespace,
  error,
  id,
  label,
  description,
  onChanged,
  dateValue,
  uiFormat = 'DD.MM.YYYY',
  finalFormat = 'YYYY-MM-DD',
  hideLabel = false,
  index = 0
}: DateFieldProps) => {
  const { t } = useTranslation()
  const [_dato, _setDato] = useState<string>(() => isDateValidFormat(dateValue) ? toDateFormat(dateValue, uiFormat!) : dateValue ? dateValue : '')
  const [_error, _setError] = useState<string | undefined>(() => undefined)
  const [_blurred, _setBlurred] = useState<boolean>(() => false)


  useEffect(() => {
    if(isDateValidFormat(dateValue)){
      _setError(undefined)
      _setDato(toDateFormat(dateValue, uiFormat!))
    } else {
      _setError(t('validation:invalidDateFormat'))
      dateValue ? _setDato(dateValue) : ''
    }
  }, [dateValue, _blurred])

  const onDateBlur = () => {
    if(isDateValidFormat(_dato)){
      _setError(undefined)
      const date = toDateFormat(_dato, finalFormat!)
      onChanged(date)
    } else {
      _setError(t('validation:invalidDateFormat'))
      onChanged(_dato)
    }
    _setBlurred(!_blurred)
  }

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    _setDato(e.target.value)
  }

  return (
    <TextField
      aria-invalid={!!error}
      data-testid={namespace + ''}
      id={namespace + '-' + id}
      key={namespace + '-' + id + '-' + index}
      error={error || _error}
      label={(label ?? t('ui:date'))}
      description={description}
      placeholder={t('ui:placeholder-date-default')}
      onBlur={onDateBlur}
      onChange={onDateChange}
      value={_dato}
      hideLabel={hideLabel}
    />
  )
}

export default DateField
