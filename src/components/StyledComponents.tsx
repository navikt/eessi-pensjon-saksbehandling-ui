import styled from 'styled-components'

export const HorizontalSeparatorSpan = styled.span<{size?: string}>`
  display: inline-block;
  margin-left: ${(props: any) => props.size || 1}rem;
`






