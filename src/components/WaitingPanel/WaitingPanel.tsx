import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import Spinner from 'nav-frontend-spinner'
import { Normaltekst } from 'nav-frontend-typografi'
import './WaitingPanel.css'

export interface WaitingPanelProps {
  className?: string;
  size?: 'XXS'| 'XS' | 'S'| 'M' | 'L'| 'XL'| 'XXL' | 'XXXL';
  style?: React.CSSProperties;
  message?: string,
  oneLine?: boolean
}

const WaitingPanel: React.FC<WaitingPanelProps> = ({
  className, size = 'M', style = {}, message = 'Vennligst vent...', oneLine = false
}: WaitingPanelProps): JSX.Element | null => (
  <div style={style} className={classNames('c-waitingPanel', 'text-center', className)}>
    <Spinner type={size} />
    {message ? (
      <Normaltekst className={classNames('c-waitingPanel__message', 'ml-2', { oneLine: oneLine })}>
        {message}
      </Normaltekst>
    ) : null}
  </div>
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
