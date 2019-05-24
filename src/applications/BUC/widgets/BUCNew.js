import React from 'react'
import { Hovedknapp, Panel, Ingress } from 'components/ui/Nav'
import BUCStart from 'applications/BUC/components/BUCStart/BUCStart'

const BUCNew = (props) => {
  const { t, actions } = props

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
      <BUCStart mode='widget' {...props} />
    </Panel>
  </React.Fragment>
}

export default BUCNew
