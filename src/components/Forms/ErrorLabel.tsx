import React, {JSX} from "react";
import { Label } from '@navikt/ds-react'

export interface ErrorLabelProps {
  error: string | undefined
}

const ErrorLabel:React.FC<ErrorLabelProps> = ({
  error
}: ErrorLabelProps): JSX.Element | null => {
  if (!error) {
    return null
  }

  return (
    <Label role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium'>
      {error}
    </Label>
  )
}

export default ErrorLabel
