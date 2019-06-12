import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import JoarkBrowser from 'components/ui/JoarkBrowser/JoarkBrowser'
import PDFEditor from 'applications/PDF/components/PDFEditor/PDFEditor'
import { Ingress, Stegindikator, Checkbox } from 'components/ui/Nav'

const SEDAttachments = (props) => {

  const { t, setFiles } = props
  const [ step, setStep ] = useState(0)
  const [ enableAttachments, setEnableAttachments ] = useState(false)

  const onChange = () => {
    setEnableAttachments(!enableAttachments)
  }

  return <div className='a-buc-c-sedattachmnents'>
    <Ingress className='mb-2'>{t('buc:form-addAttachmentsFromJOARK')}</Ingress>
    <Checkbox label={t('buc:form-enableAttachments')}
      onChange={onChange}
      checked={enableAttachments} />
    {enableAttachments ?
      <Stegindikator
        visLabel
        autoResponsiv
        steg={[
          { label: t('buc:attachments-step0'), aktiv: (step === 0) },
          { label: t('buc:attachments-step1'), aktiv: (step === 1) },
          { label: t('buc:attachments-step2'), aktiv: (step === 2) }
        ]} /> : null}
      {enableAttachments && step === 0 ? <div>
        <JoarkBrowser {...props}/>
      </div> : null}
      {enableAttachments && step === 1 ? <div>
        <PDFEditor {...props}/>
      </div> : null}
  </div>
}

SEDAttachments.propTypes = {
  actions: PT.object,
  t: PT.func.isRequired,
  setFiles: PT.func.isRequired
}

export default SEDAttachments
