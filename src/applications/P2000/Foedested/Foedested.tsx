import {State} from "src/declarations/reducers";
import {MainFormSelector} from "../MainForm";
import React from "react";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "src/store";
import {AlignStartRow, Column, VerticalSeparatorDiv} from "@navikt/hoykontrast";
import Input from "src/components/Forms/Input";
import {Person} from "src/declarations/p2000";
import {BodyLong, Heading, Label} from "@navikt/ds-react";
import {Country} from "@navikt/land-verktoy";
import CountrySelect from "@navikt/landvelger";
import FormText from "../../../components/Forms/FormText";
import {CountryCodeLists, Validation} from "src/declarations/app";
import FlagPanel from "src/components/FlagPanel/FlagPanel";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface FoedestedProps {
  parentNamespace: string
  parentIndex?: number
  parentEditMode?: boolean
  person: Person | undefined,
  countryCodes?: CountryCodeLists
  setPersonOpplysninger: any
  parentValidation?: Validation
}

const Foedested: React.FC<FoedestedProps> = ({
  parentNamespace,
  parentIndex,
  parentEditMode = true,
  person,
  countryCodes,
  setPersonOpplysninger,
  parentValidation
}: FoedestedProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-person-foedested`

  const v:Validation = parentValidation ? parentValidation : validation

  return(
    <>
      <Heading size="small">{t('p2000:form-person-foedested')}</Heading>
      <VerticalSeparatorDiv size='0.5' />
      <AlignStartRow>
        {parentEditMode &&
          <>
            <Column>
              <Input
                error={v[namespace + '-by']?.feilmelding}
                namespace={namespace}
                id='by'
                label={t('p2000:form-person-foedested-by')}
                onChanged={(v) => setPersonOpplysninger("by", v, parentIndex)}
                value={(person?.foedested?.by) ?? ''}
              />
            </Column>
            <Column>
              <Input
                error={v[namespace + '-region']?.feilmelding}
                namespace={namespace}
                id='region'
                label={t('p2000:form-person-foedested-region')}
                onChanged={(v) => setPersonOpplysninger("region", v, parentIndex)}
                value={(person?.foedested?.region)  ?? ''}
              />
            </Column>
            <Column>
              <CountrySelect
                error={v[namespace + '-land']?.feilmelding}
                id="land"
                includeList={countryCodes?.verdensLandHistorisk}
                label={t('p2000:form-person-foedested-land')}
                menuPortalTarget={document.body}
                onOptionSelected={(v: Country) => setPersonOpplysninger("land", v.value, parentIndex)}
                values={(person?.foedested?.land)  ?? ''}
              />
            </Column>
          </>
        }
        {!parentEditMode &&
          <>
            {!person?.foedested?.by && !person?.foedested?.region && !person?.foedested?.land && <Column><em>Ingen fødested registrert</em></Column>}
            {(person?.foedested?.by || person?.foedested?.region || person?.foedested?.land) &&
              <>
                <Column>
                  <FormText
                    id={"person-foedested-by"}
                    error={v[namespace + '-by']?.feilmelding}
                  >
                    <Label>
                      {t('p2000:form-person-foedested-by')}
                    </Label>
                    <BodyLong>{person?.foedested?.by}</BodyLong>
                  </FormText>
                </Column>
                <Column>
                  <FormText
                    id={"person-foedested-region"}
                    error={v[namespace + '-region']?.feilmelding}
                  >
                    <Label>
                      {t('p2000:form-person-foedested-region')}
                    </Label>
                    <BodyLong>{person?.foedested?.region}</BodyLong>
                  </FormText>
                </Column>
                <Column>
                  <FormText
                    id={"person-foedested-land"}
                    error={v[namespace + '-land']?.feilmelding}
                  >
                    <Label>
                      {t('p2000:form-person-foedested-land')}
                    </Label>
                    <FlagPanel land={person?.foedested?.land}/>
                  </FormText>
                </Column>
              </>
            }
          </>
        }
      </AlignStartRow>
    </>
  )
}

export default Foedested
