import {State} from "src/declarations/reducers";
import {MainFormSelector} from "../MainForm";
import React from "react";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "src/store";
import Input from "src/components/Forms/Input";
import DateField from "../DateField/DateField";
import {BodyLong, HGrid, Label, Radio, RadioGroup, VStack} from "@navikt/ds-react";
import {  formatDate} from "src/utils/utils";
import {Validation} from "src/declarations/app";
import FormTextBox from "src/components/Forms/FormTextBox";
import {Person} from "src/declarations/sed";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface PersonOpplysningerProps {
  parentNamespace: string
  parentIndex?: number
  parentEditMode?:boolean
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

  const v:Validation = parentValidation ? parentValidation : validation

  const getKjoenn = (kjoenn: any) => {
    if(kjoenn === "M") return "Mann"
    if(kjoenn === "K") return "Kvinne"
    if(kjoenn === "") return "Ukjent"
    return undefined
  }

  return(
      <VStack gap="4">
        {parentEditMode &&
          <>
            <HGrid gap="4" columns={3}>
              <Input
                error={v[namespace + '-etternavn']?.feilmelding}
                namespace={namespace}
                id='etternavn'
                label={t('p2000:form-person-etternavn')}
                onChanged={(v) => setPersonOpplysninger("etternavn", v, parentIndex)}
                value={(person?.etternavn) ?? ''}
              />
              <Input
                error={v[namespace + '-fornavn']?.feilmelding}
                namespace={namespace}
                id='fornavn'
                label={t('p2000:form-person-fornavn')}
                onChanged={(v) => setPersonOpplysninger("fornavn", v, parentIndex)}
                value={(person?.fornavn)  ?? ''}
              />
              <DateField
                id='foedselsdato'
                index={0}
                label={t('p2000:form-person-foedselsdato')}
                error={v[namespace + '-foedselsdato']?.feilmelding}
                namespace={namespace}
                onChanged={(v) => setPersonOpplysninger("foedselsdato", v, parentIndex)}
                dateValue={person?.foedselsdato ?? ''}
              />
            </HGrid>
            <HGrid gap="4" columns={3}>
              <RadioGroup className={"horizontalRadioGroup"}
                error={v[namespace + '-kjoenn']?.feilmelding}
                id={namespace + "-kjoenn"}
                legend={t('p2000:form-person-kjoenn')}
                onChange={(v) => setPersonOpplysninger("kjoenn", v, parentIndex)}
                value={person?.kjoenn}
              >
                <Radio value="M">Mann</Radio>
                <Radio value="K">Kvinne</Radio>
                <Radio value="">Ukjent</Radio>
              </RadioGroup>
            </HGrid>
          </>
        }
        {!parentEditMode &&
          <>
            <HGrid gap="4" columns={3}>
              <FormTextBox padding="0"
                error={v[namespace + '-etternavn']?.feilmelding}
                id={namespace + '-etternavn'}
              >
                <Label>
                  {t('p2000:form-person-etternavn')}
                </Label>
                <BodyLong>{person?.etternavn}</BodyLong>
              </FormTextBox>
              <FormTextBox padding="0"
                error={v[namespace + '-fornavn']?.feilmelding}
                id={namespace + '-fornavn'}
              >
                <Label>
                  {t('p2000:form-person-fornavn')}
                </Label>
                <BodyLong>{person?.fornavn}</BodyLong>
              </FormTextBox>
            </HGrid>

            <HGrid gap="4" columns={3}>
              <FormTextBox padding="0"
                id={namespace + '-foedselsdato'}
                error={v[namespace + '-foedselsdato']?.feilmelding}
              >
                <Label>
                  {t('p2000:form-person-foedselsdato')}
                </Label>
                <BodyLong>{formatDate(person?.foedselsdato)}</BodyLong>
              </FormTextBox>
              <FormTextBox padding="0"
                error={v[namespace + '-kjoenn']?.feilmelding}
                id={namespace + "-kjoenn"}
              >
                <Label>
                  {t('p2000:form-person-kjoenn')}
                </Label>
                <BodyLong>{getKjoenn(person?.kjoenn)}</BodyLong>
              </FormTextBox>
            </HGrid>
          </>
        }
      </VStack>
  )
}

export default PersonOpplysninger
