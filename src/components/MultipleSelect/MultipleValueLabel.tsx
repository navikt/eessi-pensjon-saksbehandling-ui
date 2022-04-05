import { BodyLong } from '@navikt/ds-react'
import { components } from 'react-select'
import styled from 'styled-components/macro'

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
`
const MultipleValueLabel = (props: any) => (
  <components.MultiValueLabel data-testid='c-multipleselect-multivaluelabel' {...props}>
    <FlexDiv>
      <BodyLong>{props.data.label}</BodyLong>
    </FlexDiv>
  </components.MultiValueLabel>
)

export default MultipleValueLabel
