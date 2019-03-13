import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'

import * as Nav from '../../components/ui/Nav'
import P6000 from '../../components/p6000/P6000'
import RenderData from '../../components/case/RenderData'

import * as caseActions from '../../actions/case'
import * as uiActions from '../../actions/ui'

const mapStateToProps = (state) => {
  return {
    step: state.case.step,
    previewData: state.case.previewData,
    language: state.ui.language,
    previewingCase: state.loading.previewingCase,
    savingCase: state.loading.savingCase,
    p6000data: state.p6000.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, caseActions, uiActions), dispatch) }
}

class PreviewCase extends Component {
  onBackButtonClick () {
    const { actions, step } = this.props
    actions.setStep(step - 1)
  }

  onPreviewButtonClick () {
    const { actions, previewData } = this.props
    actions.getMorePreviewData(previewData)
  }

  onForwardButtonClick () {
    const { actions, previewData, p6000data } = this.props

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

  render () {
    const { t, previewData, previewingCase, savingCase } = this.props

    return <div>
      <div className='fieldset animate'>
        { previewData.sed === 'P2000' ? <React.Fragment>
          <RenderData previewData={previewData} />
          <Nav.Hovedknapp className='fetchButton' disabled={previewingCase} spinner={previewingCase} onClick={this.onPreviewButtonClick.bind(this)}>
            {previewingCase ? t('case:loading-previewingCase') : t('ui:preview')}
          </Nav.Hovedknapp>
        </React.Fragment> : null}
        { previewData.sed === 'P6000' ? <P6000 /> : null }
      </div>
      <div className='mb-4 p-4'>
        <Nav.Knapp className='forwardButton' disabled={savingCase} spinner={savingCase} onClick={this.onForwardButtonClick.bind(this)}>
          {savingCase ? t('case:loading-savingCase') : t('ui:confirmAndSave')}</Nav.Knapp>
        <Nav.Flatknapp className='ml-3 backButton' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Flatknapp>
      </div>
    </div>
  }
}

PreviewCase.propTypes = {
  actions: PT.object.isRequired,
  previewingCase: PT.bool,
  savingCase: PT.bool,
  t: PT.func.isRequired,
  previewData: PT.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(PreviewCase)
)
