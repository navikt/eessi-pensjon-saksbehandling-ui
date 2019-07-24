import React from 'react'
import { Systemtittel } from 'components/Nav'
import SEDP4000 from 'applications/BUC/components/SEDP4000/SEDP4000'

const Step2 = (props) => {
  const { buc, t, _sed, showButtons, setShowButtons } = props

  return <React.Fragment>
    <div className='col-md-12'>
      <Systemtittel>{t('buc:step-startSEDTitle', {
        buc: t(`buc:buc-${buc.type}`),
        sed: _sed || t('buc:form-newSed')
      })}</Systemtittel>
      <hr />
    </div>
    {_sed === 'P4000' ? <React.Fragment>
      <div className='col-md-8'>
        <SEDP4000 showButtons={showButtons} setShowButtons={setShowButtons} {...props} />
      </div>
      <div className='col-md-4' />
    </React.Fragment> : null }
  </React.Fragment>
}

export default Step2
