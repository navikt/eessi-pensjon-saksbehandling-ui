import {AlignStartRow, Column} from "@navikt/hoykontrast";
import React from "react";
import {Inntekt} from "../../../declarations/p2000";
import {Label} from "@navikt/ds-react";
import {useTranslation} from "react-i18next";
import {formatDate} from "../../../utils/utils";

export interface InntektRowProps {
  inntekt: Inntekt | null | undefined
  index: number
}

const InntektRow: React.FC<InntektRowProps> = ({
  inntekt, index
}: InntektRowProps): JSX.Element => {

  const { t } = useTranslation()
  const betalingshyppighetMap:any = {
    '01': t('p2000:form-betalingshyppighet-aarlig'),
    '02': t('p2000:form-betalingshyppighet-kvartalsvis'),
    '03': t('p2000:form-betalingshyppighet-maanedlig-12'),
    '04': t('p2000:form-betalingshyppighet-maanedlig-13'),
    '05': t('p2000:form-betalingshyppighet-maanedlig-14'),
    '06': t('p2000:form-betalingshyppighet-ukentlig'),
    '99': t('p2000:form-betalingshyppighet-annet')
  }

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
          {formatDate(inntekt?.beloeputbetaltsiden as string)}
        </Column>
        <Column>
          {inntekt?.betalingshyppighetinntekt ? betalingshyppighetMap[inntekt?.betalingshyppighetinntekt] : ''}
        </Column>
      </AlignStartRow>
    </>
  )
}

export default InntektRow
