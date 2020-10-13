import { slideInFromLeft } from 'components/keyframes'
import React from 'react'
import SEDHeader from 'applications/BUC/components/SEDHeader/SEDHeader'
import classNames from 'classnames'
import { HighContrastExpandingPanel, HighContrastPanel } from 'components/StyledComponents'
import { Buc, Sed, Seds } from 'declarations/buc'
import _ from 'lodash'
import { theme, themeKeys, themeHighContrast } from 'nav-styled-component-theme'
import styled, { ThemeProvider } from 'styled-components'
import SEDBody from '../SEDBody/SEDBody'

const activeStatus: Array<string> = ['new', 'active']

export const SEDPanelContainer = styled(HighContrastPanel)`
  transform: translateX(-20px);
  opacity: 0;
  padding: 0;
  animation: ${slideInFromLeft} 0.2s forwards;
  margin-bottom: 1rem;
  span, p {
    font-size: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
    line-height: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
  }
  &.new .ekspanderbartPanel__hode,
  &.new .ekspanderbartPanel__hode div:not(.etikett) {
    background: ${({ theme }) => theme.type === 'themeHighContrast'
  ? theme[themeKeys.NAVLIMEGRONNDARKEN80] : theme[themeKeys.NAVLIMEGRONNLIGHTEN80]};
  }
  &.new .ekspanderbartPanel__hode:hover div:not(.etikett) {
    background: ${({ theme }) => theme[themeKeys.MAIN_HOVER_COLOR]} !important;
  }
`
export const SEDPanelDiv = styled.div`
  padding: 1rem;
  border-radius: ${({ theme }) => theme[themeKeys.MAIN_BORDER_RADIUS]};
  background: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
`
export const SEDPanelExpandingPanel = styled(HighContrastExpandingPanel)`
  border: none;
  .ekspanderbartPanel__hode:hover {
    background: ${({ theme }) => theme[themeKeys.MAIN_HOVER_COLOR]} !important;
    .panel {
      background: transparent;
    }
  }
`

export interface SEDPanelProps {
  aktoerId: string
  buc: Buc
  className ?: string
  followUpSeds: Seds
  highContrast: boolean
  newSed: boolean
  onSEDNew: (buc: Buc, sed: Sed) => void
  sed: Sed
  style: React.CSSProperties
}

const SEDPanel: React.FC<SEDPanelProps> = ({
  aktoerId, buc, className, followUpSeds, highContrast, newSed, onSEDNew, sed, style
}: SEDPanelProps): JSX.Element => {
  const sedCanHaveAttachments = (sed: Sed): boolean => {
    return !buc.readOnly && sed !== undefined && sed.allowsAttachments && _.includes(activeStatus, sed.status)
  }

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <SEDPanelContainer className={classNames(className, { new: newSed })}>
        {!sedCanHaveAttachments(sed) ? (
          <SEDPanelDiv>
            <SEDHeader
              buc={buc}
              followUpSeds={followUpSeds}
              onSEDNew={onSEDNew}
              sed={sed}
              style={style}
            />
          </SEDPanelDiv>
        ) : (
          <SEDPanelExpandingPanel
            style={style}
            highContrast={highContrast}
            heading={
              <SEDHeader
                buc={buc}
                followUpSeds={followUpSeds}
                onSEDNew={onSEDNew}
                sed={sed}
              />
            }
          >
            <SEDBody
              aktoerId={aktoerId}
              buc={buc}
              canHaveAttachments={sedCanHaveAttachments(sed)}
              highContrast={highContrast}
              sed={sed}
            />
          </SEDPanelExpandingPanel>
        )}
      </SEDPanelContainer>
    </ThemeProvider>
  )
}

export default SEDPanel
