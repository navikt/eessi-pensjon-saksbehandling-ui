import { Period } from 'declarations/period'
import { PeriodPropType } from 'declarations/period.pt'
import { Validation } from 'declarations/types'
import { ValidationPropType } from 'declarations/types.pt'
import React from 'react'
import PT from 'prop-types'
import Ui from 'eessi-pensjon-ui'
import { useTranslation } from 'react-i18next'

export interface PeriodLearnProps {
   localErrors: Validation;
   period: Period;
   setLearnInstitution: (e: React.ChangeEvent) => void;
}

const PeriodLearn: React.FC<PeriodLearnProps> = ({
  localErrors, period, setLearnInstitution
}: PeriodLearnProps): JSX.Element => {

  const {t} = useTranslation()
  return (<Ui.Nav.Row className='period-learn'>
      <div className='col-sm-12'>
        <Ui.Nav.Input
          id='a-buc-c-sedp4000-period__opplaeringsinstitusjonsnavn-input-id'
          className='a-buc-c-sedp4000-period__opplaeringsinstitusjonsnavn-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <div className='a-buc-c-sedp4000-period__label'>
                <Ui.Nav.UndertekstBold>{t('buc:p4000-label-learn-institution-name')}</Ui.Nav.UndertekstBold>
                <Ui.Nav.Hjelpetekst>
                  {t('buc:p4000-help-learn-institution')}
                </Ui.Nav.Hjelpetekst>
              </div>
            </div>
          }
          value={period.learnInstitution || ''}
          placeholder={t('ui:writeIn')}
          onChange={setLearnInstitution}
          feil={localErrors.learnInstitution ? t(localErrors.learnInstitution) : false}
        />
      </div>
    </Ui.Nav.Row>
  )
}

PeriodLearn.propTypes = {
  localErrors: ValidationPropType.isRequired,
  period: PeriodPropType.isRequired,
  setLearnInstitution: PT.func.isRequired
}

export default PeriodLearn
