import React, { useState } from 'react'
import { connect, bindActionCreators } from 'store'
import Step1 from './Step1'
import Step2 from './Step2'
import * as bucActions from 'actions/buc'
import * as uiActions from 'actions/ui'
import * as storageActions from 'actions/storage'
import { getDisplayName } from 'utils/displayName'

export const mapStateToProps = (state) => {
  return {
    buc: state.buc.buc,
    countryList: state.buc.countryList,
    institutionList: state.buc.institutionList,
    loading: state.loading,
    locale: state.ui.locale,
    sed: state.buc.sed,
    sedList: state.buc.sedList,
    p4000info: state.buc.p4000info
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({...storageActions, ...bucActions, ...uiActions}, dispatch) }
}

const SEDStart = (props) => {

  const [ step, setStep ] = useState(0)
  const [ _sed, setSed ] = useState(undefined)

  const nextStep = () => {
    setStep(step + 1)
  }

  const backStep = () => {
    setStep(step - 1)
  }

  if (step === 0) {
    return <Step1 nextStep={nextStep} backStep={backStep} _sed={_sed} setSed={setSed} {...props}/>
  }

  if (step === 1) {
    return <Step2 nextStep={nextStep} backStep={backStep} _sed={_sed} setSed={setSed} {...props}/>
  }

  return null
}

const ConnectedSEDStart = connect(mapStateToProps, mapDispatchToProps)(SEDStart)
ConnectedSEDStart.displayName = `Connect(${getDisplayName(SEDStart)})`
export default ConnectedSEDStart
