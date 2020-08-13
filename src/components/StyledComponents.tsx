import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import Modal from 'components/Modal/Modal'
import Knapp, { Flatknapp, Hovedknapp } from 'nav-frontend-knapper'
import Lenke from 'nav-frontend-lenker'
import Panel from 'nav-frontend-paneler'
import { Input, Textarea } from 'nav-frontend-skjema'
import { LenkepanelBase } from 'nav-frontend-lenkepanel'
import { themeKeys } from 'nav-styled-component-theme'
import Tabs from 'nav-frontend-tabs'
import styled from 'styled-components'

export const Row = styled.div`
  display: flex;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`
export const Column = styled.div`
  flex: 1;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`
export const VerticalSeparatorDiv = styled.div`
  margin-bottom: ${(props: any) => props['data-size'] || 1}rem;
`
export const HorizontalSeparatorDiv = styled.div`
  display: inline-block;
  margin-left: ${(props: any) => props['data-size'] || 1}rem;
`
export const HighContrastKnapp = styled(Knapp)`
  background-color: ${({ theme }) => theme.type === 'themeHighContrast' ? theme.black : 'inherit'};
  color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
  border-color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
    color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
  }
`
export const HighContrastHovedknapp = styled(Hovedknapp)`
  background-color: ${({ theme }) => theme.type === 'themeHighContrast' ? theme.black : 'inherit'};
  color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
  border-color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
    border-color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
    color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
  }
  &:disabled {
    background-color: ${({ theme }) => theme[themeKeys.MAIN_DISABLED_COLOR]};
  }
`
export const HighContrastFlatknapp = styled(Flatknapp)`
  color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
  background-color: transparent;
  &:hover:not(:disabled) {
    color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
    border-color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
  }
   &:disabled {
    background-color: ${({ theme }) => theme[themeKeys.MAIN_DISABLED_COLOR]};
    color: ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]};
    border: none;
  }
`
export const HighContrastPanel = styled(Panel)`
  border-width: ${({ theme }) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
  border-style: solid;
  border-color: ${({ theme }) => theme.type === 'themeHighContrast' ? theme.white : theme.navGra60};
  background-color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
  border-radius: ${({ theme }) => theme[themeKeys.MAIN_BORDER_RADIUS]};
`
export const HighContrastInput = styled(Input)`
  input {
    border-width: ${({ theme }) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
    border-style: solid;
    border-radius: ${({ theme }) => theme[themeKeys.MAIN_BORDER_RADIUS]};
    border-color: ${({ theme }) => theme.type === 'themeHighContrast' ? theme.white : theme.navGra60};
    background-color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
    color:  ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]};
  }
`
export const HighContrastLink = styled(Lenke)`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
  line-height: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
  color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]} !important;
  svg {
    fill: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]} !important;
    stroke: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]} !important;
  }
`
export const HighContrastTabs = styled(Tabs)`
  .nav-frontend-tabs__tab-inner--aktiv {
    color: ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]};
    background: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
    border-width: ${({ theme }) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
    border-style: solid;
    border-color: ${({ theme }) => theme[themeKeys.MAIN_BBORDER_COLOR]};
    border-bottom-width: ${({ theme }) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
    border-bottom-style: solid;
    border-bottom-color: white;
  }
  .nav-frontend-tabs__tab-inner {
    color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
    background: none;
  }
`
export const HighContrastTextArea = styled(Textarea)`
  border-width: ${({ theme }) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
  border-style: solid;
  border-radius: ${({ theme }) => theme[themeKeys.MAIN_BORDER_RADIUS]};
  border-color: ${({ theme }) => theme.type === 'themeHighContrast' ? theme.white : theme.navGra60};
  background-color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
`
export const HighContrastModal = styled(Modal)`
  color: ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]};
  background-color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
`
export const HighContrastExpandingPanel = styled(ExpandingPanel)`
  border-radius: ${({ theme }) => theme[themeKeys.MAIN_BORDER_RADIUS]};
  background-color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
  border-width: ${({ theme }) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
  border-style: solid;
  border-color: ${({ theme }) => theme.type === 'themeHighContrast' ? 'white' : theme.navGra60};
  .ekspanderbartPanel__knapp {
    background: none;
    border: none;
  }
  &.ekspanderbartPanel {
    background-color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
  }
  .ekspanderbartPanel__hode {
    background-color:  ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
    &:hover {
      background-color: ${({ theme }) => theme.type === 'themeHighContrast' ? theme.navOransjeDarken80 : theme.navLysBlaLighten80} !important;
    }
  }
  .ekspanderbartPanel__indikator {
    color:  ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]};
  }
  p {
    font-size: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
    line-height: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
  }
`
export const HighContrastLenkepanelBase = styled(LenkepanelBase)`
  border-color: ${({ theme }) => theme.type === 'themeHighContrast' ? theme.white : theme.navGra60};
  border-style: solid;
  border-radius: ${({ theme }) => theme[themeKeys.MAIN_BORDER_RADIUS]};
  border-width: ${({ theme }) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
  background-color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
  color: ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]};
  span, strong, p {
    font-size: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
    line-height: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
  }
  &:hover .lenkepanel__heading {
    color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
  }
`
