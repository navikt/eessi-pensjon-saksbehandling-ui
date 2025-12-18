import React, {JSX} from "react";
import {Checkbox} from "@navikt/ds-react";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {P8000FieldComponentProps} from "src/applications/P8000/P8000";

export const SendFolgendeSEDerEllerDokumenter: React.FC<P8000FieldComponentProps> = ({
  label, value, PSED, updatePSED, target
}: P8000FieldComponentProps): JSX.Element => {
  const dispatch = useDispatch()
  const sendFolgendeSEDerEllerDokumenter: Array<string> = _.get(PSED, target!)

  const setCheckbox = (sType: string, checked: boolean) => {
    let sedArr = sendFolgendeSEDerEllerDokumenter ? [...sendFolgendeSEDerEllerDokumenter] : []
    if(checked){
      sedArr.push(sType)
    } else {
      sedArr = sedArr.filter((sedType: string) => sedType !== sType)
    }

    dispatch(updatePSED(`${target}`, sedArr))
  }
  return (
    <Checkbox
      checked={!!_.find(sendFolgendeSEDerEllerDokumenter, (sed) => sed === value.toLowerCase())}
      value={value.toLowerCase()}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckbox(value.toLowerCase(), e.target.checked)}
    >
      {label}
    </Checkbox>
  )
}
