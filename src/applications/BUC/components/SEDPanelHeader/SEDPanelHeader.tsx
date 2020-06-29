import React from 'react'
import { useTranslation } from 'react-i18next'
import './SEDPanelHeader.css'
import { Element } from 'nav-frontend-typografi'

const SEDPanelHeader: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  return (
    <div className='a-buc-c-sedpanelheader mt-2 mb-2'>
      <div className='a-buc-c-sedpanelheader_head col-4'>
        <Element>{t('buc:form-sed')}</Element>
      </div>
      <div className='a-buc-c-sedpanelheader_head col-3'>
        <Element>{t('buc:form-sender')}</Element>
      </div>
      <div className='a-buc-c-sedpanelheader_head col-3'>
        <Element>{t('buc:form-receiver')}</Element>
      </div>
      <div className='a-buc-c-sedpanelheader_head col-2'>
        <Element>{t('buc:form-actions')}</Element>
      </div>
    </div>
  )
}

SEDPanelHeader.propTypes = {}

export default SEDPanelHeader
