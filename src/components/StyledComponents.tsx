import styled from 'styled-components'
import {
  themeKeys
} from 'nav-hoykontrast'
import TableSorter from 'tabell'

export const FlexDiv = styled.div`
  display: flex;
  flex-direction: row;
`
export const PileDiv = styled.div`
  display: flex;
  flex-direction: column;
`
export const PileCenterDiv = styled(PileDiv)`
 justify-content: center;
`
export const FlexStartDiv = styled(FlexDiv)`
 align-items: flex-start;
`
export const FlexBaseDiv = styled(FlexDiv)`
  align-items: baseline;
  justify-content: space-between;
`
export const FlexCenterDiv = styled(FlexDiv)`
  align-items: center;
  justify-content: space-between;
`
export const FlexEndDiv = styled(FlexDiv)`
 align-items: flex-end;
 flex-wrap: wrap;
 justify-content: space-between;
`
export const FullWidthDiv = styled.div`
  width: 100%;
`
export const HiddenDiv = styled.div`
  display: none;
`
export const Etikett = styled.div`
  padding: 0.25rem;
  color:  ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]} !important;
  background-color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
  border: ${(props: any) => props['data-border'] === true ? '1px solid ' + props.theme[themeKeys.MAIN_BORDER_COLOR] : 'none'};
  border-radius: 5px;
  display: inline-block;
`
export const OneLineSpan = styled.span`
  white-space: nowrap;
`
export const SeparatorSpan = styled.span`
  margin-left: 0.25rem;
  margin-right: 0.25rem;
`
export const PrintableTableSorter = styled(TableSorter)`
  width: 100%;
  margin-top: 0.5rem;
  @media print {
    @page {
      size: A4 landscape;
    }
    td {
      padding: 0.5rem;
    }
  }
`
export const SEDP5000Header = styled(FlexCenterDiv)``
