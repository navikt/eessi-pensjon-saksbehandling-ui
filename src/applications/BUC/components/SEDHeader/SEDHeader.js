import React from 'react'
import PT from 'prop-types'
import { Element } from 'components/ui/Nav'

import './SEDHeader.css'

const SEDHeader = (props) => {
  const { t } = props
  return <div
    className='a-buc-c-sedheader pb-1'
    id='a-buc-c-sedheader__div-id'>
    <div className='col-4'><Element>{t('buc:form-name') + ', ' + t('buc:form-status')}</Element></div>
    <div className='col-4'><Element>{t('buc:form-receiver')}</Element></div>
    <div className='col-4' />
  </div>
}

SEDHeader.propTypes = {
  t: PT.func.isRequired
}

export default SEDHeader
