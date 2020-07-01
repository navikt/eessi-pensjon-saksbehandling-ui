import { Buc } from 'declarations/buc'
import { BucPropType } from 'declarations/buc.pt'
import { AllowedLocaleString, Validation } from 'declarations/types'
import { AllowedLocaleStringPropType } from 'declarations/types.pt'
import { Systemtittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface Step2Props {
  aktoerId: string;
  buc: Buc;
  locale: AllowedLocaleString;
  _sed: string;
  showButtons: boolean;
  setShowButtons: (b: boolean) => void;
  validation: Validation;
  setValidation: (v: Validation) => void;
}

const Step2: React.FC<Step2Props> = (props: Step2Props): JSX.Element => {
  const { buc, _sed } = props
  const { t } = useTranslation()
  return (
    <>
      <div className='col-md-12'>
        <Systemtittel>{t('buc:step-startSEDTitle', {
          buc: t(`buc:buc-${buc.type}`),
          sed: _sed || t('buc:form-newSed')
        })}
        </Systemtittel>
        <hr />
      </div>
      {_sed === 'P4000' ? (
        <>
          <div className='col-md-8' />
          <div className='col-md-4' />
        </>
      ) : null}
    </>
  )
}

Step2.propTypes = {
  aktoerId: PT.string.isRequired,
  buc: BucPropType.isRequired,
  locale: AllowedLocaleStringPropType.isRequired,
  _sed: PT.string.isRequired
}

export default Step2
