import { Period } from 'declarations/period'
import { PeriodPropType } from 'declarations/period.pt'
import { Validation } from 'declarations/types'
import { ValidationPropType } from 'declarations/types.pt'
import React from 'react'
import PT from 'prop-types'
import Ui from 'eessi-pensjon-ui'
import { useTranslation } from 'react-i18next'

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
    <Ui.Nav.Row>
      <div className='col-sm-12'>
        <Ui.Nav.Input
          id='a-buc-c-sedp4000-period__betalende-institusjon-input-id'
          className='a-buc-c-sedp4000-period__betalende-institusjon-input mt-2'
          label={
            <div className='pinfo-label'>
              <div className='pinfo-label'>
                <Ui.Nav.UndertekstBold>{t('buc:p4000-label-paying-institution-name')}</Ui.Nav.UndertekstBold>
              </div>
            </div>
          }
          value={period.payingInstitution || ''}
          placeholder={t('ui:writeIn')}
          onChange={setPayingInstitution}
          feil={localErrors.payingInstitution ? t(localErrors.payingInstitution) : null}
        />
      </div>
    </Ui.Nav.Row>
  )
}

PeriodDailySick.propTypes = {
  localErrors: ValidationPropType.isRequired,
  period: PeriodPropType.isRequired,
  setPayingInstitution: PT.func.isRequired
}

export default PeriodDailySick
