import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import { Stegindikator, Checkbox, Hovedknapp } from 'components/ui/Nav'
import Step1 from './Step1'
import Step2 from './Step2'

const SEDAttachments = (props) => {
  const { t, files, setFiles } = props
  const [ step, setStep ] = useState(0)
  const [ enableAttachments, setEnableAttachments ] = useState(false)

  const onChange = () => {
    setEnableAttachments(!enableAttachments)
  }

  return <div className='a-buc-c-sedattachmnents'>
    <Checkbox label={t('buc:form-enableAttachments')}
      onChange={onChange}
      checked={enableAttachments} />
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
  actions: PT.object,
  t: PT.func.isRequired,
  setFiles: PT.func.isRequired
}

export default SEDAttachments
