import React from "react";
import {Checkbox} from "@navikt/ds-react";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {P8000FieldComponentProps} from "src/applications/P8000/P8000";

export const SendFolgendeSEDer: React.FC<P8000FieldComponentProps> = ({
  label, value, PSED, updatePSED, target
}: P8000FieldComponentProps): JSX.Element => {
  const dispatch = useDispatch()
  const sendFolgendeSEDer: Array<string> = _.get(PSED, target)

  const setCheckbox = (sed: string, checked: boolean) => {
    let sedArr = sendFolgendeSEDer ? [...sendFolgendeSEDer] : []
    if(checked){
      sedArr.push(value)
    } else {
      sedArr = sedArr.filter((sedType: string) => sedType !== value)
    }

    dispatch(updatePSED(`${target}`, sedArr))
  }
  return (
    <Checkbox
      checked={!!_.find(sendFolgendeSEDer, (sed) => sed === value)}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckbox(value, e.target.checked)}
    >
      {label}
    </Checkbox>
  )
}
