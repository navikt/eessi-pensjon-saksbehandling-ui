import {AlignStartRow, Column} from "@navikt/hoykontrast";
import React from "react";
import {Inntekt} from "../../../declarations/p2000";

export interface InntektRowProps {
  inntekt: Inntekt | null | undefined
}

const betalingshyppighetMap:any = {
    '01': 'Årlig',
    '02': 'Kvartalsvis',
    '03': 'Månedlig 12/år',
    '04': 'Månedlig 13/år',
    '05': 'Månedlig 14/år',
    '06': 'Ukentlig',
    '99': 'Annet - legg direkte inn i RINA'
}

const InntektRow: React.FC<InntektRowProps> = ({
  inntekt
}: InntektRowProps): JSX.Element => {

  return (
    <AlignStartRow>
      <Column>
        {inntekt?.beloep}
      </Column>
      <Column>
        {inntekt?.valuta}
      </Column>
      <Column>
        {inntekt?.beloeputbetaltsiden}
      </Column>
      <Column>
        {inntekt?.betalingshyppighetinntekt ? betalingshyppighetMap[inntekt?.betalingshyppighetinntekt] : ''}
      </Column>
    </AlignStartRow>
  )
}

export default InntektRow
