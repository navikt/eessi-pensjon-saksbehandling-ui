import React, { useState } from 'react'
import PT from 'prop-types'
import { Knapp, Stegindikator, Undertittel } from 'components/ui/Nav'
import Icons from 'components/ui/Icons'
import Step1 from './Step1'
import Step2 from './Step2'

const SEDAttachments = (props) => {
  const { t } = props
  const [ step, setStep ] = useState(0)
  const [ enableAttachments, setEnableAttachments ] = useState(false)

  return <div className='a-buc-c-sedattachments'>
    <Undertittel className='mb-2'>{t('ui:attachments')}</Undertittel>
    {!enableAttachments ? <Knapp
      id='a-buc-c-sedattachments__enable-button-id'
      className='a-buc-c-sedattachments__enable-button'
      label={t('buc:form-enableAttachments')}
      onClick={() => setEnableAttachments(!enableAttachments)}>
        <div className='d-flex'>
          <Icons className='mr-2' kind='tilsette'/>
          <span>{t('ui:addAttachments')}</span>
        </div>
      </Knapp> : null}
    {enableAttachments && step === 1
      ? <Stegindikator
        visLabel
        autoResponsiv
        steg={[
          { label: t('buc:attachments-step0'), aktiv: (step === 0) },
          { label: t('buc:attachments-step1'), aktiv: (step === 1) },
          { label: t('buc:attachments-step2'), aktiv: (step === 2) }
        ]} /> : null}
    {enableAttachments && step === 0 ? <Step1 setStep={setStep} {...props} /> : null}
    {enableAttachments && step === 1 ? <Step2 setStep={setStep} {...props} /> : null}
  </div>
}

SEDAttachments.propTypes = {
  t: PT.func.isRequired
}

export default SEDAttachments
