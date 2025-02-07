import React from "react";
import {Checkbox} from "@navikt/ds-react";
import {PSED} from "src/declarations/app";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "src/declarations/types";
import {useDispatch} from "react-redux";
import _ from "lodash";

export interface SendFolgendeSEDerProps {
  label: string
  value: string
  PSED: PSED | null | undefined
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
  namespace: string
  target: string
}

export const SendFolgendeSEDer: React.FC<SendFolgendeSEDerProps> = ({
  label, value, PSED, updatePSED
}: SendFolgendeSEDerProps): JSX.Element => {
  const dispatch = useDispatch()
  const target = "pensjon.anmodning.seder[0].sendFolgendeSEDer"
  const sendFolgendeSEDer: Array<string> = _.get(PSED, target)

  const setCheckbox = (sed: string, checked: boolean) => {
    let sedArr = [...sendFolgendeSEDer]
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
