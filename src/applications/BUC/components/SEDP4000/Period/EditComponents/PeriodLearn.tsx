import { Period } from 'declarations/period'
import { PeriodPropType } from 'declarations/period.pt'
import { T, Validation } from 'declarations/types'
import { TPropType, ValidationPropType } from 'declarations/types.pt'
import React from 'react'
import PT from 'prop-types'
import Ui from 'eessi-pensjon-ui'

export interface PeriodLearnProps {
   localErrors: Validation;
   period: Period;
   setLearnInstitution: (e: React.ChangeEvent) => void;
   t: T
}

const PeriodLearn: React.FC<PeriodLearnProps> = ({
  localErrors, period, setLearnInstitution, t
}: PeriodLearnProps): JSX.Element => (
  <Ui.Nav.Row className='period-learn'>
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

PeriodLearn.propTypes = {
  localErrors: ValidationPropType.isRequired,
  period: PeriodPropType.isRequired,
  setLearnInstitution: PT.func.isRequired,
  t: TPropType.isRequired
}

export default PeriodLearn
