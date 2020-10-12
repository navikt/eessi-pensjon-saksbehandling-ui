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
  const { selectProps, innerProps } = props
  const theme = selectProps.selectProps.theme

  return (
    <FlexDiv
      {...innerProps}
      style={{}}
      data-test-id='c-multipleselect-multiplevalueremove'
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <FilledRemoveCircle color={
        theme[hover ? 'main-interactive-color' : 'main-font-color']
      }
      />
    </FlexDiv>

  )
}
export default MultipleValueRemove
