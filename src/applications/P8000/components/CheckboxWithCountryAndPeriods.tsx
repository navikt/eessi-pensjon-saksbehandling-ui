import React from "react";
import {Box, ErrorMessage, HStack, Spacer, TextField, VStack} from "@navikt/ds-react";
import CountryDropdown from "src/components/CountryDropdown/CountryDropdown";
import {Country} from "@navikt/land-verktoy";
import {CheckBoxField} from "src/applications/P8000/components/CheckboxField";
import {P8000FieldComponentProps} from "src/applications/P8000/P8000";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {P8000Field} from "src/declarations/p8000";
import {useTranslation} from "react-i18next";
import {State} from "src/declarations/reducers";
import {MainFormSelector} from "src/applications/P2000/MainForm";
import {useAppSelector} from "src/store";
import classNames from "classnames";
import styled from "styled-components";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
})


const TextFieldWithErrorBorder = styled(TextField)`
  &.error > input {
    border-color: var(--a-border-danger);
    box-shadow: 0 0 0 1px var(--a-border-danger);
  }

  &.error > input:hover {
    border-color: var(--a-border-action-hover);
    box-shadow: 0 0 0 0 var(--a-border-danger);
  }
`

const CountryDropdownWithErrorBorder = styled(CountryDropdown)`
  &.error .c-countrySelect__select__control {
    border-color: var(--a-border-danger);
    box-shadow: 0 0 0 1px var(--a-border-danger);
  }

  &.error .c-countrySelect__select__control:hover {
    border-color: var(--a-border-action-hover);
    box-shadow: 0 0 0 0 var(--a-border-danger);
  }
`



export const CheckboxWithCountryAndPeriods: React.FC<P8000FieldComponentProps> = ({
  label, value, PSED, updatePSED, namespace, target, options
}: P8000FieldComponentProps): JSX.Element => {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const { validation } = useAppSelector(mapState)
  const field: P8000Field = _.get(PSED, `${target}.${value}`)

  const checked= field ? field.value : false

  const setProperty = (property: string, propValue: string) => {
    dispatch(updatePSED(`${target}.${value}.${property}`, propValue))
  }

  return (
    <VStack>
      <CheckBoxField
        label={label}
        value={value}
        PSED={PSED}
        updatePSED={updatePSED}
        namespace={namespace}
        target={target}
      />
      {checked &&
        <Box
          paddingBlock="2 4"
          paddingInline="4 0"
          borderWidth="1"
          borderRadius="medium"
          borderColor="border-subtle"
          background="surface-subtle"
        >
          <VStack gap="4">
            <HStack gap="4">
              {options?.showCountry &&
                <Box width="30%">
                  <CountryDropdownWithErrorBorder
                    id={namespace + "-" + value + "-land"}
                    className={classNames({ error: validation[namespace + "-" + value + "-land"]?.feilmelding})}
                    countryCodeListName="euEftaLand"
                    label={t('p8000:form-label-land')}
                    hideLabel={false}
                    onOptionSelected={(c: Country) => {setProperty('landkode', c.value)}}
                    values={field?.landkode  ?? ''}
                  />
                </Box>
              }
              {options?.showPeriod &&
                <HStack
                  gap="4"
                  align="start"
                >
                  <TextFieldWithErrorBorder
                    id={namespace + "-" + value + "-periodeFra"}
                    className={classNames({ error: validation[namespace + "-" + value + "-periodeFra"]?.feilmelding})}
                    style={{maxWidth: "5rem"}}
                    label={t('p8000:form-label-fra')}
                    hideLabel={false}
                    value={field?.periodeFra}
                    onChange={(e) => setProperty('periodeFra', e.target.value)}
                  />
                  <TextFieldWithErrorBorder
                    id={namespace + "-" + value + "-periodeTil"}
                    className={classNames({ error: validation[namespace + "-" + value + "-periodeTil"]?.feilmelding  })}
                    style={{maxWidth: "5rem"}}
                    label={t('p8000:form-label-til')}
                    hideLabel={false}
                    value={field?.periodeTil}
                    onChange={(e) => setProperty('periodeTil', e.target.value)}
                  />
                </HStack>
              }
              {options?.showMonths &&
                <TextFieldWithErrorBorder
                  id={namespace + "-" + value + "-antallMaaneder"}
                  className={classNames({ error: validation[namespace + "-" + value + "-antallMaaneder"]?.feilmelding  })}
                  style={{maxWidth: "5rem"}}
                  label={t('p8000:form-label-antall-maaneder')}
                  hideLabel={false}
                  value={field?.antallMaaneder}
                  onChange={(e) => setProperty('antallMaaneder', e.target.value)}
                />
              }
              <Spacer/>
            </HStack>
            <VStack>
              {validation[namespace + "-" + value + "-land"]?.feilmelding &&  <ErrorMessage showIcon={true}>{validation[namespace + "-" + value + "-land"]?.feilmelding}</ErrorMessage>}
              {validation[namespace + "-" + value + "-periodeFra"]?.feilmelding &&  <ErrorMessage showIcon={true}>{validation[namespace + "-" + value + "-periodeFra"]?.feilmelding}</ErrorMessage>}
              {validation[namespace + "-" + value + "-periodeTil"]?.feilmelding &&  <ErrorMessage showIcon={true}>{validation[namespace + "-" + value + "-periodeTil"]?.feilmelding}</ErrorMessage>}
              {validation[namespace + "-" + value + "-antallMaaneder"]?.feilmelding &&  <ErrorMessage showIcon={true}>{validation[namespace + "-" + value + "-antallMaaneder"]?.feilmelding}</ErrorMessage>}
            </VStack>
          </VStack>
        </Box>
      }
    </VStack>
  )
}

