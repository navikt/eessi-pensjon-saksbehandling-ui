import { useState } from 'react'
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
  const { isDisabled, _theme, innerProps } = props

  const visibility = isDisabled ? 'hidden' : 'visible'
  return (
    <FlexDiv
      {...innerProps}
      style={{}}
      data-test-id='c-multipleselect-multiplevalueremove'
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}

    >
      <FilledRemoveCircle
        style={{ visibility: visibility }}
        color={
        _theme[hover ? 'main-interactive-color' : 'main-font-color']
      }
      />
    </FlexDiv>

  )
}
export default MultipleValueRemove
