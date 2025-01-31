import React from "react";
import {Checkbox} from "@navikt/ds-react";

export interface CheckboxFieldProps {
  label: string
  value: string
}

export const CheckBoxField: React.FC<CheckboxFieldProps> = ({
  label, value
}: CheckboxFieldProps): JSX.Element => {
  return (
    <Checkbox value={value}>{label}</Checkbox>
  )
}
