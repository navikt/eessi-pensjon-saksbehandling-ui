import styled from 'styled-components'

export const VerticalSeparatorDiv = styled.div`
  margin-bottom: ${(props: any) => props['data-size'] || 1}rem;
`
export const HorizontalSeparatorDiv = styled.div`
  margin-left: ${(props: any) => props['data-size'] || 1}rem;
`
