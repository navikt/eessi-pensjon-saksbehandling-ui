import React from "react";
import {Checkbox} from "@navikt/ds-react";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {P8000FieldComponentProps} from "src/applications/P8000/P8000";

export const CheckBoxField: React.FC<P8000FieldComponentProps> = ({
  label, value, target, PSED, updatePSED
}: P8000FieldComponentProps): JSX.Element => {
  const dispatch = useDispatch()
  const targetField = _.get(PSED, target)

  const setCheckbox = (field: string, checked: boolean) => {
    dispatch(updatePSED(`${target}.${field}.value`, checked))
  }
  return (
    <Checkbox
      checked={targetField && targetField[value] ? targetField[value].value : false}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckbox(value, e.target.checked)}
    >
      {label}
    </Checkbox>
  )
}
