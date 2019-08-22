import React from 'react'
import PT from 'prop-types'
import PDFEditor from 'applications/PDF/components/PDFEditor/PDFEditor'
import { Hovedknapp, Flatknapp } from 'components/Nav'

const Step2 = (props) => {
  const { t, setStep } = props

  const onForwardButtonClick = () => {
    setStep('generate')
  }

  const onBackButtonClick = () => {
    setStep('select')
  }

  return (
    <div className='a-buc-c-sedattachments-step2'>
      <PDFEditor {...props} />
      <Hovedknapp
        id='a-buc-c-sedattachmnents__next-button-id'
        className='a-buc-c-sedattachmnents__next-button'
        onClick={onForwardButtonClick}
      >
        {t('ui:next')}
      </Hovedknapp>
      <Flatknapp
        id='a-buc-c-sedattachmnents__back-button-id'
        className='a-buc-c-sedattachmnents__back-button'
        onClick={onBackButtonClick}
      >
        {t('ui:back')}
      </Flatknapp>
    </div>
  )
}

Step2.propTypes = {
  actions: PT.object,
  t: PT.func.isRequired
}

export default Step2
