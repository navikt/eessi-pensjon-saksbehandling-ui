import React, {JSX} from "react";
import {Box, Detail, Heading, HStack, VStack} from "@navikt/ds-react";
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
      borderRadius="4"
      borderColor="neutral"
      background="default"
      padding="space-16"
    >
      <HStack gap="space-64" align="center">
        <VStack gap="space-8">
          <Heading level="1" size="medium">P2000</Heading>
          {eessiSak?.map((s, index) => {
            return(
              <div key={s.sakId + "-" + index}>
                <Detail>&nbsp;</Detail>
                <Detail>&nbsp;</Detail>
              </div>
            )
          })}
        </VStack>
        <VStack gap="space-8">
          <Heading size="xsmall">Lokale saksnumre</Heading>
          {eessiSak?.map((sak, index) => {
            return(
              <div key={"lokal-" + index}>
                <Detail>Land: {sak.land}</Detail>
                <Detail>Saksnummer: {sak.saksnummer}</Detail>
              </div>
            )
          })}
        </VStack>
        <VStack gap="space-8">
          <Heading size="xsmall">Institusjon</Heading>
          {eessiSak?.map((sak, index) => {
            return(
              <div key={"institusjon-" + index}>
                <Detail>Institusjonens ID: {sak.institusjonsid}</Detail>
                <Detail>Institusjonens navn: {sak.institusjonsnavn}</Detail>
              </div>
            )
          })}
        </VStack>
      </HStack>
    </Box>
  );
}

export default SakInfo
