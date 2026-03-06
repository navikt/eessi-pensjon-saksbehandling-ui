import React, {JSX} from 'react'
import { Labels } from 'src/declarations/app.d'
import { useTranslation } from 'react-i18next'
import { Tag } from '@navikt/ds-react'

export interface SEDStatusProps {
  className ?: string
  status: string
}

const statusList: Labels = {
  new: 'info',
  sent: 'success',
  received: 'meta-lime',
  cancelled: 'danger',
  active: 'meta-purple',
  unknown: 'info',
  first_new: 'neutral',
  first_sent: 'neutral',
  first_received: 'neutral'
}

export type StatusType = 'success' | 'info' | 'warning' | 'danger'

const SEDStatus: React.FC<SEDStatusProps> = ({
  className, status
}: SEDStatusProps): JSX.Element => {
  const { t } = useTranslation()
  const dataColor: StatusType | undefined =
    Object.prototype.hasOwnProperty.call(statusList, status) ? (statusList[status] as StatusType)! : (statusList.unknown as StatusType)!

  return (

    <Tag
      className={className}
      data-color={dataColor}
      variant="outline"
      data-testid='sedstatus'>
      {t('buc:status-' + status)}
    </Tag>
  )
}

export default SEDStatus
