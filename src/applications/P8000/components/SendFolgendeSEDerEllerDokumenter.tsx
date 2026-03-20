import React, {JSX, useEffect} from "react";
import {Checkbox} from "@navikt/ds-react";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {P8000FieldComponentProps} from "src/applications/P8000/P8000";
import {setSelectedP8000Properties} from "src/actions/umami";

export const SendFolgendeSEDerEllerDokumenter: React.FC<P8000FieldComponentProps> = ({
  label, value, PSED, updatePSED, target, variantType
}: P8000FieldComponentProps): JSX.Element => {
  const dispatch = useDispatch()
  const sendFolgendeSEDerEllerDokumenter: Array<string> = _.get(PSED, target!)

  const setCheckbox = (sType: string, checked: boolean) => {
    let sedArr = sendFolgendeSEDerEllerDokumenter ? [...sendFolgendeSEDerEllerDokumenter] : []
    if(checked){
      sedArr.push(sType)
      dispatch(setSelectedP8000Properties(value, label))
    } else {
      sedArr = sedArr.filter((sedType: string) => sedType !== sType)
      dispatch(setSelectedP8000Properties(value, undefined))
    }

    dispatch(updatePSED(`${target}`, sedArr))
  }

  useEffect(() => {
    if(!!_.find(sendFolgendeSEDerEllerDokumenter, (sed) => sed === value.toLowerCase())){
      dispatch(setSelectedP8000Properties(value, label))
    }
  }, [])

  return (
    <Checkbox
      checked={!!_.find(sendFolgendeSEDerEllerDokumenter, (sed) => sed === value.toLowerCase())}
      value={value.toLowerCase()}
      onChange={
        (e: React.ChangeEvent<HTMLInputElement>) =>{
          setCheckbox(value.toLowerCase(), e.target.checked);
        }
      }
    >
      {label}
    </Checkbox>
  )
}
