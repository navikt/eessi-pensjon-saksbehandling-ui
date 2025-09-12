import {State} from "src/declarations/reducers";
import {MainFormSelector} from "../MainForm";
import React from "react";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "src/store";
import Input from "src/components/Forms/Input";
import {BodyLong, Heading, HGrid, Label, VStack} from "@navikt/ds-react";
import {Country} from "@navikt/land-verktoy";
import {Validation} from "src/declarations/app";
import FlagPanel from "src/components/FlagPanel/FlagPanel";
import CountryDropdown from "src/components/CountryDropdown/CountryDropdown";
import FormTextBox from "src/components/Forms/FormTextBox";
import {Person} from "src/declarations/sed";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface FoedestedProps {
  parentNamespace: string
  parentIndex?: number
  parentEditMode?: boolean
  person: Person | undefined,
  setPersonOpplysninger: any
  parentValidation?: Validation
}

const Foedested: React.FC<FoedestedProps> = ({
  parentNamespace,
  parentIndex,
  parentEditMode = true,
  person,
  setPersonOpplysninger,
  parentValidation
}: FoedestedProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-person-foedested`

  const v:Validation = parentValidation ? parentValidation : validation

  return(
    <VStack gap="4">
      <Heading size="small">{t('p2000:form-person-foedested')}</Heading>
      <HGrid columns={3} gap="4" align="start">
        {parentEditMode &&
          <>
            <Input
              error={v[namespace + '-by']?.feilmelding}
              namespace={namespace}
              id='by'
              label={t('p2000:form-person-foedested-by')}
              onChanged={(v) => setPersonOpplysninger("by", v !== "" ? v : undefined, parentIndex)}
              value={(person?.foedested?.by) ?? ''}
            />
            <Input
              error={v[namespace + '-region']?.feilmelding}
              namespace={namespace}
              id='region'
              label={t('p2000:form-person-foedested-region')}
              onChanged={(v) => setPersonOpplysninger("region", v !== "" ? v : undefined, parentIndex)}
              value={(person?.foedested?.region)  ?? ''}
            />
            <CountryDropdown
              error={v[namespace + '-land']?.feilmelding}
              id="land"
              countryCodeListName="verdensLandHistorisk"
              label={t('p2000:form-person-foedested-land')}
              onOptionSelected={(v: Country) => setPersonOpplysninger("land", v.value, parentIndex)}
              values={(person?.foedested?.land)  ?? ''}
            />
          </>
        }
        {!parentEditMode &&
          <>
            {!person?.foedested?.by && !person?.foedested?.region && !person?.foedested?.land && <em>Ingen fødested registrert</em>}
            {(person?.foedested?.by || person?.foedested?.region || person?.foedested?.land) &&
              <>
                <FormTextBox padding="0"
                  id={"person-foedested-by"}
                  error={v[namespace + '-by']?.feilmelding}
                >
                  <Label>
                    {t('p2000:form-person-foedested-by')}
                  </Label>
                  <BodyLong>{person?.foedested?.by}</BodyLong>
                </FormTextBox>
                <FormTextBox padding="0"
                  id={"person-foedested-region"}
                  error={v[namespace + '-region']?.feilmelding}
                >
                  <Label>
                    {t('p2000:form-person-foedested-region')}
                  </Label>
                  <BodyLong>{person?.foedested?.region}</BodyLong>
                </FormTextBox>
                <FormTextBox padding="0"
                  id={"person-foedested-land"}
                  error={v[namespace + '-land']?.feilmelding}
                >
                  <Label>
                    {t('p2000:form-person-foedested-land')}
                  </Label>
                  <FlagPanel land={person?.foedested?.land}/>
                </FormTextBox>
              </>
            }
          </>
        }
      </HGrid>
    </VStack>
  )
}

export default Foedested
