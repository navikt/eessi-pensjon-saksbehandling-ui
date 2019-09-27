import React from 'react'
import PT from 'prop-types'
import { Nav } from 'eessi-pensjon-ui'

const PeriodDailySick = ({ localErrors, period, setPayingInstitution, t }) => (
  <Nav.Row>
    <div className='col-sm-12'>
      <Nav.Input
        id='a-buc-c-sedp4000-period__betalende-institusjon-input-id'
        className='a-buc-c-sedp4000-period__betalende-institusjon-input mt-2'
        label={
          <div className='pinfo-label'>
            <div className='pinfo-label'>
              <Nav.UndertekstBold>{t('buc:p4000-label-paying-institution-name')}</Nav.UndertekstBold>
            </div>
          </div>
        }
        value={period.payingInstitution || ''}
        placeholder={t('ui:writeIn')}
        onChange={setPayingInstitution}
        feil={localErrors.payingInstitution ? { feilmelding: t(localErrors.payingInstitution) } : null}
      />
    </div>
  </Nav.Row>
)

PeriodDailySick.propTypes = {
  localErrors: PT.object,
  period: PT.object,
  setPayingInstitution: PT.func,
  t: PT.func.isRequired
}

export default PeriodDailySick
