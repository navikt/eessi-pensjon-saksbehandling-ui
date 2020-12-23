import classNames from 'classnames'
import { HorizontalSeparatorDiv } from 'nav-hoykontrast'
import Spinner from 'nav-frontend-spinner'
import { Normaltekst } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React from 'react'
import styled from 'styled-components'

export const WaitingPanelDiv = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  &.rowDirection {
     flex-direction: row;
  }
  .oneLine {
    display: inline-block;
    vertical-align: top;
  }
`

export type WaitingPanelSize = 'XXS'| 'XS' | 'S'| 'M' | 'L'| 'XL'| 'XXL' | 'XXXL'

export interface WaitingPanelProps {
  className?: string
  size?: WaitingPanelSize
  style?: React.CSSProperties
  message?: string,
  oneLine?: boolean
}

const WaitingPanel: React.FC<WaitingPanelProps> = ({
  className, size = 'M', style = {}, message = 'Vennligst vent...', oneLine = false
}: WaitingPanelProps): JSX.Element | null => (
  <WaitingPanelDiv
    style={style}
    className={classNames(className, { rowDirection: oneLine })}
  >
    <Spinner type={size} />
    {message && (
      <>
        <HorizontalSeparatorDiv />
        <Normaltekst
          className={classNames({ oneLine: oneLine })}
          data-test-id='c-waitingpanel__text-id'
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
