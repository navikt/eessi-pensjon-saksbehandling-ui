import React from 'react'
import { Hovedknapp, Panel, Ingress } from 'components/ui/Nav'
import SEDStart from 'applications/BUC/steps/SEDStart'
import SEDPreview from 'applications/BUC/steps/SEDPreview'
import SEDSaveSend from 'applications/BUC/steps/SEDSaveSend'

const BUCNew = (props) => {
  const { t, actions, step } = props

  const onBUCList = () => {
     actions.setMode('list')
  }

  return <div>
    <div className='text-right'>
      <Hovedknapp onClick={onBUCList}>{t('buc:widget-backToList')}</Hovedknapp>
    </div>
    <Panel>
      <Ingress>{t('buc:step-startSEDTitle')}</Ingress>
      <hr />
      {step === 0 ? <SEDStart mode='widget' {...props}/> : null}
      {step === 1 ? <SEDPreview mode='widget' {...props}/> : null}
      {step === 2 ? <SEDSaveSend mode='widget' {...props}/> : null}
    </Panel>
  </div>
}

export default BUCNew
