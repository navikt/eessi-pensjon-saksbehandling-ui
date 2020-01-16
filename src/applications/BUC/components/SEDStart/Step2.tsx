import SEDP4000 from 'applications/BUC/components/SEDP4000/SEDP4000'
import { Buc } from 'declarations/buc'
import { BucPropType } from 'declarations/buc.pt'
import { T, Validation } from 'declarations/types'
import { TPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React from 'react'

export interface Step2Props {
  buc: Buc;
  t: T;
  _sed: string;
  showButtons: boolean;
  setShowButtons: (b: boolean) => void;
  validation: Validation;
  setValidation: (v: Validation) => void;
}

const Step2: React.FC<Step2Props> = (props: Step2Props): JSX.Element => {
  const { buc, t, _sed } = props
  return (
    <>
      <div className='col-md-12'>
        <Ui.Nav.Systemtittel>{t('buc:step-startSEDTitle', {
          buc: t(`buc:buc-${buc.type}`),
          sed: _sed || t('buc:form-newSed')
        })}
        </Ui.Nav.Systemtittel>
        <hr />
      </div>
      {_sed === 'P4000' ? (
        <>
          <div className='col-md-8'>
            <SEDP4000 {...props} />
          </div>
          <div className='col-md-4' />
        </>
      ) : null}
    </>
  )
}

Step2.propTypes = {
  buc: BucPropType.isRequired,
  _sed: PT.string.isRequired,
  t: TPropType.isRequired
}

export default Step2
