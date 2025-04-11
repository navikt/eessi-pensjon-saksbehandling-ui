import React from "react";
import ErrorLabel from 'src/components/Forms/ErrorLabel'
import {Box, Label} from "@navikt/ds-react";
import {ResponsiveProp} from "@navikt/ds-react/cjs/layout/utilities/types";


export interface FormTextProps {
  error: string | undefined
  id: string
  label?: string
  children: any
  padding?: ResponsiveProp<any>
}

const FormTextBox: React.FC<FormTextProps> = ({
  children,
  error,
  id,
  label,
  padding = "1"
}: FormTextProps) => (
  <Box tabIndex={0} id={id} padding={padding}>
    {label &&
      <Label>{label}</Label>
    }
    {children}
    <ErrorLabel error={error} />
  </Box>
)

export default FormTextBox
