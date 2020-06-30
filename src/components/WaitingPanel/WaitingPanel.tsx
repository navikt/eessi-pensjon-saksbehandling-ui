import { HorizontalSeparatorDiv } from 'components/StyledComponents'
import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import Spinner from 'nav-frontend-spinner'
import { Normaltekst } from 'nav-frontend-typografi'
import './WaitingPanel.css'
import styled from 'styled-components'

export interface WaitingPanelProps {
  className?: string;
  size?: 'XXS'| 'XS' | 'S'| 'M' | 'L'| 'XL'| 'XXL' | 'XXXL';
  style?: React.CSSProperties;
  message?: string,
  oneLine?: boolean
}

const WaitingPanelDiv = styled.div`
  text-align: center;
  .oneLine {
    display: inline-block;
    vertical-align: top;
  }
`

const WaitingPanel: React.FC<WaitingPanelProps> = ({
  className, size = 'M', style = {}, message = 'Vennligst vent...', oneLine = false
}: WaitingPanelProps): JSX.Element | null => (
  <WaitingPanelDiv
    style={style}
    className={className}
  >
    <Spinner type={size} />
    {message && (
      <>
        <HorizontalSeparatorDiv/>
        <Normaltekst
          className={classNames({ oneLine: oneLine })}
        >
          {message}
        </Normaltekst>
      </>
    )}
  </WaitingPanelDiv>
)

WaitingPanel.propTypes = {
  className: PT.string,
  message: PT.string,
  oneLine: PT.bool,
  size: PT.oneOf(['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']),
  style: PT.object
}
WaitingPanel.displayName = 'WaitingPanel'
export default WaitingPanel
