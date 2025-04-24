import React from "react";
import {Box, HGrid, HStack, Spacer, TextField, VStack} from "@navikt/ds-react";
import CountryDropdown from "src/components/CountryDropdown/CountryDropdown";
import {Country} from "@navikt/land-verktoy";
import {CheckBoxField} from "src/applications/P8000/components/CheckboxField";
import {P8000FieldComponentProps} from "src/applications/P8000/P8000";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {P8000Field} from "src/declarations/p8000";
import {useTranslation} from "react-i18next";

export const CheckboxWithCountryAndPeriods: React.FC<P8000FieldComponentProps> = ({
  label, value, PSED, updatePSED, namespace, target, options
}: P8000FieldComponentProps): JSX.Element => {
  const dispatch = useDispatch()
  const {t} = useTranslation()
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
          <HGrid columns={3} gap="4">
            {options?.showCountry &&
              <CountryDropdown
                error={undefined}
                id="land"
                countryCodeListName="euEftaLand"
                label={t('p8000:form-label-land')}
                hideLabel={false}
                onOptionSelected={(c: Country) => {setProperty('landkode', c.value)}}
                values={field?.landkode  ?? ''}
              />
            }
            {options?.showPeriod &&
              <HStack
                gap="4"
              >
                <TextField
                  style={{width: "5rem"}}
                  label={t('p8000:form-label-fra')}
                  hideLabel={false}
                  value={field?.periodeFra}
                  onChange={(e) => setProperty('periodeFra', e.target.value)}
                />
                <TextField
                  style={{width: "5rem"}}
                  label={t('p8000:form-label-til')}
                  hideLabel={false}
                  value={field?.periodeTil}
                  onChange={(e) => setProperty('periodeTil', e.target.value)}
                />
              </HStack>
            }
            {options?.showMonths &&
              <TextField
                style={{width: "5rem"}}
                label={t('p8000:form-label-antall-maaneder')}
                hideLabel={false}
                value={field?.antallMaaneder}
                onChange={(e) => setProperty('antallMaaneder', e.target.value)}
              />
            }
            <Spacer/>
          </HGrid>
        </Box>
      }
    </VStack>
  )
}

