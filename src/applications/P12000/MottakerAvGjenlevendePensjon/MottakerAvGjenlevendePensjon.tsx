import {Box, Heading, VStack} from "@navikt/ds-react";
import React, {JSX} from "react";
import {MainFormProps} from 'src/applications/MainForm'

const MottakerAvGjenlevendePensjon: React.FC<MainFormProps> = ({
  label
}: MainFormProps): JSX.Element => {
  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='medium'>
          {label}
        </Heading>
      </VStack>
    </Box>
  );
}

export default MottakerAvGjenlevendePensjon
