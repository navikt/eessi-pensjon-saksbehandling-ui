import React, { useState } from 'react'
import FilledRemoveCircle from 'assets/icons/filled-version-remove-circle'
import styled from 'styled-components'

const FlexDiv = styled.div`
  display: flex;
  cursor: pointer;
  &:hover {
    background-color: transparent !important;
  }
`
const MultipleValueRemove = (props: any) => {
  const [hover, setHover] = useState<boolean>(false)
  const {selectProps, innerProps} = props
  return (
    <FlexDiv
      {...innerProps}
      style={{}}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      >
      <FilledRemoveCircle color={
        selectProps.selectProps.theme[hover ? 'main-interactive-color' : 'main-font-color']
      }
      />
    </FlexDiv>

  )
}
export default MultipleValueRemove
