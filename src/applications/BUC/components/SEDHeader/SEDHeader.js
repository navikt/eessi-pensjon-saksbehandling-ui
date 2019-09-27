import React from 'react'
import PT from 'prop-types'
import { Nav } from 'eessi-pensjon-ui'

import './SEDHeader.css'

const SEDHeader = (props) => {
  const { t } = props
  return (
    <div
      className='a-buc-c-sedheader pb-1'
      id='a-buc-c-sedheader__div-id'
    >
      <div className='a-buc-c-sedheader__head col-2'>
        <Nav.Element>{t('buc:form-name')}</Nav.Element>
      </div>
      <div className='a-buc-c-sedheader__head col-4'>
        <Nav.Element>{t('buc:form-status')}</Nav.Element>
      </div>
      <div className='a-buc-c-sedheader__head col-4'>
        <Nav.Element>{t('buc:form-receiver')}</Nav.Element>
      </div>
      <div className='a-buc-c-sedheader__head col-2' />
    </div>
  )
}

SEDHeader.propTypes = {
  t: PT.func.isRequired
}

export default SEDHeader
