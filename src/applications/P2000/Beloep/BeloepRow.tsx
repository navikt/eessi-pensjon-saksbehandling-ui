import {AlignStartRow, Column} from "@navikt/hoykontrast";
import React from "react";
import {Beloep} from "../../../declarations/p2000";
import {Label} from "@navikt/ds-react";
import {useTranslation} from "react-i18next";
import {formatDate} from "../../../utils/utils";

export interface BeloepRowProps {
  beloep: Beloep | null | undefined
  index: number
}

const BeloepRow: React.FC<BeloepRowProps> = ({
  beloep, index
}: BeloepRowProps): JSX.Element => {

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
          <Label>{t('p2000:form-ytelse-beloep-beloep')}</Label>
        </Column>
        <Column>
          <Label>{t('p2000:form-ytelse-beloep-valuta')}</Label>
        </Column>
        <Column>
          <Label>{t('p2000:form-ytelse-beloep-beloep-siden')}</Label>
        </Column>
        <Column>
          <Label>{t('p2000:form-ytelse-beloep-betalingshyppighet')}</Label>
        </Column>
      </AlignStartRow>
    }
      <AlignStartRow>
        <Column>
          {beloep?.beloep}
        </Column>
        <Column>
          {beloep?.valuta}
        </Column>
        <Column>
          {formatDate(beloep?.gjeldendesiden as string)}
        </Column>
        <Column>
          {beloep?.betalingshyppighetytelse ? betalingshyppighetMap[beloep?.betalingshyppighetytelse] : ''}
        </Column>
      </AlignStartRow>
    </>
  )
}

export default BeloepRow
