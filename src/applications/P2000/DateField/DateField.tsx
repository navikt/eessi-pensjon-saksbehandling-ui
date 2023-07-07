import {useDatepicker} from "@navikt/ds-react/esm/date/hooks/useDatepicker";
import React, {useEffect} from "react";
import {UNSAFE_DatePicker as DatePicker} from "@navikt/ds-react/esm/date";

export interface DateFieldProps {
  id: string
  index: number
  label: string
  error: string | null | undefined
  namespace: string
  onChanged: (v: Date | undefined) => void
  defaultDate: string | undefined | null

}

const DateField: React.FC<DateFieldProps> = ({
  id,
  index,
  label,
  namespace,
  error,
  onChanged,
  defaultDate
}: DateFieldProps): JSX.Element => {

  const { datepickerProps, inputProps, setSelected } = useDatepicker({
    onDateChange: (v) => {onChanged(v)},
    defaultSelected: defaultDate ? new Date(defaultDate) : new Date()
  });

  useEffect(() => {
    defaultDate ? setSelected(new Date(defaultDate)) : setSelected(new Date())
  }, [])

  return (
    <DatePicker {...datepickerProps}>
      <DatePicker.Input {...inputProps} label={label} id={namespace + '-' + id} error={error} key={namespace + '-' + id + '-' + index}/>
    </DatePicker>
  )
}

export default DateField
