import React from "react";
import { PileDiv } from '@navikt/hoykontrast'
import ErrorLabel from 'src/components/Forms/ErrorLabel'


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
  <PileDiv tabIndex={0} id={id}>
    {children}
    <ErrorLabel error={error} />
  </PileDiv>
)

export default FormText
