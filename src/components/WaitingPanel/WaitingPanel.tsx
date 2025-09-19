import classNames from 'classnames'
import {BodyLong, Loader, VStack} from '@navikt/ds-react'
import styles from './WaitingPanel.module.css'


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
  <VStack
    align="center"
    style={style}
    className={classNames(className, { [styles.rowDirection]: oneLine })}
    data-testid='c-WaitingPanel'
    {...props}
    gap="4"
  >
    <Loader size={size} />
    {message && (
      <BodyLong
        data-testid='c-waitingpanel--text-id'
      >
        {message}
      </BodyLong>
    )}
  </VStack>
)

export default WaitingPanel
