import React from 'react'
import PT from 'prop-types'
import PDFEditor from 'applications/PDF/components/PDFEditor/PDFEditor'
import { Nav } from 'eessi-pensjon-ui'

export const AttachmentStep2 = (props) => {
  const { setStep, t } = props

  const onForwardButtonClick = () => {
    setStep('generate')
  }

  const onBackButtonClick = () => {
    setStep('select')
  }

  return (
    <div className='a-buc-c-sedattachments__step2'>
      <PDFEditor {...props} />
      <Nav.Hovedknapp
        id='a-buc-c-sedattachmnents__next-button-id'
        className='a-buc-c-sedattachmnents__next-button'
        onClick={onForwardButtonClick}
      >
        {t('ui:next')}
      </Nav.Hovedknapp>
      <Nav.Flatknapp
        id='a-buc-c-sedattachmnents__back-button-id'
        className='a-buc-c-sedattachmnents__back-button'
        onClick={onBackButtonClick}
      >
        {t('ui:back')}
      </Nav.Flatknapp>
    </div>
  )
}

AttachmentStep2.propTypes = {
  setStep: PT.func.isRequired,
  t: PT.func.isRequired
}

export default AttachmentStep2
