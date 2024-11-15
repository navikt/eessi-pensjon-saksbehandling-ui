import React from "react";
import { PileDiv } from '@navikt/hoykontrast'
import ErrorLabel from 'src/components/Forms/ErrorLabel'
import {Box} from "@navikt/ds-react";


export interface FormTextProps {
  error: string | undefined
  id: string
  children: any
}

const FormText: React.FC<FormTextProps> = ({
  children,
  error,
  id
}: FormTextProps) => (
  <Box tabIndex={0} id={id} padding="1">
    {children}
    <ErrorLabel error={error} />
  </Box>
)

export default FormText
