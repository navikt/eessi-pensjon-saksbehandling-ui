import React from 'react'
import PT from 'prop-types'
import classnames from 'classnames'
import { EtikettBase } from 'components/ui/Nav'

import './SEDStatus.css'

const statusList = {
  'draft' : 'info',
  'sent' : 'suksess',
  'received' : 'advarsel',
  'unknown' : 'fokus'
}

const SEDStatus = (props) => {

  const { t, className, status } = props

  let tagType = statusList.hasOwnProperty(status) ? statusList[status] : statusList['unknown']

  return <EtikettBase className='a-buc-c-sedstatus' type={tagType}>
    {t('ui:' + props.status)}
  </EtikettBase>
}

SEDStatus.propTypes = {
  status: PT.string.isRequired,
  className: PT.string,
  t: PT.func.isRequired
}

export default SEDStatus
