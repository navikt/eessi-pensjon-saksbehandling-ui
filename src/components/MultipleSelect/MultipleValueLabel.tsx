import React from 'react'
import { components } from 'react-select'
import styled from 'styled-components'

const Label = styled.div`
  padding: 0px;
`
const MultipleValueLabel = (props: any) => (
  <components.MultiValueLabel>
    <Label>&nbsp;&nbsp;&nbsp;&nbsp;{props.data.label}&nbsp;&nbsp;&nbsp;&nbsp;</Label>
  </components.MultiValueLabel>
)

export default MultipleValueLabel
