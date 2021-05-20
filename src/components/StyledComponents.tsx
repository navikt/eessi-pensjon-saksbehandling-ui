import styled from 'styled-components'
import {
  themeKeys
} from 'nav-hoykontrast'
import TableSorter from 'tabell'

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
export const SpinnerDiv = styled.div`
  position: absolute;
  top: 3rem;
  left: 0;
  right: 0;
`
