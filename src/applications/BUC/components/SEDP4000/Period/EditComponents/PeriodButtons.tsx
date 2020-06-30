import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Knapp, { Hovedknapp, Flatknapp } from 'nav-frontend-knapper'

export interface PeriodButtonsProps {
  cancelPeriodRequest: () => void;
  mode: string;
  saveEditPeriod: () => void;
  saveNewPeriod: () => void;
}

const PeriodButtons: React.FC<PeriodButtonsProps> = ({
  cancelPeriodRequest, mode, saveEditPeriod, saveNewPeriod
}: PeriodButtonsProps): JSX.Element => {
  const {t} = useTranslation()
  return (
    <div className='row'>
      <div className='mt-4 mb-4 col-sm-12'>
        {mode === 'edit' ? (
          <Knapp
            className='a-buc-c-sedp4000-period__edit-button mb-2 mr-4 w-sm-100'
            id='a-buc-c-sedp4000-period__edit-button-id'
            onClick={saveEditPeriod}
          >
            {t('buc:p4000-button-saveEditPeriod')}
          </Knapp>
        ) : null}
        {mode === 'new' ? (
          <Hovedknapp
            className='a-buc-c-sedp4000-period__save-button mb-2 mr-4 w-sm-100'
            id='a-buc-c-sedp4000-period__save-button-id'
            onClick={saveNewPeriod}
          >
            {t('buc:p4000-button-saveNewPeriod')}
          </Hovedknapp>
        ) : null}
        <Flatknapp
          className='a-buc-c-sedp4000-period__cancel-button mb-2 w-sm-100'
          id='a-buc-c-sedp4000-period__cancel-button-id'
          onClick={cancelPeriodRequest}
        >
          {t('buc:p4000-button-cancelPeriod')}
        </Flatknapp>
      </div>
    </div>
  )
}

PeriodButtons.propTypes = {
  cancelPeriodRequest: PT.func.isRequired,
  mode: PT.string.isRequired,
  saveEditPeriod: PT.func.isRequired,
  saveNewPeriod: PT.func.isRequired
}

export default PeriodButtons
