import {AlignStartRow, Column} from "@navikt/hoykontrast";
import React from "react";
import {Inntekt} from "../../../declarations/p2000";

export interface InntektRowProps {
  inntekt: Inntekt | undefined
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
        {inntekt?.betalingshyppighetinntekt}
      </Column>
    </AlignStartRow>
  )
}

export default InntektRow
