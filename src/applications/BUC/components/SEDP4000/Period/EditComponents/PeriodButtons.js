import { Row } from 'nav-frontend-grid'
import { Flatknapp, Hovedknapp, Knapp } from 'nav-frontend-knapper'
import React from 'react'
import PT from 'prop-types'

const PeriodButtons = ({ mode, saveEditPeriod, saveNewPeriod, t, cancelPeriodRequest }) => (
  <Row>
    <div className='mt-4 mb-4 col-sm-12'>
      {mode === 'edit' ? (
        <Knapp
          id='a-buc-c-sedp4000-period__edit-button-id'
          className='a-buc-c-sedp4000-period__edit-button mb-2 mr-4 w-sm-100'
          onClick={saveEditPeriod}
        >
          {t('buc:p4000-button-saveEditPeriod')}
        </Knapp>
      ) : null}
      {mode === 'new' ? (
        <Hovedknapp
          id='a-buc-c-sedp4000-period__save-button-id'
          className='a-buc-c-sedp4000-period__save-button mb-2 mr-4 w-sm-100'
          onClick={saveNewPeriod}
        >
          {t('buc:p4000-button-saveNewPeriod')}
        </Hovedknapp>
      ) : null}
      <Flatknapp
        id='a-buc-c-sedp4000-period__cancel-button-id'
        className='a-buc-c-sedp4000-period__cancel-button mb-2 w-sm-100'
        onClick={cancelPeriodRequest}
      >
        {t('buc:p4000-button-cancelPeriod')}
      </Flatknapp>
    </div>
  </Row>
)

PeriodButtons.propTypes = {
  mode: PT.string.isRequired,
  t: PT.func,
  saveNewPeriod: PT.func,
  saveEditPeriod: PT.func,
  cancelPeriodRequest: PT.func
}

export default PeriodButtons
