import React from 'react'
import { Panel, Systemtittel } from 'components/Nav'
import BUCStart from 'applications/BUC/components/BUCStart/BUCStart'

import './BUCNew.css'

const BUCNew = (props) => {
  const { t } = props

  return (
    <>
      <Panel className='a-buc-bucnew s-border'>
        <Systemtittel>{t('buc:step-startBUCTitle')}</Systemtittel>
        <hr />
        <BUCStart mode='widget' {...props} />
      </Panel>
    </>
  )
}

export default BUCNew
