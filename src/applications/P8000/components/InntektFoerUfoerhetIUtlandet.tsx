import React from "react";
import {Box, HStack, TextField} from "@navikt/ds-react";
import CountryDropdown from "src/components/CountryDropdown/CountryDropdown";
import {Country} from "@navikt/land-verktoy";
import styled from "styled-components";
import {CheckBoxField} from "src/applications/P8000/components/CheckboxField";
import {P8000FieldComponentProps} from "src/applications/P8000/P8000";

export const CountryDiv = styled.div`
  min-width: 200px;
`

export const InntektFoerUfoerhetIUtlandet: React.FC<P8000FieldComponentProps> = ({
  label, value, PSED, updatePSED, namespace, target
}: P8000FieldComponentProps): JSX.Element => {
  return (
    <Box>
    <HStack gap="4">
      <CheckBoxField
        label={label}
        value={value}
        PSED={PSED}
        updatePSED={updatePSED}
        namespace={namespace}
        target={target}
      />
      <CountryDiv>
        <CountryDropdown
          error={undefined}
          id="land"
          countryCodeListName="euEftaLand"
          label="Land"
          hideLabel={true}
          onOptionSelected={(v: Country) => {console.log(v)}}
          values=""
        />
      </CountryDiv>
      <TextField label="Fra" hideLabel={true}/>
      <TextField label="Til" hideLabel={true}/>
    </HStack>
    </Box>
  )
}

