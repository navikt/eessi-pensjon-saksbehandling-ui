import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import PDFEditor from 'applications/PDF/components/PDFEditor/PDFEditor'
import { Ingress, Hovedknapp, Flatknapp } from 'components/ui/Nav'

const Step2 = (props) => {
  const { t, files, setFiles, setStep } = props

  const onForwardButtonClick = () => {
    setStep('generate')
  }

  const onBackButtonClick = () => {
    setStep('select')
  }

  return <div>
    <PDFEditor {...props} />
    <Hovedknapp
      id='a-buc-c-sedattachmnents__next-button-id'
      className='a-buc-c-sedattachmnents__next-button'
      onClick={onForwardButtonClick}>
      {t('ui:next')}
    </Hovedknapp>
    <Flatknapp
      id='a-buc-c-sedattachmnents__next-button-id'
      className='a-buc-c-sedattachmnents__next-button'
      onClick={onBackButtonClick}>
      {t('ui:back')}
    </Flatknapp>
  </div>
}

Step2.propTypes = {
  actions: PT.object,
  t: PT.func.isRequired,
  setFiles: PT.func.isRequired
}

export default Step2
