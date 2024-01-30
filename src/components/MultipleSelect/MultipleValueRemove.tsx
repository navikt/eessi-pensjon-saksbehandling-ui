import { XMarkOctagonFillIcon } from '@navikt/aksel-icons'
import styled from 'styled-components/macro'

const FlexDiv = styled.div`
  display: flex;
  cursor: pointer;
  &:hover {
    background-color: transparent !important;
  }
`
const MultipleValueRemove = (props: any) => {
  const { isDisabled, innerProps } = props

  const visibility = isDisabled ? 'hidden' : 'visible'
  return (
    <FlexDiv
      {...innerProps}
      style={{}}
      data-testid='c-multipleselect-multiplevalueremove'
    >
      <XMarkOctagonFillIcon fontSize="1.5rem" style={{ visibility }} />
    </FlexDiv>

  )
}
export default MultipleValueRemove
