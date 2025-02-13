import React from "react";
import {HGrid, TextField} from "@navikt/ds-react";
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

  const setProperty = (property: string, propValue: string) => {
    dispatch(updatePSED(`${target}.${value}.${property}`, propValue))
  }

  return (
    <HGrid columns={4} gap="4">
      <CheckBoxField
        label={label}
        value={value}
        PSED={PSED}
        updatePSED={updatePSED}
        namespace={namespace}
        target={target}
      />
      {!options?.hideCountry &&
        <CountryDiv>
          <CountryDropdown
            error={undefined}
            id="land"
            countryCodeListName="euEftaLand"
            label="Land"
            hideLabel={true}
            onOptionSelected={(c: Country) => {setProperty('landkode', c.value)}}
            values={field?.landkode  ?? ''}
          />
        </CountryDiv>
      }
      {!options?.hidePeriod &&
        <>
          <TextField label="Fra" hideLabel={true} value={field?.periodeFra} onChange={(e) => setProperty('periodeFra', e.target.value)}/>
          <TextField label="Til" hideLabel={true} value={field?.periodeTil} onChange={(e) => setProperty('periodeTil', e.target.value)}/>
        </>
      }
    </HGrid>
  )
}

