import SEDListHeader from 'applications/BUC/components/SEDListHeader/SEDListHeader'
import classNames from 'classnames'
import { HighContrastExpandingPanel, HighContrastPanel } from 'components/StyledComponents'
import { Buc, Sed, Seds } from 'declarations/buc'
import _ from 'lodash'
import { theme, themeKeys, themeHighContrast } from 'nav-styled-component-theme'
import React from 'react'
import styled, { keyframes, ThemeProvider } from 'styled-components'
import SEDBody from '../SEDBody/SEDBody'

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

const activeStatus: Array<string> = ['new', 'active']
const sedWithProperties: Array<string> = []

const slideInFromLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`
const SEDPanelPanel = styled(HighContrastPanel)`
  transform: translateX(-20px);
  opacity: 0;
  padding: 0;
  animation: ${slideInFromLeft} 0.2s forwards;
  margin-bottom: 1rem;
  span, p {
    font-size: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
    line-height: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
  }
  &.new > div, &.new > div > div {
    background: ${({theme}) => theme.type === 'themeHighContrast' ? theme[themeKeys.NAVLIMEGRONNDARKEN80] : theme[themeKeys.NAVLIMEGRONNLIGHTEN80]};
  }
`
const PaddedDiv = styled.div`
  padding: 1rem;
  border-radius: ${({ theme }) => theme[themeKeys.MAIN_BORDER_RADIUS]};
  background: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
`
const CustomExpandingPanel = styled(HighContrastExpandingPanel)`
  border: none;
  .ekspanderbartPanel__hode:hover {
    background: ${({ theme }) => theme[themeKeys.MAIN_HOVER_COLOR]} !important;
    .panel {
      background: transparent;
    }
  }
`

const SEDPanel: React.FC<SEDPanelProps> = ({
  aktoerId, buc, className, followUpSeds, highContrast, newSed, onSEDNew, sed, style
}: SEDPanelProps): JSX.Element => {
  const sedCanHaveAttachments = (sed: Sed): boolean => {
    return !buc.readOnly && sed !== undefined && sed.allowsAttachments && _.includes(activeStatus, sed.status)
  }

  const sedCanShowProperties = (sed: Sed): boolean => {
    return _.includes(sedWithProperties, sed.type) || !_.isEmpty(sed.attachments)
  }

  const sedHasOption = (sed: Sed): boolean => {
    return sedCanHaveAttachments(sed) || sedCanShowProperties(sed)
  }

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <SEDPanelPanel className={classNames(className, { new: newSed })}>
        {!sedHasOption(sed) ? (
          <PaddedDiv>
            <SEDListHeader
              followUpSeds={followUpSeds}
              sed={sed}
              style={style}
              buc={buc}
              onSEDNew={onSEDNew}
            />
          </PaddedDiv>
        ) : (
          <CustomExpandingPanel
            style={style}
            highContrast={highContrast}
            heading={
              <SEDListHeader
                followUpSeds={followUpSeds}
                sed={sed}
                buc={buc}
                onSEDNew={onSEDNew}
              />
            }
          >
            <SEDBody
              aktoerId={aktoerId}
              buc={buc}
              highContrast={highContrast}
              sed={sed}
              canHaveAttachments={sedCanHaveAttachments(sed)}
              canShowProperties={sedCanShowProperties(sed)}
            />
          </CustomExpandingPanel>
        )}
      </SEDPanelPanel>
    </ThemeProvider>
  )
}

export default SEDPanel
