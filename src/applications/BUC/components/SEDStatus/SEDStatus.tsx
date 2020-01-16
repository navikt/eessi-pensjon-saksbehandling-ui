import classNames from 'classnames'
import { TPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import { Labels } from 'eessi-pensjon-ui/dist/declarations/types'
import PT from 'prop-types'
import React from 'react'
import { T } from 'declarations/types'
import './SEDStatus.css'

export interface SEDStatusProps {
  className ?: string;
  status: string;
  t: T
}

const statusList: Labels = {
  new: 'fokus',
  sent: 'suksess',
  received: 'info',
  cancelled: 'advarsel',
  active: 'advarsel',
  unknown: 'info'
}

const SEDStatus: React.FC<SEDStatusProps> = ({
  className, status, t
}: SEDStatusProps): JSX.Element => {
  const tagType: string = Object.prototype.hasOwnProperty.call(statusList, status) ? statusList[status]! : statusList.unknown!
  return (
    <Ui.Nav.EtikettBase className={classNames('a-buc-c-sedstatus', 'a-buc-c-sedstatus__' + status, className)} type={tagType}>
      {t('buc:status-' + status)}
    </Ui.Nav.EtikettBase>
  )
}

SEDStatus.propTypes = {
  className: PT.string,
  status: PT.string.isRequired,
  t: TPropType.isRequired
}

export default SEDStatus
