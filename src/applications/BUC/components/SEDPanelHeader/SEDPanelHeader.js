import React from 'react'
import { Nav } from 'eessi-pensjon-ui'
import './SEDPanelHeader.css'

const SEDPanelHeader = ({ t }) => (
  <div className='a-buc-c-sedpanelheader mt-2 mb-2'>
    <div className='a-buc-c-sedpanelheader_head col-4'>
      <Nav.Element>{t('buc:form-sed')}</Nav.Element>
    </div>
    <div className='a-buc-c-sedpanelheader_head col-3'>
      <Nav.Element>{t('buc:form-sender')}</Nav.Element>
    </div>
    <div className='a-buc-c-sedpanelheader_head col-3'>
      <Nav.Element>{t('buc:form-receiver')}</Nav.Element>
    </div>
    <div className='a-buc-c-sedpanelheader_head col-2'>
      <Nav.Element>{t('buc:form-actions')}</Nav.Element>
    </div>
  </div>
)

export default SEDPanelHeader
