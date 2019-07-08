import React, { useState } from 'react'
import { Flatknapp, Hovedknapp, Row } from 'components/ui/Nav'
import SEDP4000 from 'applications/BUC/components/SEDP4000/SEDP4000'

const Step2 = (props) => {

  const { actions, t, loading, backStep, _sed } = props

  const [ showButtons, setShowButtons ] = useState(true)

  const onBackButtonClick = () => {
    showButtons(true)
    backStep()
  }

  const onForwardButtonClick = () => {
    showButtons(true)
    console.log('Forward')
  }

  const onCancelButtonClick = () => {
    showButtons(true)
    actions.resetBuc()
    actions.setMode('list')
  }

  const allowedToForward = () => {
    return true
  }

  return <Row>
    {_sed === 'P4000' ? <React.Fragment>
      <div className='col-2'/>
      <div className='col-8'>
        <SEDP4000 showButtons={showButtons} setShowButtons={setShowButtons} {...props}/>
      </div>
      <div className='col-2'/>
    </React.Fragment> : null }
    { showButtons ? <div className='col-md-12'>
      <Hovedknapp
        id='a-buc-c-sedstart__forward-button-id'
        className='a-buc-c-sedstart__forward-button'
        disabled={!allowedToForward()}
        spinner={loading.creatingSed}
        onClick={ onForwardButtonClick }>
        {t('buc:form-orderSED')}
      </Hovedknapp>
      <Flatknapp
        id='a-buc-c-sedstart__back-button-id'
        className='a-buc-c-sedstart__back-button'
        onClick={onBackButtonClick}>{t('ui:back')}
      </Flatknapp>
      <Flatknapp
        id='a-buc-c-sedstart__cancel-button-id'
        className='a-buc-c-sedstart__cancel-button'
        onClick={onCancelButtonClick}>{t('ui:cancel')}
      </Flatknapp>
    </div> : null }
 </Row>

}

export default Step2
