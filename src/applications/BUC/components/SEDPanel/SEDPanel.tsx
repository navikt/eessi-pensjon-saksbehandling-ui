import SEDListHeader from 'applications/BUC/components/SEDListHeader/SEDListHeader'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import { Buc, Sed, Seds } from 'declarations/buc'
import _ from 'lodash'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import React from 'react'
import styled, { keyframes, ThemeProvider } from 'styled-components'
import SEDBody from '../SEDBody/SEDBody'

export interface SEDPanelProps {
  aktoerId: string
  buc: Buc
  className ?: string
  followUpSeds: Seds
  highContrast: boolean
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
const SEDPanelDiv = styled.div`
  transform: translateX(-20px);
  opacity: 0;
  animation: ${slideInFromLeft} 0.2s forwards;

  .ekspanderbartPanel {
    background: ${({theme}: any) => theme['main-background-color']};
  }
  .ekspanderbartPanel__hode {
    background:  ${({theme}: any) => theme['main-background-color']};
  }
`
const Border = styled.div`
  margin-bottom: 1rem;
  border: 1px solid ${({theme}): any => theme['main-disabled-color']};
  border-radius: 4px;
`
const PaddedDiv = styled.div`
  padding: 1rem;
  background: ${({theme}: any) => theme['main-background-color']};
`
const SEDPanel: React.FC<SEDPanelProps> = ({
  aktoerId, buc, className, followUpSeds, highContrast, onSEDNew, sed, style
}: SEDPanelProps): JSX.Element => {
  const sedCanHaveAttachments = (sed: Sed): boolean => {
    return sed !== undefined && sed.allowsAttachments && _.includes(activeStatus, sed.status)
  }

  const sedCanShowProperties = (sed: Sed): boolean => {
    return _.includes(sedWithProperties, sed.type)
  }

  const sedHasOption = (sed: Sed): boolean => {
    return sedCanHaveAttachments(sed) || sedCanShowProperties(sed)
  }

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast: theme}>
      <SEDPanelDiv className={className}>
        {!sedHasOption(sed) ? (
          <Border>
            <PaddedDiv>
              <SEDListHeader
                followUpSeds={followUpSeds}
                sed={sed}
                style={style}
                buc={buc}
                onSEDNew={onSEDNew}
              />
            </PaddedDiv>
          </Border>
        ) : (
          <Border>
            <ExpandingPanel
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
                sed={sed}
                canHaveAttachments={sedCanHaveAttachments(sed)}
                canShowProperties={sedCanShowProperties(sed)}
              />
            </ExpandingPanel>
          </Border>
        )}
      </SEDPanelDiv>
    </ThemeProvider>
  )
}

export default SEDPanel
