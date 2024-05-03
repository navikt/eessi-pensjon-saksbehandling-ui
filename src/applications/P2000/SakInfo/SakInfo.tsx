import React from "react";
import {Box, Detail, Heading, HStack, VStack} from "@navikt/ds-react";
import {VerticalSeparatorDiv} from "@navikt/hoykontrast";
import _ from "lodash";

export interface SakInfoProps<T> {
  PSED: T | null | undefined
}

const SakInfo: React.FC<SakInfoProps<any>> = ({
  PSED,
}: SakInfoProps<any>): JSX.Element => {
  const target = 'nav.eessisak'
  const eessiSak:  Array<any> = _.get(PSED, target)
  return (
    <Box
      as="header"
      borderWidth="1"
      borderRadius="medium"
      borderColor="border-default"
      background="bg-default"
      padding="4"
    >
      <HStack gap="16" align="center">
        <VStack>
          <Heading level="1" size="medium">P2000</Heading>
          {eessiSak?.map(() => {
            return(
              <>
                <Detail>&nbsp;</Detail>
                <Detail>&nbsp;</Detail>
                <VerticalSeparatorDiv/>
              </>
            )
          })}
        </VStack>
        <VStack>
          <Heading size="xsmall">Lokale saksnumre</Heading>
          {eessiSak?.map((sak) => {
            return(
              <>
                <Detail>Land: {sak.land}</Detail>
                <Detail>Saksnummer: {sak.saksnummer}</Detail>
                <VerticalSeparatorDiv/>
              </>
            )
          })}
        </VStack>
        <VStack>
          <Heading size="xsmall">Institusjon</Heading>
          {eessiSak?.map((sak) => {
            return(
              <>
                <Detail>Institusjonens ID: {sak.institusjonsid}</Detail>
                <Detail>Institusjonens navn: {sak.institusjonsnavn}</Detail>
                <VerticalSeparatorDiv/>
              </>
            )
          })}
        </VStack>
      </HStack>
    </Box>
  )
}

export default SakInfo
