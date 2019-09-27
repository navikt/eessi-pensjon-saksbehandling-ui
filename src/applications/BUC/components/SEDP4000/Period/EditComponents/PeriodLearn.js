import React from 'react'
import PT from 'prop-types'
import { Nav } from 'eessi-pensjon-ui'

const PeriodLearn = ({ localErrors, period, setLearnInstitution, t }) => (
  <Nav.Row className='period-learn'>
    <div className='col-sm-12'>
      <Nav.Input
        id='a-buc-c-sedp4000-period__opplaeringsinstitusjonsnavn-input-id'
        className='a-buc-c-sedp4000-period__opplaeringsinstitusjonsnavn-input'
        label={
          <div className='a-buc-c-sedp4000-period__label'>
            <div className='a-buc-c-sedp4000-period__label'>
              <Nav.UndertekstBold>{t('buc:p4000-label-learn-institution-name')}</Nav.UndertekstBold>
              <Nav.HjelpetekstAuto id='p4000-help-learn-institution'>
                {t('buc:p4000-help-learn-institution')}
              </Nav.HjelpetekstAuto>
            </div>
          </div>
        }
        value={period.learnInstitution || ''}
        placeholder={t('ui:writeIn')}
        onChange={setLearnInstitution}
        feil={localErrors.learnInstitution ? { feilmelding: t(localErrors.learnInstitution) } : null}
      />
    </div>
  </Nav.Row>
)

PeriodLearn.propTypes = {
  localErrors: PT.object,
  period: PT.object,
  setLearnInstitution: PT.func,
  t: PT.func.isRequired
}

export default PeriodLearn
