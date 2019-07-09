import React, { useState } from 'react'
import _ from 'lodash'
import { Flatknapp, Hovedknapp, Row, Systemtittel } from 'components/ui/Nav'
import SEDP4000 from 'applications/BUC/components/SEDP4000/SEDP4000'

const Step2 = (props) => {

  const { actions, buc, t, loading, backStep, _sed, p4000info } = props

  const [ showButtons, setShowButtons ] = useState(true)

  const onBackButtonClick = () => {
    setShowButtons(true)
    backStep()
  }

  const onForwardButtonClick = () => {
    setShowButtons(true)
    console.log('Forward')
  }

  const onCancelButtonClick = () => {
    setShowButtons(true)
    actions.resetBuc()
    actions.setMode('list')
  }

  const allowedToForward = () => {
    return _sed === 'P4000' ? p4000info && !_.isEmpty(p4000info.stayAbroad) : true
  }

  return <Row>
    <div className='col-md-12'>
      <Systemtittel>{t('buc:step-startSEDTitle', {
        buc: buc.type,
        sed: _sed || t('buc:form-newSed')
      })}</Systemtittel>
      <hr />
    </div>
    {_sed === 'P4000' ? <React.Fragment>
      <div className='col-8'>
         <SEDP4000 showButtons={showButtons} setShowButtons={setShowButtons} {...props}/>
      </div>
      <div className='col-4'/>
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
