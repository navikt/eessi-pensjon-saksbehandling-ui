import { Period } from 'declarations/period'
//import { PeriodPropType } from 'declarations/period.pt'
import { Validation } from 'declarations/types'
import { ValidationPropType } from 'declarations/types.pt'
import React from 'react'
import PT from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Input } from 'nav-frontend-skjema'
import { UndertekstBold } from 'nav-frontend-typografi'
import Hjelpetekst from 'nav-frontend-hjelpetekst'

export interface PeriodLearnProps {
   localErrors: Validation;
   period: Period;
   setLearnInstitution: (e: React.ChangeEvent) => void;
}

const PeriodLearn: React.FC<PeriodLearnProps> = ({
  localErrors, period, setLearnInstitution
}: PeriodLearnProps): JSX.Element => {

  const {t} = useTranslation()
  return (<div className='row period-learn'>
      <div className='col-sm-12'>
        <Input
          id='a-buc-c-sedp4000-period__opplaeringsinstitusjonsnavn-input-id'
          className='a-buc-c-sedp4000-period__opplaeringsinstitusjonsnavn-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <div className='a-buc-c-sedp4000-period__label'>
                <UndertekstBold>{t('buc:p4000-label-learn-institution-name')}</UndertekstBold>
                <Hjelpetekst>
                  {t('buc:p4000-help-learn-institution')}
                </Hjelpetekst>
              </div>
            </div>
          }
          value={period.learnInstitution || ''}
          placeholder={t('ui:writeIn')}
          onChange={setLearnInstitution}
          feil={localErrors.learnInstitution ? t(localErrors.learnInstitution) : false}
        />
      </div>
    </div>
  )
}

PeriodLearn.propTypes = {
  localErrors: ValidationPropType.isRequired,
//  period: PeriodPropType.isRequired,
  setLearnInstitution: PT.func.isRequired
}

export default PeriodLearn
