import React, { useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import { Stegindikator } from 'components/ui/Nav'
import AdvarselTrekant from 'resources/images/AdvarselTrekant'

const steps = ['select', 'edit', 'generate']

const StepIndicator = (props) =>  {

  const { t, files, recipe, step, setStep } = props
  const [ message, setMessage ] = useState(undefined)
  const [ stepIndicator, setStepIndicator ] = useState(steps.indexOf(step))

  const hasOnlyEmptyArrays = (obj) => {
    var emptyArrayMembers = _.filter(obj, (it) => {
      return !it || (_.isArray(it) && _.isEmpty(it))
    })
    return emptyArrayMembers.length === Object.keys(obj).length
  }

  const onBeforeChange = (nextStep) => {

    if (nextStep === stepIndicator) {
      return false
    }

    if (nextStep === 1 && _.isEmpty(files)) {
      setMessage(t('pdf:alert-invalidStep1'))
      return false
    }

    if (nextStep === 2 && hasOnlyEmptyArrays(recipe)) {
      setMessage(t('pdf:alert-invalidStep2'))
      return false
    }

    setMessage(undefined)
    return true
  }

  const onChange = (nextStep) => {
    setStepIndicator(nextStep)
    setStep(steps[nextStep])
  }

  return <React.Fragment>
    <Stegindikator
      visLabel
      onBeforeChange={onBeforeChange}
      onChange={onChange}
      autoResponsiv
      className='mb-4'
      steg={[
        { label: t('pdf:form-step0'), aktiv: (stepIndicator === 0) },
        { label: t('pdf:form-step1'), aktiv: (stepIndicator === 1) },
        { label: t('pdf:form-step2'), aktiv: (stepIndicator === 2) }
      ]} />
    {message ? <div className='w-100 text-center mb-2'>
      <AdvarselTrekant size={16} />
      <span className='ml-2'>{message}</span>
    </div> : null}
  </React.Fragment>
}

StepIndicator.propTypes = {
  t: PT.func.isRequired,
  files: PT.array,
  recipe: PT.object,
  step: PT.string.isRequired,
  setStep: PT.func.isRequired
}

export default StepIndicator
