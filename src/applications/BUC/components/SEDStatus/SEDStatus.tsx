import classNames from 'classnames'
import { Labels } from 'declarations/types'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import EtikettBase from 'nav-frontend-etiketter'
import './SEDStatus.css'

export interface SEDStatusProps {
  className ?: string;
  status: string;
}

const statusList: Labels = {
  new: 'fokus',
  sent: 'suksess',
  received: 'info',
  cancelled: 'advarsel',
  active: 'advarsel',
  unknown: 'info',
  first_new: 'advarsel',
  first_sent: 'advarsel',
  first_received: 'advarsel'
}

type StatusType = 'suksess' | 'info' | 'advarsel' | 'fokus'

const SEDStatus: React.FC<SEDStatusProps> = ({
  className, status
}: SEDStatusProps): JSX.Element => {
  const { t } = useTranslation()
  const tagType: StatusType =
    Object.prototype.hasOwnProperty.call(statusList, status) ? (statusList[status] as StatusType)! : (statusList.unknown as StatusType)!
  return (
    <EtikettBase className={classNames('a-buc-c-sedstatus', 'a-buc-c-sedstatus__' + status, className)} type={tagType}>
      {t('buc:status-' + status)}
    </EtikettBase>
  )
}

SEDStatus.propTypes = {
  className: PT.string,
  status: PT.string.isRequired
}

export default SEDStatus
