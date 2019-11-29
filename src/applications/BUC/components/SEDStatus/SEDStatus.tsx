import classNames from 'classnames'
import { Nav } from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React from 'react'
import { T } from 'types'
import './SEDStatus.css'

export interface SEDStatusProps {
  className ?: string;
  status: string;
  t: T
}

const statusList: {[k: string]: string} = {
  new: 'fokus',
  sent: 'suksess',
  received: 'info',
  cancelled: 'advarsel',
  active: 'advarsel',
  unknown: 'info'
}

const SEDStatus = ({ className, status, t }: SEDStatusProps) => {
  const tagType: string = Object.prototype.hasOwnProperty.call(statusList, status) ? statusList[status] : statusList.unknown
  return (
    <Nav.EtikettBase className={classNames('a-buc-c-sedstatus', 'a-buc-c-sedstatus__' + status, className)} type={tagType}>
      {t('buc:status-' + status)}
    </Nav.EtikettBase>
  )
}

SEDStatus.propTypes = {
  className: PT.string,
  status: PT.string.isRequired,
  t: PT.func.isRequired
}

export default SEDStatus
