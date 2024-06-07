import {State} from "src/declarations/reducers";
import {MainFormSelector} from "../MainForm";
import React from "react";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "src/store";
import {AlignStartRow, Column, FlexCenterDiv, HorizontalSeparatorDiv, VerticalSeparatorDiv} from "@navikt/hoykontrast";
import Input from "src/components/Forms/Input";
import {Person} from "src/declarations/p2000";
import {BodyLong, Heading, Label} from "@navikt/ds-react";
import CountryData, {Country, CountryFilter} from "@navikt/land-verktoy";
import CountrySelect from "@navikt/landvelger";
import FormText from "../../../components/Forms/FormText";
import Flag from "@navikt/flagg-ikoner";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface FoedestedProps {
  parentNamespace: string
  parentIndex?: number
  parentEditMode?: boolean
  person: Person | undefined,
  setPersonOpplysninger: any
}

const Foedested: React.FC<FoedestedProps> = ({
  parentNamespace,
  parentIndex,
  parentEditMode = true,
  person,
  setPersonOpplysninger
}: FoedestedProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-person-foedested`

  const countryData = CountryData.getCountryInstance('nb')

  return(
    <>
      <Heading size="small">{t('p2000:form-person-foedested')}</Heading>
      <VerticalSeparatorDiv size='0.5' />
      <AlignStartRow>
        {parentEditMode &&
          <>
            <Column>
              <Input
                error={validation[namespace + '-by']?.feilmelding}
                namespace={namespace}
                id='person-foedested-by'
                label={t('p2000:form-person-foedested-by')}
                onChanged={(v) => setPersonOpplysninger("by", v, parentIndex)}
                value={(person?.foedested?.by) ?? ''}
              />
            </Column>
            <Column>
              <Input
                error={validation[namespace + '-region']?.feilmelding}
                namespace={namespace}
                id='person-foedested-region'
                label={t('p2000:form-person-foedested-region')}
                onChanged={(v) => setPersonOpplysninger("region", v, parentIndex)}
                value={(person?.foedested?.region)  ?? ''}
              />
            </Column>
            <Column>
              <CountrySelect
                error={validation[namespace + '-land']?.feilmelding}
                id="person-foedested-land"
                includeList={CountryFilter.STANDARD({})}
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
                    error={validation[namespace + '-by']?.feilmelding}
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
                    error={validation[namespace + '-region']?.feilmelding}
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
                    error={validation[namespace + '-land']?.feilmelding}
                  >
                    <Label>
                      {t('p2000:form-person-foedested-land')}
                    </Label>
                    <FlexCenterDiv>
                      {person?.foedested?.land && <Flag size='S' country={person?.foedested?.land!} />}
                      <HorizontalSeparatorDiv />
                      {countryData.findByValue(person?.foedested?.land)?.label ?? person?.foedested?.land}
                    </FlexCenterDiv>
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
