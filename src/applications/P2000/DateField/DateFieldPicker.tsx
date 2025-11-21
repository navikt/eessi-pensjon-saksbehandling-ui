import {DatePicker, useDatepicker} from "@navikt/ds-react";
import React, {useEffect} from "react";
import styles from './DateFieldPicker.module.css'

export interface DateFieldProps {
  id: string
  index: number
  label: string
  description?: string
  hideLabel?: boolean
  error: string | null | undefined
  namespace: string
  onChanged: (v: Date | undefined) => void
  defaultDate: string | undefined | null

}

const DateField: React.FC<DateFieldProps> = ({
  id,
  index,
  label,
  description,
  hideLabel,
  namespace,
  error,
  onChanged,
  defaultDate
}: DateFieldProps): JSX.Element => {

  const { datepickerProps, inputProps, setSelected } = useDatepicker({
    onDateChange: (v) => {v ? onChanged(v) : null },
    defaultSelected: defaultDate ? new Date(defaultDate) : new Date(),
  });

  useEffect(() => {
    defaultDate ? setSelected(new Date(defaultDate)) : setSelected(undefined)
  }, [])

  return (
    <div className={styles.dateFieldPicker}>
      <DatePicker {...datepickerProps}>
        <DatePicker.Input {...inputProps} label={label} description={description} hideLabel={hideLabel} id={namespace + '-' + id} error={error} key={namespace + '-' + id + '-' + index}/>
      </DatePicker>
    </div>
  )
}

export default DateField
