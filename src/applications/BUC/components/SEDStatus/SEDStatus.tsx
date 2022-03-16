import classNames from 'classnames'
import { Labels } from 'declarations/app.d'
import PT from 'prop-types'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { Tag } from '@navikt/ds-react'

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

export const MyTag = styled(Tag)`
  &.received {
    background-color: var(--navds-global-color-lightblue-500) !important;
  }
  &.active {
    background-color: var(--navds-global-color-purple-200) !important;
    border-color: var(--navds-global-color-purple-500) !important;
  }
  &.first_sent,
  &.first_received,
  &.first_cancelled {
    background-color: var(--navds-global-color-gray-400) !important;
  }
`

const SEDStatus: React.FC<SEDStatusProps> = ({
  className, status
}: SEDStatusProps): JSX.Element => {
  const { t } = useTranslation()
  const tagType: StatusType | undefined =
    Object.prototype.hasOwnProperty.call(statusList, status) ? (statusList[status] as StatusType)! : (statusList.unknown as StatusType)!
  return (
    <MyTag className={classNames(status, className)} variant={tagType}>
      {t('buc:status-' + status)}
    </MyTag>
  )
}

SEDStatus.propTypes = {
  className: PT.string,
  status: PT.string.isRequired
}

export default SEDStatus
