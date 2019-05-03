import React from 'react'
import { Element } from 'nav-frontend-typografi'

function SedHeader (props) {
  const { t } = props
  return (
    <div className='SedContainer d-flex justify-content-between'>
      <div className='col-2 c-ui-mw-150'><Element>{t('buc:widget-buc-name')}</Element></div>
      <div className='col-4 c-ui-mw-250'><Element>{t('buc:widget-buc-status')}</Element></div>
      <div className='col-4 c-ui-mw-250'><Element>{t('buc:widget-buc-receiver')}</Element></div>
      <div className='col-2 c-ui-mw-150' />
    </div>
  )
}

SedHeader.defaultProps = {
  t: arg => arg
}

export default SedHeader
