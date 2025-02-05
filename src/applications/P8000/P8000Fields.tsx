import React from "react";
import {PSED} from "src/declarations/app";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "src/declarations/types";
import _ from "lodash";

export interface P8000FieldsProps {
  fields: Array<Field>
  variant: Array<string>
  PSED: PSED | null | undefined
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
  namespace: string
  target: string
}

export interface Field {
  component: any
  label: string,
  value: string
}

export const P8000Fields: React.FC<P8000FieldsProps> = ({
  fields,
  variant,
  PSED,
  updatePSED,
  namespace,
  target
}: P8000FieldsProps): JSX.Element => {

  const getField = (type: string): JSX.Element | null => {
    let field: Field | undefined = _.find(fields, o => o.value === type)
    if (field) {
      const Component = field.component
      return (
        <Component
          value={field.value}
          label={field.label}
          target={target}
          parentNamespace={namespace}
          PSED={PSED}
          updatePSED={updatePSED}
        />
      )
    }
    return null
  }

  return (
    <>
      {variant.map((v) => getField(v))}
    </>
  )
}
