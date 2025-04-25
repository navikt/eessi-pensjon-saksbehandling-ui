import React from "react";
import {PSED} from "src/declarations/app";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "src/declarations/types";
import _ from "lodash";
import {Box, VStack} from "@navikt/ds-react";

export interface P8000FieldsProps {
  PSED: PSED | null | undefined
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
  namespace: string
  fields: Array<Field>
  variant: Array<string>
}

export interface Field {
  component: any
  label: string,
  value: string
  target?: string
  options?: any
}

export const P8000Fields: React.FC<P8000FieldsProps> = ({
  fields,
  variant,
  PSED,
  updatePSED,
  namespace,
}: P8000FieldsProps): JSX.Element => {

  const getField = (type: string): JSX.Element | null => {
    let field: Field | undefined = _.find(fields, o => o.value === type)
    if (field) {
      const Component = field.component
      return (
        <React.Fragment key={field.value}>
          <Component
            value={field.value}
            label={field.label}
            target={field.target}
            options={field.options}
            namespace={namespace}
            PSED={PSED}
            updatePSED={updatePSED}
          />
        </React.Fragment>
      )
    }
    return null
  }

  return (
    <Box>
      <VStack>
        {variant?.map((v) => getField(v))}
      </VStack>
    </Box>
  )
}
