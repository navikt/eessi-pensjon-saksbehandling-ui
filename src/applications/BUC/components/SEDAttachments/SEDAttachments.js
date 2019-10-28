import React, { useState } from 'react'
import PT from 'prop-types'
import { Icons, Nav } from 'eessi-pensjon-ui'
import AttachmentStep1 from './AttachmentStep1'
import AttachmentStep2 from './AttachmentStep2'

const SEDAttachments = (props) => {
  const { t, initialStep = 1 } = props
  const [step, setStep] = useState(initialStep)
  const [enableAttachments, setEnableAttachments] = useState(false)

  return (
    <div className='a-buc-c-sedattachments'>
      {enableAttachments && step === 1 ? (
        <Nav.Undertittel className='mt-4 mb-3'>
          {t('buc:form-addAttachmentsFromJOARK')}
        </Nav.Undertittel>
      ) : null}
      {!enableAttachments ? (
        <Nav.Knapp
          id='a-buc-c-sedattachments__enable-button-id'
          className='a-buc-c-sedattachments__enable-button'
          label={t('buc:form-enableAttachments')}
          onClick={() => setEnableAttachments(!enableAttachments)}
        >
          <div className='d-flex'>
            <Icons className='mr-2' kind='tilsette' />
            <span>{t('ui:addAttachments')}</span>
          </div>
        </Nav.Knapp>
      ) : null}
      {enableAttachments && step === 1 ? <AttachmentStep1 setStep={setStep} {...props} /> : null}
      {enableAttachments && step === 2 ? <AttachmentStep2 setStep={setStep} {...props} /> : null}
    </div>
  )
}

SEDAttachments.propTypes = {
  t: PT.func.isRequired,
  initialStep: PT.number
}

export default SEDAttachments
