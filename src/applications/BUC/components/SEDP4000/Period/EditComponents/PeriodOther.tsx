import { Period } from 'declarations/period'
// import { PeriodPropType } from 'declarations/period.pt'
import { Validation } from 'declarations/types'
import { ValidationPropType } from 'declarations/types.pt'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Row } from 'nav-frontend-grid'
import { Input } from 'nav-frontend-skjema'
import { UndertekstBold } from 'nav-frontend-typografi'

export interface PeriodOtherProps {
  localErrors: Validation;
  period: Period;
  setOtherType: (e: React.ChangeEvent) => void;
}

const PeriodOther: React.FC<PeriodOtherProps> = ({
  localErrors, period, setOtherType
}: PeriodOtherProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Row>
      <div className='col-sm-12'>
        <Input
          id='a-buc-c-sedp4000-period__andre-input-id'
          className='a-buc-c-sedp4000-period__andre-input mt-2'
          label={
            <div className='pinfo-label'>
              <div className='pinfo-label'>
                <UndertekstBold>{t('buc:p4000-label-otherType')}</UndertekstBold>
              </div>
            </div>
          }
          value={period.otherType || ''}
          placeholder={t('ui:writeIn')}
          onChange={setOtherType}
          feil={localErrors.otherType ? t(localErrors.otherType) : null}
        />
      </div>
    </Row>
  )
}

PeriodOther.propTypes = {
  localErrors: ValidationPropType.isRequired,
//  period: PeriodPropType.isRequired,
  setOtherType: PT.func.isRequired
}

export default PeriodOther
