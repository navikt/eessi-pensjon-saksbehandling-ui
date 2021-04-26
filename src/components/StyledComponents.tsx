import styled from 'styled-components'
import {
  themeKeys
} from 'nav-hoykontrast'

export const FlexDiv = styled.div`
  display: flex;
  flex-direction: row;
`
export const PileDiv = styled.div`
  display: flex;
  flex-direction: column;
`
export const FlexBaseDiv = styled(FlexDiv)`
  align-items: baseline;
  justify-content: space-between;
`
export const FlexCenterDiv = styled(FlexDiv)`
  align-items: center;
  justify-content: space-between;
`
export const Etikett = styled.div`
  padding: 0.25rem;
  color:  ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]} !important;
  background-color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
  border: ${(props: any) => props['data-border'] === true ? '1px solid ' + props.theme[themeKeys.MAIN_BORDER_COLOR] : 'none'};
  border-radius: 5px;
  display: inline-block;
  width: 100%;
`
