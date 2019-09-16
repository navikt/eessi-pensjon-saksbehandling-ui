import { Row } from 'nav-frontend-grid'
import { Input } from 'nav-frontend-skjema'
import { UndertekstBold } from 'nav-frontend-typografi'
import { HjelpetekstAuto } from 'nav-frontend-hjelpetekst'
import React from 'react'
import PT from 'prop-types'

const PeriodLearn = ({ t, period, setLearnInstitution, localErrors }) => (
  <Row className='period-learn'>
    <div className='col-sm-12'>
      <Input
        id='a-buc-c-sedp4000-period__opplaeringsinstitusjonsnavn-input-id'
        className='a-buc-c-sedp4000-period__opplaeringsinstitusjonsnavn-input'
        label={
          <div className='a-buc-c-sedp4000-period__label'>
            <div className='a-buc-c-sedp4000-period__label'>
              <UndertekstBold>{t('buc:p4000-label-learn-institution-name')}</UndertekstBold>
              <HjelpetekstAuto id='p4000-help-learn-institution'>
                {t('buc:p4000-help-learn-institution')}
              </HjelpetekstAuto>
            </div>
          </div>
        }
        value={period.learnInstitution || ''}
        placeholder={t('ui:writeIn')}
        onChange={setLearnInstitution}
        feil={localErrors.learnInstitution ? { feilmelding: t(localErrors.learnInstitution) } : null}
      />
    </div>
  </Row>
)

PeriodLearn.propTypes = {
  period: PT.object,
  localErrors: PT.object,
  t: PT.func,
  setLearnInstitution: PT.func
}

export default PeriodLearn
