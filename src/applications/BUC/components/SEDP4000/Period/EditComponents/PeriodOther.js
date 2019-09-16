import React from 'react'
import PT from 'prop-types'
import { Input, Row, UndertekstBold } from 'components/Nav'

const PeriodOther = ({ localErrors, period, setOtherType, t }) => (
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
        feil={localErrors.otherType ? { feilmelding: t(localErrors.otherType) } : null}
      />
    </div>
  </Row>
)

PeriodOther.propTypes = {
  localErrors: PT.object,
  period: PT.object,
  setOtherType: PT.func,
  t: PT.func.isRequired
}

export default PeriodOther
