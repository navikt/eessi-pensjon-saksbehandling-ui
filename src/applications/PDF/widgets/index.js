import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { connect, bindActionCreators } from 'store'
import * as pdfActions from 'actions/pdf'
import * as appActions from 'actions/app'
import * as uiActions from 'actions/ui'
import * as storageActions from 'actions/storage'

import StepIndicator from 'applications/PDF/components/StepIndicator'
import SelectPDF from './SelectPDF'
import EditPDF from './EditPDF'
import GeneratePDF from './GeneratePDF'

import './index.css'

const mapStateToProps = (state) => {
  return {
    loadingPDF: state.loading.loadingPDF,
    language: state.ui.language,
    files: state.pdf.files,
    recipe: state.pdf.recipe,
    dndTarget: state.pdf.dndTarget,
    generatingPDF: state.loading.generatingPDF,
    generatedPDFs: state.pdf.generatedPDFs,
    watermark: state.pdf.watermark,
    pageScale: state.pdf.pageScale
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...pdfActions, ...appActions, ...uiActions, ...storageActions }, dispatch)
  }
}

export const PDFWidgetIndex = (props) => {
  const { t, recipe, files } = props
  const [step, setStep] = useState('select')

  return (
    <div className='a-pdf-widget'>
      <StepIndicator t={t} step={step} setStep={setStep} recipe={recipe} files={files} />
      {step === 'select' ? <SelectPDF {...props} setStep={setStep} /> : null}
      {step === 'edit' ? <EditPDF {...props} setStep={setStep} /> : null}
      {step === 'generate' ? <GeneratePDF {...props} setStep={setStep} /> : null}
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(PDFWidgetIndex))
