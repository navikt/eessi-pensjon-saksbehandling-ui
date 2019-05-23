import React from 'react'
import { Hovedknapp, Panel, Ingress } from 'components/ui/Nav'
import BUCStart from 'applications/BUC/steps/BUCStart'
import SEDSaveSend from 'applications/BUC/steps/SEDSaveSend'

const BUCNew = (props) => {
  const { t, actions, step } = props

  const onBUCList = () => {
    actions.setMode('list')
  }

  return <React.Fragment>
    <div className='a-buc-buclist-buttons mb-2'>
      <div />
      <Hovedknapp onClick={onBUCList}>{t('buc:form-backToList')}</Hovedknapp>
    </div>
    <Panel>
      <Ingress>{t('buc:step-startBUCTitle')}</Ingress>
      <hr />
      {step === 0 ? <BUCStart mode='widget' {...props} /> : null}
      {step === 2 ? <SEDSaveSend mode='widget' {...props} /> : null}
    </Panel>
  </React.Fragment>
}

export default BUCNew
