import React from 'react'
import PT from 'prop-types'
import { HjelpetekstAuto, Row, Select } from 'components/Nav'

const PeriodCategorySelect = ({ mode, period, setType, t }) => (
  <Row className={mode}>
    <div className='col-sm-8'>
      <Select
        id='a-buc-c-sedp4000-period__kategori-select'
        label={
          <div className='a-buc-c-sedp4000-period__label'>
            <span>{t('buc:p4000-label-category')}</span>
            <HjelpetekstAuto id='p4000-category-select-help'>
              {t('buc:p4000-help-category')}
            </HjelpetekstAuto>
          </div>
        }
        onChange={setType}
        value={period.type || ''}
      >
        <option value=''>{t('ui:choose')}</option>
        <option value='work'>{t('buc:p4000-label-category-work')}</option>
        <option value='home'>{t('buc:p4000-label-category-home')}</option>
        <option value='military'>{t('buc:p4000-label-category-military')}</option>
        <option value='learn'>{t('buc:p4000-label-category-learn')}</option>
        <option value='child'>{t('buc:p4000-label-category-child')}</option>
        <option value='voluntary'>{t('buc:p4000-label-category-voluntary')}</option>
        <option value='birth'>{t('buc:p4000-label-category-birth')}</option>
        <option value='daily'>{t('buc:p4000-label-category-daily')}</option>
        <option value='sick'>{t('buc:p4000-label-category-sick')}</option>
        <option value='other'>{t('buc:p4000-label-category-other')}</option>
      </Select>
    </div>
  </Row>
)

PeriodCategorySelect.propTypes = {
  mode: PT.string.isRequired,
  period: PT.object,
  setType: PT.func,
  t: PT.func.isRequired
}

export default PeriodCategorySelect
