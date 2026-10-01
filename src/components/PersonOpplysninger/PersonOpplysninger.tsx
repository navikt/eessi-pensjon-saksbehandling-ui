import {State} from "src/declarations/reducers";
import {MainFormSelector} from 'src/applications/MainForm'
import React, {JSX} from "react";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "src/store";
import Input from "src/components/Forms/Input";
import DateField from "src/components/Forms/DateField";
import {BodyLong, HGrid, Label, Radio, RadioGroup, VStack} from "@navikt/ds-react";
import {formatDate} from "src/utils/utils";
import {Validation} from "src/declarations/app";
import FormTextBox from "src/components/Forms/FormTextBox";
import {Person} from "src/declarations/sed";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface PersonOpplysningerProps {
  parentNamespace: string
  parentIndex?: number
  parentEditMode?: boolean
  person: Person | undefined,
  setPersonOpplysninger: any
  parentValidation?: Validation
}

const PersonOpplysninger: React.FC<PersonOpplysningerProps> = ({
  parentNamespace,
  parentIndex,
  parentEditMode = true,
  person,
  setPersonOpplysninger,
  parentValidation
}: PersonOpplysningerProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-person`

  const v: Validation = parentValidation ? parentValidation : validation

  const getKjoenn = (kjoenn: any) => {
    if(kjoenn === "M") return t('ui:kjoenn-mann')
    if(kjoenn === "K") return t('ui:kjoenn-kvinne')
    if(kjoenn === "U") return t('ui:kjoenn-ukjent')
    return undefined
  }

  return (
    <VStack gap="space-16">
      {parentEditMode &&
        <>
          <HGrid gap="space-16" columns={3} align="start">
            <Input
              error={v[namespace + '-etternavn']?.feilmelding}
              namespace={namespace}
              id='etternavn'
              label={t('ui:form-person-etternavn')}
              onChanged={(v) => setPersonOpplysninger("etternavn", v, parentIndex)}
              value={(person?.etternavn) ?? ''}
            />
            <Input
              error={v[namespace + '-fornavn']?.feilmelding}
              namespace={namespace}
              id='fornavn'
              label={t('ui:form-person-fornavn')}
              onChanged={(v) => setPersonOpplysninger("fornavn", v, parentIndex)}
              value={(person?.fornavn)  ?? ''}
            />
            <DateField
              id='foedselsdato'
              index={0}
              label={t('ui:form-person-foedselsdato')}
              error={v[namespace + '-foedselsdato']?.feilmelding}
              namespace={namespace}
              onChanged={(v) => setPersonOpplysninger("foedselsdato", v, parentIndex)}
              dateValue={person?.foedselsdato ?? ''}
            />
          </HGrid>
          <RadioGroup className={"horizontalRadioGroup"}
            error={v[namespace + '-kjoenn']?.feilmelding}
            id={namespace + "-kjoenn"}
            legend={t('ui:form-person-kjoenn')}
            onChange={(v) => setPersonOpplysninger("kjoenn", v, parentIndex)}
            value={person?.kjoenn}
          >
            <HGrid gap="space-16" columns={3}>
              <Radio value="M">{t('ui:kjoenn-mann')}</Radio>
              <Radio value="K">{t('ui:kjoenn-kvinne')}</Radio>
              <Radio value="U">{t('ui:kjoenn-ukjent')}</Radio>
            </HGrid>
          </RadioGroup>
        </>
      }
      {!parentEditMode &&
        <>
          <HGrid gap="space-16" columns={3} align="start">
            <FormTextBox padding="space-0"
              error={v[namespace + '-etternavn']?.feilmelding}
              id={namespace + '-etternavn'}
            >
              <Label>
                {t('ui:form-person-etternavn')}
              </Label>
              <BodyLong>{person?.etternavn}</BodyLong>
            </FormTextBox>
            <FormTextBox padding="space-0"
              error={v[namespace + '-fornavn']?.feilmelding}
              id={namespace + '-fornavn'}
            >
              <Label>
                {t('ui:form-person-fornavn')}
              </Label>
              <BodyLong>{person?.fornavn}</BodyLong>
            </FormTextBox>
          </HGrid>

          <HGrid gap="space-16" columns={3}>
            <FormTextBox padding="space-0"
              id={namespace + '-foedselsdato'}
              error={v[namespace + '-foedselsdato']?.feilmelding}
            >
              <Label>
                {t('ui:form-person-foedselsdato')}
              </Label>
              <BodyLong>{formatDate(person?.foedselsdato)}</BodyLong>
            </FormTextBox>
            <FormTextBox padding="space-0"
              error={v[namespace + '-kjoenn']?.feilmelding}
              id={namespace + "-kjoenn"}
            >
              <Label>
                {t('ui:form-person-kjoenn')}
              </Label>
              <BodyLong>{getKjoenn(person?.kjoenn)}</BodyLong>
            </FormTextBox>
          </HGrid>
        </>
      }
    </VStack>
  );
}

export default PersonOpplysninger
