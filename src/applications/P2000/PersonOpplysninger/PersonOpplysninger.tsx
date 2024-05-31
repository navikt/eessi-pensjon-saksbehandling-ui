import {State} from "declarations/reducers";
import {MainFormSelector} from "../MainForm";
import React from "react";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "store";
import {AlignStartRow, Column, VerticalSeparatorDiv} from "@navikt/hoykontrast";
import Input from "components/Forms/Input";
import DateField from "../DateField/DateField";
import {HorizontalRadioGroup} from "components/StyledComponents";
import {BodyLong, Label, Radio} from "@navikt/ds-react";
import {Person} from "declarations/p2000";
import {dateToString, formatDate} from "utils/utils";
import FormText from "../../../components/Forms/FormText";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface PersonOpplysningerProps {
  parentNamespace: string
  parentIndex?: number
  parentEditMode?:boolean
  person: Person | undefined,
  setPersonOpplysninger: any
}

const PersonOpplysninger: React.FC<PersonOpplysningerProps> = ({
  parentNamespace,
  parentIndex,
  parentEditMode = true,
  person,
  setPersonOpplysninger
}: PersonOpplysningerProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-person`
  console.log(namespace)

  const getKjoenn = (kjoenn: any) => {
    if(kjoenn === "M") return "Mann"
    if(kjoenn === "K") return "Kvinne"
    if(kjoenn === "") return "Ukjent"
    return undefined
  }

  return(
      <>
        {parentEditMode &&
          <>
            <AlignStartRow>
              <Column>
                <Input
                  error={validation[namespace + '-etternavn']?.feilmelding}
                  namespace={namespace}
                  id='etternavn'
                  label={t('p2000:form-person-etternavn')}
                  onChanged={(v) => setPersonOpplysninger("etternavn", v, parentIndex)}
                  value={(person?.etternavn) ?? ''}
                />
              </Column>
              <Column>
                <Input
                  error={validation[namespace + '-fornavn']?.feilmelding}
                  namespace={namespace}
                  id='fornavn'
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
                  id='foedselsdato'
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
                  id={namespace + "-kjoenn"}
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
        }
        {!parentEditMode &&
          <>
            <AlignStartRow>
              <Column>
                <FormText
                  error={validation[namespace + '-etternavn']?.feilmelding}
                  id={namespace + '-etternavn'}
                >
                  <Label>
                    {t('p2000:form-person-etternavn')}
                  </Label>
                  <BodyLong>{person?.etternavn}</BodyLong>
                </FormText>
              </Column>
              <Column>
                <FormText
                  error={validation[namespace + '-fornavn']?.feilmelding}
                  id={namespace + '-fornavn'}
                >
                  <Label>
                    {t('p2000:form-person-fornavn')}
                  </Label>
                  <BodyLong>{person?.fornavn}</BodyLong>
                </FormText>
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv/>
            <AlignStartRow>
              <Column>
                <FormText
                  id={namespace + '-foedselsdato'}
                  error={validation[namespace + '-foedselsdato']?.feilmelding}
                >
                  <Label>
                    {t('p2000:form-person-foedselsdato')}
                  </Label>
                  <BodyLong>{formatDate(person?.foedselsdato)}</BodyLong>
                </FormText>
              </Column>
              <Column>
                <FormText
                  error={validation[namespace + '-kjoenn']?.feilmelding}
                  id={namespace + "-kjoenn"}
                >
                  <Label>
                    {t('p2000:form-person-kjoenn')}
                  </Label>
                  <BodyLong>{getKjoenn(person?.kjoenn)}</BodyLong>
                </FormText>
              </Column>
            </AlignStartRow>
          </>
        }
      </>
  )
}

export default PersonOpplysninger
