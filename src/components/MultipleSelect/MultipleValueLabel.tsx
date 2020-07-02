import React from 'react'
import { components } from 'react-select'
import { MultiValueGenericProps } from 'react-select/src/components/MultiValue'
import styled from 'styled-components'

const MultiValueDiv = styled.div`
`
const Label = styled.div`
  padding: 0px;
`

const MultipleValueLabel = (props: MultiValueGenericProps<any>) => {
  return (
    <MultiValueDiv>
      <components.MultiValueLabel {...props} className='multipleValueLabel'>
        <Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{props.data.label}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Label>
      </components.MultiValueLabel>
    </MultiValueDiv>
  )
}

export default MultipleValueLabel
