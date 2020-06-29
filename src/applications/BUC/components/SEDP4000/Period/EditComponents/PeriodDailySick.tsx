import { Period } from 'declarations/period'
//import { PeriodPropType } from 'declarations/period.pt'
import { Validation } from 'declarations/types'
import { ValidationPropType } from 'declarations/types.pt'
import React from 'react'
import PT from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Row } from 'nav-frontend-grid'
import { Input } from 'nav-frontend-skjema'
import { UndertekstBold } from 'nav-frontend-typografi'

export interface PeriodDailySickProps {
  localErrors: Validation;
  period: Period;
  setPayingInstitution: (e: React.ChangeEvent) => void;
}

const PeriodDailySick: React.FC<PeriodDailySickProps> = ({
  localErrors, period, setPayingInstitution
}: PeriodDailySickProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Row>
      <div className='col-sm-12'>
        <Input
          id='a-buc-c-sedp4000-period__betalende-institusjon-input-id'
          className='a-buc-c-sedp4000-period__betalende-institusjon-input mt-2'
          label={
            <div className='pinfo-label'>
              <div className='pinfo-label'>
                <UndertekstBold>{t('buc:p4000-label-paying-institution-name')}</UndertekstBold>
              </div>
            </div>
          }
          value={period.payingInstitution || ''}
          placeholder={t('ui:writeIn')}
          onChange={setPayingInstitution}
          feil={localErrors.payingInstitution ? t(localErrors.payingInstitution) : null}
        />
      </div>
    </Row>
  )
}

PeriodDailySick.propTypes = {
  localErrors: ValidationPropType.isRequired,
  //period: PeriodPropType.isRequired,
  setPayingInstitution: PT.func.isRequired
}

export default PeriodDailySick
