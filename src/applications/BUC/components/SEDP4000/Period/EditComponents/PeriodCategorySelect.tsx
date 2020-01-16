import { Period } from 'declarations/period'
import { PeriodPropType } from 'declarations/period.pt'
import { T } from 'declarations/types'
import { TPropType } from 'declarations/types.pt'
import React from 'react'
import PT from 'prop-types'
import Ui from 'eessi-pensjon-ui'

export interface PeriodCategorySelectProps  {
  mode: string;
  period: Period;
  setType: (e: React.ChangeEvent) => void;
  t: T
}

const PeriodCategorySelect: React.FC<PeriodCategorySelectProps> = ({
  mode, period, setType, t
}: PeriodCategorySelectProps): JSX.Element => (
  <Ui.Nav.Row className={mode}>
    <div className='col-sm-8'>
      <Ui.Nav.Hjelpetekst>
        {t('buc:p4000-help-category')}
      </Ui.Nav.Hjelpetekst>

      <Ui.Nav.Select
        id='a-buc-c-sedp4000-period__kategori-select'
        label={(
          <div className='d-flex'>
            <span>{t('buc:p4000-label-category')}</span>
            <Ui.Nav.Hjelpetekst>
              {t('buc:p4000-help-category')}
            </Ui.Nav.Hjelpetekst>
          </div>
        )}
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
      </Ui.Nav.Select>
    </div>
  </Ui.Nav.Row>
)

PeriodCategorySelect.propTypes = {
  mode: PT.string.isRequired,
  period: PeriodPropType.isRequired,
  setType: PT.func.isRequired,
  t: TPropType.isRequired
}

export default PeriodCategorySelect
