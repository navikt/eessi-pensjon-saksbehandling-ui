import React, { useState } from 'react'
import { connect, bindActionCreators } from 'store'
import Step1 from './Step1'
import Step2 from './Step2'
import * as bucActions from 'actions/buc'
import { getDisplayName } from 'utils/displayName'

export const mapStateToProps = (state) => {
  return {
    attachments: state.buc.attachments,
    buc: state.buc.buc,
    countryList: state.buc.countryList,
    institutionList: state.buc.institutionList,
    loading: state.loading,
    locale: state.ui.locale,
    sed: state.buc.sed,
    sedList: state.buc.sedList
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(bucActions, dispatch) }
}

const SEDStart = (props) => {

  const [ step, setStep ] = useState(0)

  const nextStep = () => {
    setStep(step + 1)
  }

  const backStep = () => {
    setStep(step - 1)
  }

  if (step === 0) {
    return <Step1 nextStep={nextStep} backStep={backStep} {...props}/>
  }

  if (step === 1) {
    return <Step2 nextStep={nextStep} backStep={backStep} {...props}/>
  }

  return null
}

const ConnectedSEDStart = connect(mapStateToProps, mapDispatchToProps)(SEDStart)
ConnectedSEDStart.displayName = `Connect(${getDisplayName(SEDStart)})`
export default ConnectedSEDStart
