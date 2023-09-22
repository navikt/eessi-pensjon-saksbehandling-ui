import {AlignStartRow, Column} from "@navikt/hoykontrast";
import React from "react";
import {Inntekt} from "../../../declarations/p2000";
import {Label} from "@navikt/ds-react";
import {useTranslation} from "react-i18next";

export interface InntektRowProps {
  inntekt: Inntekt | null | undefined
  index: number
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
  inntekt, index
}: InntektRowProps): JSX.Element => {

  const { t } = useTranslation()

  return (
    <>
    {index <= 0 &&
      <AlignStartRow>
        <Column>
          <Label>{t('p2000:form-arbeidsforhold-inntekt-belop')}</Label>
        </Column>
        <Column>
          <Label>{t('p2000:form-arbeidsforhold-inntekt-valuta')}</Label>
        </Column>
        <Column>
          <Label>{t('p2000:form-arbeidsforhold-inntekt-belop-siden')}</Label>
        </Column>
        <Column>
          <Label>{t('p2000:form-arbeidsforhold-inntekt-betalingshyppighet')}</Label>
        </Column>
      </AlignStartRow>
    }
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
    </>
  )
}

export default InntektRow
