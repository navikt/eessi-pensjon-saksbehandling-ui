import React, { useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { Icons, Nav } from 'eessi-pensjon-ui'
import AttachmentStep1 from './AttachmentStep1'
import AttachmentStep2 from './AttachmentStep2'

const SEDAttachments = (props) => {
  const { initialStep = 1, open = false, onOpen, t } = props
  const [step, setStep] = useState(initialStep)

  const handleButtonClick = () => {
    if (_(onOpen).isFunction()) {
      onOpen()
    }
  }

  return (
    <div className='a-buc-c-sedattachments'>
      {!open ? (
        <Nav.Knapp
          id='a-buc-c-sedattachments__enable-button-id'
          className='a-buc-c-sedattachments__enable-button'
          label={t('buc:form-enableAttachments')}
          onClick={handleButtonClick}
        >
          <div className='d-flex'>
            <Icons className='mr-2' kind='tilsette' />
            <span>{t('ui:addAttachments')}</span>
          </div>
        </Nav.Knapp>
      ) : null}
      {open && step === 1 ? <AttachmentStep1 setStep={setStep} {...props} /> : null}
      {open && step === 2 ? <AttachmentStep2 setStep={setStep} {...props} /> : null}
    </div>
  )
}

SEDAttachments.propTypes = {
  open: PT.bool,
  onOpen: PT.func,
  onSubmit: PT.func,
  t: PT.func.isRequired,
  initialStep: PT.number
}

export default SEDAttachments
