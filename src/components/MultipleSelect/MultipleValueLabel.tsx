import { BodyLong } from '@navikt/ds-react'
import { components } from 'react-select'

const MultipleValueLabel = (props: any) => (
  <components.MultiValueLabel {...props}>
    <div data-testid='c-multipleselect-multivaluelabel'>
      <BodyLong>{props.data.label}</BodyLong>
    </div>
  </components.MultiValueLabel>
)

export default MultipleValueLabel
