import React from 'react'
import { Hovedknapp, Panel, Systemtittel } from 'components/ui/Nav'
import BUCStart from 'applications/BUC/components/BUCStart/BUCStart'

const BUCNew = (props) => {
  const { t, actions } = props

  const onBUCList = () => {
    actions.resetBuc()
    actions.setMode('list')
  }

  return <React.Fragment>
    <div className='a-buc-buclist__buttons mt-3 mb-3'>
      <Hovedknapp onClick={onBUCList}>{t('ui:back')}</Hovedknapp>
    </div>
    <Panel>
      <Systemtittel>{t('buc:step-startBUCTitle')}</Systemtittel>
      <hr />
      <BUCStart mode='widget' {...props} />
    </Panel>
  </React.Fragment>
}

export default BUCNew
