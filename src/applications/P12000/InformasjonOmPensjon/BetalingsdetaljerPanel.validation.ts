import {Validation} from "src/declarations/app";
import {Betalingsdetaljer} from "src/declarations/p12000";
import {getIdx} from "src/utils/namespace";
import {checkIfEmpty} from "src/utils/validation";

export interface ValidationBetalingsdetaljerProps {
  betalingsdetaljer: Betalingsdetaljer | undefined
  index?: number
}

export const validateBetalingsdetaljer = (
  v: Validation,
  namespace: string | undefined,
  {
    betalingsdetaljer,
    index
  }: ValidationBetalingsdetaljerProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfEmpty(v, {
    needle: betalingsdetaljer?.belop,
    id: namespace + idx + '-belop',
    message: 'validation:missing-p12000-betalingsdetaljer-belop'
  }))

  hasErrors.push(checkIfEmpty(v, {
    needle: betalingsdetaljer?.valuta,
    id: namespace + idx + '-valuta',
    message: 'validation:missing-p12000-betalingsdetaljer-valuta'
  }))

  hasErrors.push(checkIfEmpty(v, {
    needle: betalingsdetaljer?.utbetalingshyppighet,
    id: namespace + idx + '-utbetalingshyppighet',
    message: 'validation:missing-p12000-betalingsdetaljer-utbetalingshyppighet'
  }))

  return hasErrors.find(value => value) !== undefined
}
