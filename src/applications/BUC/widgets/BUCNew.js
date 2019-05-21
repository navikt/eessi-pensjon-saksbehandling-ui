import React from 'react'
import { Hovedknapp, Panel, Ingress } from 'components/ui/Nav'
import SEDStart from 'applications/BUC/steps/SEDStart'
import SEDSaveSend from 'applications/BUC/steps/SEDSaveSend'

const BUCNew = (props) => {
  const { t, actions, step } = props

  const onBUCList = () => {
    actions.setMode('list')
  }

  return <React.Fragment>
    <div className='a-buc-buclist-buttons mb-2'>
        <div></div>
      <Hovedknapp onClick={onBUCList}>{t('buc:widget-backToList')}</Hovedknapp>
    </div>
    <Panel>
      <Ingress>{t('buc:step-startSEDTitle')}</Ingress>
      <hr />
      {step === 0 ? <SEDStart mode='widget' {...props} /> : null}
      {step === 2 ? <SEDSaveSend mode='widget' {...props} /> : null}
    </Panel>
  </React.Fragment>
}

export default BUCNew
