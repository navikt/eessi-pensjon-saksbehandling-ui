import React from "react";
import {Checkbox} from "@navikt/ds-react";
import {PSED} from "src/declarations/app";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "src/declarations/types";
import {useDispatch} from "react-redux";
import {P4000} from "src/constants/p8000";
import _ from "lodash";

export interface CheckboxFieldProps {
  label: string
  value: string
  PSED: PSED | null | undefined
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
  namespace: string
  target: string
}

export const CheckBoxField: React.FC<CheckboxFieldProps> = ({
  label, value, target, PSED, updatePSED
}: CheckboxFieldProps): JSX.Element => {
  const dispatch = useDispatch()
  const targetField = _.get(PSED, target)

  const setCheckbox = (field: string, checked: boolean) => {
    dispatch(updatePSED(`${target}.${field}.value`, checked))
  }
  return (
    <Checkbox
      checked={targetField && targetField[value] ? targetField[value].value : false}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckbox(P4000, e.target.checked)}
    >
      {label}
    </Checkbox>
  )
}
