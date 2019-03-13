import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import Export from '../../components/ui/Export/Export'
import RenderPrintData from '../../components/case/RenderPrintData'

import * as Nav from '../../components/ui/Nav'

import * as caseActions from '../../actions/case'
import * as statusActions from '../../actions/status'
import * as appActions from '../../actions/app'

const mapStateToProps = (state) => {
  return {
    savedData: state.case.savedData,
    sentData: state.case.sentData,
    rinaUrl: state.case.rinaUrl,
    step: state.case.step,
    sendingCase: state.loading.sendingCase,
    rinaLoading: state.loading.rinaUrl
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, statusActions, caseActions, appActions), dispatch) }
}

class SaveSendCase extends Component {
    state = {}

    componentDidMount () {
      let { actions, rinaUrl } = this.props
      if (!rinaUrl) {
        actions.getRinaUrl()
      }
    }

    onSendButtonClick () {
      const { actions, savedData } = this.props

      let payload = {
        subjectArea: savedData.subjectArea,
        sakId: savedData.sakId,
        aktoerId: savedData.aktoerId,
        buc: savedData.buc,
        sed: savedData.sed,
        institutions: savedData.institutions,
        sendsed: true,
        caseId: savedData.caseId,
        documentId: savedData.documentId
      }

      actions.sendSed(payload)
    }

    onCreateNewUnsetRinaIdButtonClick () {
      const { actions, sentData } = this.props
      actions.unsetStatusParam('rinaId')
      actions.clearData()
    }

    onCreateNewUnsetSakIdAktoerIdButtonClick () {
      const { actions } = this.props
      actions.unsetStatusParam('sakId')
      actions.unsetStatusParam('aktoerId')
      actions.clearData()
    }

    render () {
      let { t, sendingCase, savedData, rinaLoading, rinaUrl } = this.props

      let buttonText = sendingCase ? t('case:loading-sendingCase') : t('ui:confirmAndSend')

      return <div>
        <div className='fieldset animate text-center'>
          { rinaLoading ? <span>{t('case:loading-rinaUrl')}</span>
            : (rinaUrl && savedData && savedData.caseId ? <div>
              <div className='m-4'><a href={rinaUrl + savedData.caseId}>{t('case:form-caseLink')}</a></div>
              <div className='m-4'>
                <h4>{t('case:form-rinaId') + ': ' + savedData.caseId}</h4>
              </div>
              <RenderPrintData t={t} data={savedData} />
              <Export fileName='kvittering.pdf' nodeId='divToPrint' buttonLabel={t('ui:getReceipt')} />
            </div> : null)}
        </div>

        <div className='mb-4 p-4'>
          <Nav.Hovedknapp className='sendButton mr-3' disabled={sendingCase} spinner={sendingCase} onClick={this.onSendButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
          <Nav.Knapp className='mr-3 createNewUnsetSakIdAktoerIdButton' onClick={this.onCreateNewUnsetSakIdAktoerIdButtonClick.bind(this)}>{t('case:button-createNewUnsetSakIdAktoerId')}</Nav.Knapp>
          <Nav.Knapp className='createNewUnsetRinaIdButton' onClick={this.onCreateNewUnsetRinaIdButtonClick.bind(this)}>{t('case:button-createNewUnsetRinaId')}</Nav.Knapp>
        </div>
      </div>
    }
}

SaveSendCase.propTypes = {
  actions: PT.object,
  history: PT.object,
  location: PT.object,
  savedData: PT.object,
  sentData: PT.bool,
  sendingCase: PT.bool,
  t: PT.func,
  rinaLoading: PT.bool,
  rinaUrl: PT.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(SaveSendCase)
)
