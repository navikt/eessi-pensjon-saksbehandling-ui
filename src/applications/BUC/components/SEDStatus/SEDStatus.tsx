import classNames from 'classnames'
import { Labels } from 'src/declarations/app.d'
import { useTranslation } from 'react-i18next'
import { Tag } from '@navikt/ds-react'
import styles from './SEDStatus.module.css'

export interface SEDStatusProps {
  className ?: string
  status: string
}

const statusList: Labels = {
  new: 'info',
  sent: 'success',
  received: 'info',
  cancelled: 'error',
  active: 'warning',
  unknown: 'info',
  first_new: 'warning',
  first_sent: 'warning',
  first_received: 'warning'
}

export type StatusType = 'success' | 'info' | 'warning' | 'error'

const SEDStatus: React.FC<SEDStatusProps> = ({
  className, status
}: SEDStatusProps): JSX.Element => {
  const { t } = useTranslation()
  const tagType: StatusType | undefined =
    Object.prototype.hasOwnProperty.call(statusList, status) ? (statusList[status] as StatusType)! : (statusList.unknown as StatusType)!
  return (

    <Tag
      className={classNames(
        styles.statusTags,
        { [styles.active]: status === 'active' },
        { [styles.received]: status === 'received' },
        { [styles.first_sent]: status === 'first_sent' },
        { [styles.first_received]: status === 'first_received' },
        { [styles.first_cancelled]: status === 'first_cancelled' },
        className
      )}
      variant={tagType}
      data-testid='sedstatus'>
      {t('buc:status-' + status)}
    </Tag>
  )
}

export default SEDStatus
