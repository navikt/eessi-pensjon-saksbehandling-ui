import { T } from 'declarations/types'
import { TPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React from 'react'

export interface PeriodButtonsProps {
  cancelPeriodRequest: () => void;
  mode: string;
  saveEditPeriod: () => void;
  saveNewPeriod: () => void;
  t: T
}

const PeriodButtons: React.FC<PeriodButtonsProps> = ({
  cancelPeriodRequest, mode, saveEditPeriod, saveNewPeriod, t
}: PeriodButtonsProps): JSX.Element => (
  <Ui.Nav.Row>
    <div className='mt-4 mb-4 col-sm-12'>
      {mode === 'edit' ? (
        <Ui.Nav.Knapp
          className='a-buc-c-sedp4000-period__edit-button mb-2 mr-4 w-sm-100'
          id='a-buc-c-sedp4000-period__edit-button-id'
          onClick={saveEditPeriod}
        >
          {t('buc:p4000-button-saveEditPeriod')}
        </Ui.Nav.Knapp>
      ) : null}
      {mode === 'new' ? (
        <Ui.Nav.Hovedknapp
          className='a-buc-c-sedp4000-period__save-button mb-2 mr-4 w-sm-100'
          id='a-buc-c-sedp4000-period__save-button-id'
          onClick={saveNewPeriod}
        >
          {t('buc:p4000-button-saveNewPeriod')}
        </Ui.Nav.Hovedknapp>
      ) : null}
      <Ui.Nav.Flatknapp
        className='a-buc-c-sedp4000-period__cancel-button mb-2 w-sm-100'
        id='a-buc-c-sedp4000-period__cancel-button-id'
        onClick={cancelPeriodRequest}
      >
        {t('buc:p4000-button-cancelPeriod')}
      </Ui.Nav.Flatknapp>
    </div>
  </Ui.Nav.Row>
)

PeriodButtons.propTypes = {
  cancelPeriodRequest: PT.func.isRequired,
  mode: PT.string.isRequired,
  saveEditPeriod: PT.func.isRequired,
  saveNewPeriod: PT.func.isRequired,
  t: TPropType.isRequired
}

export default PeriodButtons
