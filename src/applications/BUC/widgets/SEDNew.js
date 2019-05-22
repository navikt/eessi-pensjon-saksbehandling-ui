import React from 'react'
import { Hovedknapp, Panel, Ingress } from 'components/ui/Nav'
import SEDStart from 'applications/BUC/steps/SEDStart'

const SEDNew = (props) => {
  const { t, actions, step } = props

  const onBUCList = () => {
    actions.setMode('list')
  }

  return <React.Fragment>
    <div className='a-buc-buclist-buttons mb-2'>
        <div></div>
      <Hovedknapp onClick={onBUCList}>{t('buc:form-backToList')}</Hovedknapp>
    </div>
    <Panel>
      <Ingress>{t('buc:step-startSEDTitle')}</Ingress>
      <hr />
      <SEDStart {...props} />
    </Panel>
  </React.Fragment>
}

export default SEDNew
