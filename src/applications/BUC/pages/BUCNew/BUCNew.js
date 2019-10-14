import React from 'react'
import PT from 'prop-types'
import { Nav } from 'eessi-pensjon-ui'
import BUCStart from 'applications/BUC/components/BUCStart/BUCStart'
import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import './BUCNew.css'

const BUCNew = (props) => {
  const { t } = props
  return (
    <Nav.Panel className='a-buc-bucnew s-border'>
      <Nav.Systemtittel>{t('buc:step-startBUCTitle')}</Nav.Systemtittel>
      <hr />
      <BUCStart mode='widget' {...props} />
      <BUCFooter className='w-100 mb-2' {...props} />
    </Nav.Panel>
  )
}

BUCNew.propTypes = {
  t: PT.func.isRequired
}
export default BUCNew
