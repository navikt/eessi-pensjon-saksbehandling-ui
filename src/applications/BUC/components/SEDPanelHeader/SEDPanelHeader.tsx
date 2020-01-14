import Ui from 'eessi-pensjon-ui'
import React from 'react'
import { T } from 'types.d'
import './SEDPanelHeader.css'

export interface SEDPanelHeaderProps {
  t: T
}

const SEDPanelHeader = ({ t }: SEDPanelHeaderProps) => (
  <div className='a-buc-c-sedpanelheader mt-2 mb-2'>
    <div className='a-buc-c-sedpanelheader_head col-4'>
      <Ui.Nav.Element>{t('buc:form-sed')}</Ui.Nav.Element>
    </div>
    <div className='a-buc-c-sedpanelheader_head col-3'>
      <Ui.Nav.Element>{t('buc:form-sender')}</Ui.Nav.Element>
    </div>
    <div className='a-buc-c-sedpanelheader_head col-3'>
      <Ui.Nav.Element>{t('buc:form-receiver')}</Ui.Nav.Element>
    </div>
    <div className='a-buc-c-sedpanelheader_head col-2'>
      <Ui.Nav.Element>{t('buc:form-actions')}</Ui.Nav.Element>
    </div>
  </div>
)

export default SEDPanelHeader
