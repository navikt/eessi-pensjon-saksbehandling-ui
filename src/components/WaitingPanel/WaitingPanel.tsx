import classNames from 'classnames'
import {BodyLong, HStack, Loader} from '@navikt/ds-react'
import styled from 'styled-components'

export const WaitingPanelDiv = styled(HStack)`
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

export type WaitingPanelSize = 'xsmall'| 'small' | 'medium'| 'large' | 'xlarge'| '2xlarge'

export interface WaitingPanelProps {
  className?: string
  size?: WaitingPanelSize
  style?: React.CSSProperties
  message?: string,
  oneLine?: boolean
}

const WaitingPanel: React.FC<WaitingPanelProps> = ({
  className, size = 'medium', style = {}, message = 'Vennligst vent...', oneLine = false, ...props
}: WaitingPanelProps): JSX.Element | null => (
  <WaitingPanelDiv
    style={style}
    className={classNames(className, { rowDirection: oneLine })}
    data-testid='c-WaitingPanel'
    {...props}
    gap="4"
  >
    <Loader type={size} />
    {message && (
      <BodyLong
        className={classNames({ oneLine })}
        data-testid='c-waitingpanel--text-id'
      >
        {message}
      </BodyLong>
    )}
  </WaitingPanelDiv>
)

export default WaitingPanel
