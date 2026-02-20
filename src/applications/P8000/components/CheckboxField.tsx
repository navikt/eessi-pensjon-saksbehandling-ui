import React, {JSX} from "react";
import {Checkbox} from "@navikt/ds-react";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {getVariantObject, P8000FieldComponentProps} from "src/applications/P8000/P8000";
import {resetValidation} from "src/actions/validation";
import {umamiCheckBoxLogger} from "src/metrics/umami";

export const CheckBoxField: React.FC<P8000FieldComponentProps> = ({
  label, value, target, PSED, updatePSED, namespace, variantType
}: P8000FieldComponentProps): JSX.Element => {
  const dispatch = useDispatch()
  const targetField = _.get(PSED, target!)

  const setCheckbox = (field: string, checked: boolean) => {
    dispatch(updatePSED(`${target}.${field}.value`, checked))
    if (!checked) {
      dispatch(resetValidation(namespace + '-' + field))
      dispatch(updatePSED(`${target}.${field}`, undefined))
    }
  }

  return (
    <Checkbox
      checked={targetField && targetField[value] ? targetField[value].value : false}
      value={value}
      onChange={
        (e: React.ChangeEvent<HTMLInputElement>) => {
          setCheckbox(value, e.target.checked)
          umamiCheckBoxLogger({
            tekst: label,
            checked: e.target.checked,
            sedType: PSED?.originalSed?.type,
            ...getVariantObject(variantType)
          })
        }
      }
    >
      {label}
    </Checkbox>
  )
}
