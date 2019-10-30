import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { Nav } from 'eessi-pensjon-ui'
import './SEDStatus.css'

const statusList = {
  new: 'fokus',
  sent: 'suksess',
  received: 'info',
  cancelled: 'advarsel',
  unknown: 'info'
}

const SEDStatus = ({ className, status, t }) => {
  const tagType = Object.prototype.hasOwnProperty.call(statusList, status) ? statusList[status] : statusList.unknown
  return (
    <Nav.EtikettBase className={classNames('a-buc-c-sedstatus', 'a-buc-c-sedstatus__' + status, className)} type={tagType}>
      {t('ui:' + status)}
    </Nav.EtikettBase>
  )
}

SEDStatus.propTypes = {
  className: PT.string,
  status: PT.string.isRequired,
  t: PT.func.isRequired
}

export default SEDStatus
