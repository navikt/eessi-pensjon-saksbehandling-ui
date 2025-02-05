import React from "react";
import {Box, HStack, TextField} from "@navikt/ds-react";
import CountryDropdown from "src/components/CountryDropdown/CountryDropdown";
import {Country} from "@navikt/land-verktoy";
import styled from "styled-components";
import {PSED} from "src/declarations/app";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "src/declarations/types";
import {CheckBoxField} from "src/applications/P8000/components/CheckboxField";

export const CountryDiv = styled.div`
  min-width: 200px;
`

export interface InntektFoerUfoerhetIUtlandetProps{
  label: string
  value: string
  PSED: PSED | null | undefined
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
  namespace: string
  target: string
}

export const InntektFoerUfoerhetIUtlandet: React.FC<InntektFoerUfoerhetIUtlandetProps> = ({
  label, value, PSED, updatePSED, namespace, target
}: InntektFoerUfoerhetIUtlandetProps): JSX.Element => {
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

