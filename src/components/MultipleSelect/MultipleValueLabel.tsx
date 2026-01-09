import { BodyLong } from '@navikt/ds-react'
import { components } from 'react-select'

const MultipleValueLabel = (props: any) => {
  const MultiValueLabel = components.MultiValueLabel as any
  return (
    <MultiValueLabel {...props}>
      <div data-testid='c-multipleselect-multivaluelabel'>
        <BodyLong>{props.data.label}</BodyLong>
      </div>
    </MultiValueLabel>
  )
}

export default MultipleValueLabel
