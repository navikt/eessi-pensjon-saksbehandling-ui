import React from 'react'
import PT from 'prop-types'
import { Element } from 'components/ui/Nav'
import './SedHeader.css'

function SedHeader (props) {
  const { t } = props
  return <div className='a-buc-c-sed-header pb-1'>
    <div className='col-2'><Element>{t('buc:widget-buc-name')}</Element></div>
    <div className='col-4'><Element>{t('buc:widget-buc-status')}</Element></div>
    <div className='col-4'><Element>{t('buc:widget-buc-receiver')}</Element></div>
    <div className='col-2' />
  </div>
}

SedHeader.defaultProps = {
  t: PT.func.isRequired
}

export default SedHeader
