import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { EtikettBase } from 'components/Nav'

import './SEDStatus.css'

const statusList = {
  'draft': 'info',
  'sent': 'suksess',
  'received': 'advarsel',
  'unknown': 'fokus'
}

const SEDStatus = (props) => {
  const { t, className, status } = props

  let tagType = statusList.hasOwnProperty(status) ? statusList[status] : statusList['unknown']

  return <EtikettBase className={classNames('a-buc-c-sedstatus', className)} type={tagType}>
    {t('ui:' + props.status)}
  </EtikettBase>
}

SEDStatus.propTypes = {
  status: PT.string.isRequired,
  className: PT.string,
  t: PT.func.isRequired
}

export default SEDStatus
