import React from 'react'
import PT from 'prop-types'
import { Flatknapp, Hovedknapp, Knapp, Row } from 'components/Nav'

const PeriodButtons = ({ cancelPeriodRequest, mode, saveEditPeriod, saveNewPeriod, t }) => (
  <Row>
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
  </Row>
)

PeriodButtons.propTypes = {
  cancelPeriodRequest: PT.func,
  mode: PT.string.isRequired,
  saveEditPeriod: PT.func,
  saveNewPeriod: PT.func,
  t: PT.func.isRequired
}

export default PeriodButtons
