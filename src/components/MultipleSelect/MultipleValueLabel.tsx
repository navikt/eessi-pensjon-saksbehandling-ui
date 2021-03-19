import { components } from 'react-select'
import styled from 'styled-components'

const Label = styled.div`
  padding: 0px;
`
const FlexDiv = styled.div`
  display: flex;
  align-items: center;
`
const MultipleValueLabel = (props: any) => (
  <components.MultiValueLabel data-test-id='c-multipleselect-multivaluelabel' {...props}>
    <FlexDiv>
      <Label>&nbsp;&nbsp;&nbsp;&nbsp;{props.data.label}&nbsp;&nbsp;&nbsp;&nbsp;</Label>
    </FlexDiv>
  </components.MultiValueLabel>
)

export default MultipleValueLabel
