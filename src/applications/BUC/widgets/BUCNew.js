import React from 'react'
import { Hovedknapp, Panel, Systemtittel } from 'components/ui/Nav'
import BUCStart from 'applications/BUC/components/BUCStart/BUCStart'

const BUCNew = (props) => {
  const { t } = props

  return <React.Fragment>
    <Panel>
      <Systemtittel>{t('buc:step-startBUCTitle')}</Systemtittel>
      <hr />
      <BUCStart mode='widget' {...props} />
    </Panel>
  </React.Fragment>
}

export default BUCNew
