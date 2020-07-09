import Knapp from 'nav-frontend-knapper'
import Panel from 'nav-frontend-paneler'
import styled from 'styled-components'

export const VerticalSeparatorDiv = styled.div`
  margin-bottom: ${(props: any) => props['data-size'] || 1}rem;
`
export const HorizontalSeparatorDiv = styled.div`
  display: inline-block;
  margin-left: ${(props: any) => props['data-size'] || 1}rem;
`
export const HighContrastKnapp = styled(Knapp)`
  background-color: ${({ theme }: any) => theme.type === 'themeHighContrast' ? theme.black : 'inherit'};
  color: ${({ theme }: any) => theme['main-interactive-color']};
  border-color: ${({ theme }: any) => theme['main-interactive-color']};
  &:hover {
    background-color: ${({ theme }: any) =>theme['main-interactive-color']};
  }
`

export const HighContrastPanel = styled(Panel)`
  border-width: ${({ theme }: any) => theme.type === 'themeHighContrast' ? '2px': '1px'};
  border-style: solid;
  border-color: ${({ theme }: any) => theme.type === 'themeHighContrast' ? theme.white : theme.navGra60};
  background-color: ${({ theme }: any) => theme['main-background-color']};
`
