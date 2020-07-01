import React from 'react'
import { components } from 'react-select'
import { MultiValueGenericProps } from 'react-select/src/components/MultiValue'
import styled from 'styled-components'

const MultiValueDiv = styled.div`
.multipleValueLabel {
  border-radius: 20px;
  border: 1px solid @navMorkGra;
  padding: 0.25rem;
}
`
const Label = styled.div`
  padding: 0px;
`
/*
&:focus {
    outline: 0;
    box-shadow: 0 0 0 3px #254b6d;
  }

&:hover .multipleSelect__multi-value__remove {
    display: flex;
  }
.multipleSelect__multi-value__remove {
    display: none;
  }
}

.multipleSelect__multi-value__remove {
  border-radius: 20px;
  border: 1px solid @navMorkGra;
  margin-left: 0.25rem;
}*/

const MultipleValueLabel = (props: MultiValueGenericProps<any>) => (
  <MultiValueDiv>
    <components.MultiValueLabel {...props} className='multipleValueLabel'>
      <Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{props.data.label}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Label>
    </components.MultiValueLabel>
  </MultiValueDiv>
)

export default MultipleValueLabel
