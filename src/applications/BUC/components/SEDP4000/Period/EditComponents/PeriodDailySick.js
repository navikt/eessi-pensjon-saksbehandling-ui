import { Row } from 'nav-frontend-grid'
import { Input } from 'nav-frontend-skjema'
import { UndertekstBold } from 'nav-frontend-typografi'
import React from 'react'
import PT from 'prop-types'

const PeriodDailySick = ({ period, setPayingInstitution, localErrors, t }) => (
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
        feil={localErrors.payingInstitution ? { feilmelding: t(localErrors.payingInstitution) } : null}
      />
    </div>
  </Row>
)

PeriodDailySick.propTypes = {
  period: PT.object,
  localErrors: PT.object,
  t: PT.func,
  setPayingInstitution: PT.func
}

export default PeriodDailySick
