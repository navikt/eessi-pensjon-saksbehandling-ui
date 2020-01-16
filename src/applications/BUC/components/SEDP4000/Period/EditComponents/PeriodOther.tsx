import { Period } from 'declarations/period'
import { PeriodPropType } from 'declarations/period.pt'
import { T, Validation } from 'declarations/types'
import { TPropType, ValidationPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React from 'react'

export interface PeriodOtherProps {
  localErrors: Validation;
  period: Period;
  setOtherType: (e: React.ChangeEvent) => void;
  t: T
}

const PeriodOther: React.FC<PeriodOtherProps> = ({
  localErrors, period, setOtherType, t
}: PeriodOtherProps): JSX.Element => (
  <Ui.Nav.Row>
    <div className='col-sm-12'>
      <Ui.Nav.Input
        id='a-buc-c-sedp4000-period__andre-input-id'
        className='a-buc-c-sedp4000-period__andre-input mt-2'
        label={
          <div className='pinfo-label'>
            <div className='pinfo-label'>
              <Ui.Nav.UndertekstBold>{t('buc:p4000-label-otherType')}</Ui.Nav.UndertekstBold>
            </div>
          </div>
        }
        value={period.otherType || ''}
        placeholder={t('ui:writeIn')}
        onChange={setOtherType}
        feil={localErrors.otherType ? t(localErrors.otherType) : null}
      />
    </div>
  </Ui.Nav.Row>
)

PeriodOther.propTypes = {
  localErrors: ValidationPropType.isRequired,
  period: PeriodPropType.isRequired,
  setOtherType: PT.func.isRequired,
  t: TPropType.isRequired
}

export default PeriodOther
