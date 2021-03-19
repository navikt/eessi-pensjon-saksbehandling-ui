import SEDHeader from 'applications/BUC/components/SEDHeader/SEDHeader'
import classNames from 'classnames'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import NavHighContrast, { themeKeys, slideInFromLeft, HighContrastPanel } from 'nav-hoykontrast'
import { Buc, Sed } from 'declarations/buc'
import _ from 'lodash'
import styled from 'styled-components'
import SEDBody from '../SEDBody/SEDBody'

const activeStatus: Array<string> = ['new', 'active']

export const SEDPanelContainer = styled(HighContrastPanel)`
  transform: translateX(-20px);
  opacity: 0;
  padding: 0;
  animation: ${slideInFromLeft(20)} 0.2s forwards;
  margin-bottom: 1rem;
  span, p {
    font-size: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
    line-height: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
  }
  &.new .ekspanderbartPanel__hode,
  &.new .ekspanderbartPanel__hode div:not(.etikett) {
    background: ${({ theme }) => theme.type === 'themeHighContrast'
      ? theme[themeKeys.NAVLIMEGRONNDARKEN80]
      : theme[themeKeys.NAVLIMEGRONNLIGHTEN80]};
  }
  &.new .ekspanderbartPanel__hode:hover div:not(.etikett) {
    background: ${({ theme }) => theme[themeKeys.MAIN_HOVER_COLOR]} !important;
  }
`
export const SEDPanelDiv = styled.div`
  padding: 1rem;
  border-radius: ${({ theme }) => theme[themeKeys.MAIN_BORDER_RADIUS]};
  background: ${({ theme }) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
`
export const SEDPanelExpandingPanel = styled(ExpandingPanel)`
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
  highContrast: boolean
  newSed: boolean
  onSEDNew: (buc: Buc, sed: Sed, replySed: Sed | undefined) => void
  sed: Sed
  style: React.CSSProperties
}

const SEDPanel: React.FC<SEDPanelProps> = ({
  aktoerId, buc, className, highContrast, newSed, onSEDNew, sed, style
}: SEDPanelProps): JSX.Element => {
  const sedCanHaveAttachments = (sed: Sed): boolean => {
    return !buc.readOnly && sed !== undefined && sed.allowsAttachments && _.includes(activeStatus, sed.status)
  }

  return (
    <NavHighContrast highContrast={highContrast}>
      <SEDPanelContainer className={classNames(className, { new: newSed })}>
        {!sedCanHaveAttachments(sed)
          ? (
            <SEDPanelDiv>
              <SEDHeader
                buc={buc}
                onSEDNew={onSEDNew}
                sed={sed}
                style={style}
              />
            </SEDPanelDiv>
            )
          : (
            <SEDPanelExpandingPanel
              style={style}
              highContrast={highContrast}
              heading={
                <SEDHeader
                  buc={buc}
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
    </NavHighContrast>
  )
}

export default SEDPanel
