import React from 'react'
import { connect, bindActionCreators } from 'store'
import PT from 'prop-types'

import * as Nav from 'components/ui/Nav'
import P6000 from 'components/p6000/P6000'
import RenderData from 'applications/BUC/components/RenderData/RenderData'

import * as bucActions from 'actions/buc'
import * as uiActions from 'actions/ui'

export const mapStateToProps = (state) => {
  return {
    step: state.buc.step,
    previewData: state.buc.previewData,
    previewingCase: state.loading.previewingCase,
    savingCase: state.loading.savingCase,
    p6000data: state.p6000.data
  }
}

export const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, bucActions, uiActions), dispatch) }
}

const SEDPreview = (props) => {
  const { step, previewData, previewingCase, savingCase, p6000data } = props
  const { t, actions } = props

  const onBackButtonClick = () => {
    actions.setStep(step - 1)
  }

  const onPreviewButtonClick = () => {
    actions.getMorePreviewData(previewData)
  }

  const onForwardButtonClick = () => {
    let data = Object.assign({}, previewData)
    if (previewData.sed === 'P6000') {
      data.P6000 = Object.assign({}, p6000data)
    }
    data.euxCaseId = data.rinaId
    if (!data.euxCaseId) {
      actions.createSed(data)
    } else {
      actions.addToSed(data)
    }
  }

  return <div>
    <div className='fieldset animate'>
      { previewData.sed === 'P2000' ? <React.Fragment>
        <RenderData {...props} />
        <Nav.Hovedknapp className='fetchButton' disabled={previewingCase} spinner={previewingCase} onClick={onPreviewButtonClick}>
          {previewingCase ? t('buc:loading-previewingCase') : t('ui:preview')}
        </Nav.Hovedknapp>
      </React.Fragment> : null}
      { previewData.sed === 'P6000' ? <P6000 /> : null }
    </div>
    <div className='mb-4 p-4'>
      <Nav.Knapp className='forwardButton' disabled={savingCase || !previewData} spinner={savingCase} onClick={onForwardButtonClick}>
        {savingCase ? t('buc:loading-savingCase') : t('ui:confirmAndSave')}</Nav.Knapp>
      <Nav.Flatknapp className='ml-3 backButton' type='standard' onClick={onBackButtonClick}>{t('ui:back')}</Nav.Flatknapp>
    </div>
  </div>
}

SEDPreview.propTypes = {
  actions: PT.object.isRequired,
  previewingCase: PT.bool,
  savingCase: PT.bool,
  t: PT.func.isRequired,
  previewData: PT.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SEDPreview)
