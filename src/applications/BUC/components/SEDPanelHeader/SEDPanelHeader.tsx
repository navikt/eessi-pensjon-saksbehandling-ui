import Ui from 'eessi-pensjon-ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import './SEDPanelHeader.css'

const SEDPanelHeader: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  return (
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
}

SEDPanelHeader.propTypes = {}

export default SEDPanelHeader
