import {Box, Heading, Tabs} from "@navikt/ds-react";
import React, {JSX} from "react";
import {MainFormProps} from "src/applications/MainForm";

const InformasjonOmPensjon: React.FC<MainFormProps> = ({label}: MainFormProps): JSX.Element => (
  <Box padding="space-16">
    <Heading size="medium">{label}</Heading>
    <Tabs defaultValue="innvilgelseavpensjon">
      <Tabs.List>
        <Tabs.Tab label="Innvilgelse av pensjon (Betalingsdetaljer)" value="innvilgelseavpensjon"/>
        <Tabs.Tab label="Avslag på pensjon" value="avslagpensjon"/>
        <Tabs.Tab label="Opphør av pensjon" value="opphoravpensjon"/>
      </Tabs.List>
      <Tabs.Panel value="innvilgelseavpensjon">{null}</Tabs.Panel>
      <Tabs.Panel value="avslagpensjon">{null}</Tabs.Panel>
      <Tabs.Panel value="opphoravpensjon">{null}</Tabs.Panel>
    </Tabs>
  </Box>
)

export default InformasjonOmPensjon
