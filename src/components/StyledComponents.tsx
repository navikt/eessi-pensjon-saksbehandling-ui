import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import Modal from 'components/Modal/Modal'
import Knapp, { Flatknapp, Hovedknapp } from 'nav-frontend-knapper'
import Lenke from 'nav-frontend-lenker'
import Panel from 'nav-frontend-paneler'
import { Input, Textarea } from 'nav-frontend-skjema'
import { LenkepanelBase } from 'nav-frontend-lenkepanel'
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
  &:hover:not(:disabled) {
    background-color: ${({ theme }: any) => theme['main-interactive-color']};
    color: ${({ theme }: any) => theme['main-background-color']};
  }
`
export const HighContrastHovedknapp = styled(Hovedknapp)`
  background-color: ${({ theme }: any) => theme.type === 'themeHighContrast' ? theme.black : 'inherit'};
  color: ${({ theme }: any) => theme['main-interactive-color']};
  border-color: ${({ theme }: any) => theme['main-interactive-color']};
  &:hover:not(:disabled) {
    background-color: ${({ theme }: any) => theme['main-interactive-color']};
    border-color: ${({ theme }: any) => theme['main-interactive-color']};
    color: ${({ theme }: any) => theme['main-background-color']};
  }
  &:disabled {
    background-color: ${({ theme }: any) => theme['main-disabled-color']};
  }
`
export const HighContrastFlatknapp = styled(Flatknapp)`
  color: ${({ theme }: any) => theme['main-interactive-color']};
  background-color: transparent;
  &:hover:not(:disabled) {
    color: ${({ theme }: any) => theme['main-interactive-color']};
    border-color: ${({ theme }: any) => theme['main-interactive-color']};
  }
`
export const HighContrastPanel = styled(Panel)`
  border-width: ${({ theme }: any) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
  border-style: solid;
  border-color: ${({ theme }: any) => theme.type === 'themeHighContrast' ? theme.white : theme.navGra60};
  background-color: ${({ theme }: any) => theme['main-background-color']};
  border-radius: 4px;
`
export const HighContrastInput = styled(Input)`
  input {
    border-width: ${({ theme }: any) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
    border-style: solid;
    border-radius: 4px;
    border-color: ${({ theme }: any) => theme.type === 'themeHighContrast' ? theme.white : theme.navGra60};
    background-color: ${({ theme }: any) => theme['main-background-color']};
  }
`
export const HighContrastLink = styled(Lenke)`
  display: flex;
  align-items: center;
  font-size: ${({ theme }: any) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
  line-height: ${({ theme }: any) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
  color: ${({ theme }: any) => theme['main-interactive-color']} !important;
  svg {
    fill: ${({ theme }: any) => theme['main-interactive-color']} !important;
    stroke: ${({ theme }: any) => theme['main-interactive-color']} !important;
  }
`
export const HighContrastTextArea = styled(Textarea)`
  border-width: ${({ theme }: any) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
  border-style: solid;
  border-radius: 4px;
  border-color: ${({ theme }: any) => theme.type === 'themeHighContrast' ? theme.white : theme.navGra60};
  background-color: ${({ theme }: any) => theme['main-background-color']};
`
export const HighContrastModal = styled(Modal)`
  color: ${({ theme }: any) => theme['main-font-color']};
  background-color: ${({ theme }: any) => theme['main-background-color']};
`
export const HighContrastExpandingPanel = styled(ExpandingPanel)`
  border-radius: 4px;
  background-color: ${({ theme }: any) => theme['main-background-color']};
  border-width: ${({ theme }: any) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
  border-style: solid;
  border-color: ${({ theme }: any) => theme.type === 'themeHighContrast' ? 'white' : theme.navGra60};
  .ekspanderbartPanel__knapp {
    background: none;
    border: none;
  }
  &.ekspanderbartPanel {
    background-color: ${({ theme }: any) => theme['main-background-color']};
  }
  .ekspanderbartPanel__hode {
    background-color:  ${({ theme }: any) => theme['main-background-color']};
  }
  .ekspanderbartPanel__indikator {
    color:  ${({ theme }: any) => theme['main-font-color']};
  }
  p {
    font-size: ${({ theme }: any) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
    line-height: ${({ theme }: any) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
  }
`
export const HighContrastLenkepanelBase = styled(LenkepanelBase)`
  border-color: ${({ theme }: any) => theme.type === 'themeHighContrast' ? theme.white : theme.navGra60};
  border-style: solid;
  border-radius: 4px;
  border-width: ${({ theme }: any) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
  background-color: ${({ theme }: any) => theme['main-background-color']};
  color: ${({ theme }: any) => theme['main-font-color']};
  span, strong, p {
    font-size: ${({ theme }: any) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
    line-height: ${({ theme }: any) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
  }
  &:hover .lenkepanel__heading {
    color: ${({ theme }: any) => theme['main-interactive-color']};
  }
`
