import React from "react";
import {HGrid, HStack, TextField, VStack} from "@navikt/ds-react";
import CountryDropdown from "src/components/CountryDropdown/CountryDropdown";
import {Country} from "@navikt/land-verktoy";
import styled from "styled-components";
import {CheckBoxField} from "src/applications/P8000/components/CheckboxField";
import {P8000FieldComponentProps} from "src/applications/P8000/P8000";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {P8000Field} from "src/declarations/p8000";

export const CountryDiv = styled.div`
  min-width: 200px;
`

export const CheckboxWithCountryAndPeriods: React.FC<P8000FieldComponentProps> = ({
  label, value, PSED, updatePSED, namespace, target, options
}: P8000FieldComponentProps): JSX.Element => {
  const dispatch = useDispatch()
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
        <HGrid
          columns={4}
          gap="4"
          paddingBlock="0 4"
          paddingInline="4 0"
        >
          <VStack gap="4">
            {options?.showCountry &&
              <CountryDiv>
                <CountryDropdown
                  error={undefined}
                  id="land"
                  countryCodeListName="euEftaLand"
                  label="Land"
                  hideLabel={false}
                  onOptionSelected={(c: Country) => {setProperty('landkode', c.value)}}
                  values={field?.landkode  ?? ''}
                />
              </CountryDiv>
            }
            {options?.showPeriod &&
              <HStack
                gap="4"
                wrap={false}
              >
                <TextField label="Fra" hideLabel={false} value={field?.periodeFra} onChange={(e) => setProperty('periodeFra', e.target.value)}/>
                <TextField label="Til" hideLabel={false} value={field?.periodeTil} onChange={(e) => setProperty('periodeTil', e.target.value)}/>
              </HStack>
            }
            {options?.showMonths &&
              <>
                <TextField label="Antall måneder" hideLabel={true} value={field?.antallMaaneder} onChange={(e) => setProperty('antallMaaneder', e.target.value)}/>
              </>
            }
           </VStack>
        </HGrid>
      }
    </VStack>
  )
}

