import { Row } from 'nav-frontend-grid'
import { Input } from 'nav-frontend-skjema'
import { UndertekstBold } from 'nav-frontend-typografi'
import React from 'react'

export const PeriodOther = ({ period, setOtherType, localErrors, t }) => (
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
