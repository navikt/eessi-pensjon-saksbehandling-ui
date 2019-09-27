import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { Nav } from 'eessi-pensjon-ui'

import './SEDStatus.css'

const statusList = {
  draft: 'info',
  sent: 'suksess',
  received: 'advarsel',
  unknown: 'fokus'
}

const SEDStatus = (props) => {
  const { className, status, t } = props

  const tagType = Object.prototype.hasOwnProperty.call(statusList, status) ? statusList[status] : statusList.unknown

  return (
    <Nav.EtikettBase className={classNames('a-buc-c-sedstatus', className)} type={tagType}>
      {t('ui:' + props.status)}
    </Nav.EtikettBase>
  )
}

SEDStatus.propTypes = {
  className: PT.string,
  status: PT.string.isRequired,
  t: PT.func.isRequired
}

export default SEDStatus
