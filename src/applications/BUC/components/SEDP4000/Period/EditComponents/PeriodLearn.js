import React from 'react'
import PT from 'prop-types'
import Ui from 'eessi-pensjon-ui'

const PeriodLearn = ({ localErrors, period, setLearnInstitution, t }) => (
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
        feil={localErrors.learnInstitution ? { feilmelding: t(localErrors.learnInstitution) } : null}
      />
    </div>
  </Ui.Nav.Row>
)

PeriodLearn.propTypes = {
  localErrors: PT.object,
  period: PT.object,
  setLearnInstitution: PT.func,
  t: PT.func.isRequired
}

export default PeriodLearn
