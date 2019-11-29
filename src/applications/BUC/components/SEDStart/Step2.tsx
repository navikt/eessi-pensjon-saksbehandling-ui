import SEDP4000 from 'applications/BUC/components/SEDP4000/SEDP4000'
import { Buc } from 'applications/BUC/declarations/buc'
import { Nav } from 'eessi-pensjon-ui'
import React from 'react'
import { AllowedLocaleString, T, Validation } from 'types'

export interface Step2Props {
  buc: Buc;
  t: T;
  locale: AllowedLocaleString;
  _sed: string;
  showButtons: boolean;
  setShowButtons: Function;
  validation: Validation;
  setValidation: Function;
}

const Step2 = (props: Step2Props) => {
  const { buc, t, _sed, showButtons, setShowButtons } = props

  return (
    <>
      <div className='col-md-12'>
        <Nav.Systemtittel>{t('buc:step-startSEDTitle', {
          buc: t(`buc:buc-${buc.type}`),
          sed: _sed || t('buc:form-newSed')
        })}
        </Nav.Systemtittel>
        <hr />
      </div>
      {_sed === 'P4000' ? (
        <>
          <div className='col-md-8'>
            <SEDP4000 showButtons={showButtons} setShowButtons={setShowButtons} {...props} />
          </div>
          <div className='col-md-4' />
        </>
      ) : null}
    </>
  )
}

export default Step2
