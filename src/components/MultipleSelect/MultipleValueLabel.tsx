import { BodyLong } from '@navikt/ds-react'
import { components } from 'react-select'
import styled from 'styled-components'

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
`
const MultipleValueLabel = (props: any) => (
  <components.MultiValueLabel {...props}>
    <FlexDiv data-testid='c-multipleselect-multivaluelabel'>
      <BodyLong>{props.data.label}</BodyLong>
    </FlexDiv>
  </components.MultiValueLabel>
)

export default MultipleValueLabel
