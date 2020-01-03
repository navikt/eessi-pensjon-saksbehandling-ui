import React from 'react'
import PT from 'prop-types'
import Ui from 'eessi-pensjon-ui'

const PeriodOther = ({ localErrors, period, setOtherType, t }) => (
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
        feil={localErrors.otherType ? { feilmelding: t(localErrors.otherType) } : null}
      />
    </div>
  </Ui.Nav.Row>
)

PeriodOther.propTypes = {
  localErrors: PT.object,
  period: PT.object,
  setOtherType: PT.func,
  t: PT.func.isRequired
}

export default PeriodOther
