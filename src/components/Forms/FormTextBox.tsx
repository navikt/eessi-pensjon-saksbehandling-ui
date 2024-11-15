import React from "react";
import ErrorLabel from 'src/components/Forms/ErrorLabel'
import {Box} from "@navikt/ds-react";


export interface FormTextProps {
  error: string | undefined
  id: string
  children: any
}

const FormTextBox: React.FC<FormTextProps> = ({
  children,
  error,
  id
}: FormTextProps) => (
  <Box tabIndex={0} id={id} padding="1">
    {children}
    <ErrorLabel error={error} />
  </Box>
)

export default FormTextBox
