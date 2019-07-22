import React from 'react'
import PT from 'prop-types'
import { Element } from 'components/ui/Nav'

import './SEDHeader.css'

const SEDHeader = (props) => {
  const { t } = props
  return <div
    className='a-buc-c-sedheader pb-1'
    id='a-buc-c-sedheader__div-id'>
    <div className='a-buc-c-sedheader__head col-2'>
      <Element>{t('buc:form-name')}</Element>
    </div>
    <div className='a-buc-c-sedheader__head col-4'>
      <Element>{t('buc:form-status')}</Element>
    </div>
    <div className='a-buc-c-sedheader__head col-4'>
      <Element>{t('buc:form-receiver')}</Element>
    </div>
    <div className='a-buc-c-sedheader__head col-2' />
  </div>
}

SEDHeader.propTypes = {
  t: PT.func.isRequired
}

export default SEDHeader
