import React from "react";
import {Box, Checkbox, HStack, TextField} from "@navikt/ds-react";
import CountryDropdown from "src/components/CountryDropdown/CountryDropdown";
import {Country} from "@navikt/land-verktoy";
import styled from "styled-components";

export const CountryDiv = styled.div`
  min-width: 200px;
`

export interface InntektFoerUfoerhetIUtlandetProps{
  label: string
  value: string

}

export const InntektFoerUfoerhetIUtlandet: React.FC<InntektFoerUfoerhetIUtlandetProps> = ({
  label, value
}: InntektFoerUfoerhetIUtlandetProps): JSX.Element => {
  return (
    <Box>
    <HStack gap="4">
      <Checkbox value={value}>{label}</Checkbox>
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

