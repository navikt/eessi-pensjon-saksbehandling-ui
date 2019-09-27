import React from 'react'
import { Nav } from 'eessi-pensjon-ui'
import BUCStart from 'applications/BUC/components/BUCStart/BUCStart'

import './BUCNew.css'

const BUCNew = (props) => {
  const { t } = props

  return (
    <>
      <Nav.Panel className='a-buc-bucnew s-border'>
        <Nav.Systemtittel>{t('buc:step-startBUCTitle')}</Nav.Systemtittel>
        <hr />
        <BUCStart mode='widget' {...props} />
      </Nav.Panel>
    </>
  )
}

export default BUCNew
