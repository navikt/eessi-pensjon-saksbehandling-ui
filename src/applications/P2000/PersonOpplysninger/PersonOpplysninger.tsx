import {State} from "declarations/reducers";
import {MainFormSelector} from "../MainForm";
import React from "react";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "store";
import {AlignStartRow, Column, VerticalSeparatorDiv} from "@navikt/hoykontrast";
import Input from "components/Forms/Input";
import DateField from "../DateField/DateField";
import {HorizontalRadioGroup} from "components/StyledComponents";
import {Radio} from "@navikt/ds-react";
import {Person} from "declarations/p2000";
import {dateToString} from "utils/utils";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface PersonOpplysningerProps {
  parentNamespace: string
  parentIndex?: number
  person: Person | undefined,
  setPersonOpplysninger: any
}

const PersonOpplysninger: React.FC<PersonOpplysningerProps> = ({
  parentNamespace,
  parentIndex,
  person,
  setPersonOpplysninger
}: PersonOpplysningerProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-person`

  return(
    <>
      <AlignStartRow>
        <Column>
          <Input
            error={validation[namespace + '-etternavn']?.feilmelding}
            namespace={namespace}
            id='person-etternavn'
            label={t('p2000:form-person-etternavn')}
            onChanged={(v) => setPersonOpplysninger("etternavn", v, parentIndex)}
            value={(person?.etternavn) ?? ''}
          />
        </Column>
        <Column>
          <Input
            error={validation[namespace + '-fornavn']?.feilmelding}
            namespace={namespace}
            id='person-fornavn'
            label={t('p2000:form-person-fornavn')}
            onChanged={(v) => setPersonOpplysninger("fornavn", v, parentIndex)}
            value={(person?.fornavn)  ?? ''}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv/>
      <AlignStartRow>
        <Column>
          <DateField
            id='person-foedselsdato'
            index={0}
            label={t('p2000:form-person-foedselsdato')}
            error={validation[namespace + '-foedselsdato']?.feilmelding}
            namespace={namespace}
            onChanged={(v) => setPersonOpplysninger("foedselsdato", dateToString(v), parentIndex)}
            defaultDate={person?.foedselsdato ?? ''}
          />
        </Column>
        <Column>
          <HorizontalRadioGroup
            error={validation[namespace + '-kjoenn']?.feilmelding}
            id={namespace + "-person-kjoenn"}
            legend={t('p2000:form-person-kjoenn')}
            onChange={(v) => setPersonOpplysninger("kjoenn", v, parentIndex)}
            value={person?.kjoenn}
          >
            <Radio value="M">Mann</Radio>
            <Radio value="K">Kvinne</Radio>
            <Radio value="">Ukjent</Radio>
          </HorizontalRadioGroup>
        </Column>
      </AlignStartRow>
    </>
  )
}

export default PersonOpplysninger
