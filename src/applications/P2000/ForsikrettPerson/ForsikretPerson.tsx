import {Heading} from "@navikt/ds-react";
import {VerticalSeparatorDiv, PaddedDiv} from "@navikt/hoykontrast";
import React from "react";
import {MainFormProps} from "../MainForm";


const ForsikretPerson: React.FC<MainFormProps> = ({
  label
}: MainFormProps): JSX.Element => {
  return (
    <>
      <PaddedDiv>
        <Heading size='medium'>
          {label}
        </Heading>
        <VerticalSeparatorDiv/>
      </PaddedDiv>
    </>
  )
}

export default ForsikretPerson
