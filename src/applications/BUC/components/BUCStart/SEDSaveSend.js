import React, { useState, useEffect } from 'react'
import { connect, bindActionCreators } from 'store'
import PT from 'prop-types'

import Export from 'components/ui/Export/Export'
import * as Nav from 'components/ui/Nav'

import * as bucActions from 'actions/buc'
import * as statusActions from 'actions/status'
import * as appActions from 'actions/app'

export const mapStateToProps = (state) => {
  return {
    savedData: state.buc.savedData,
    previewData: state.buc.previewData,
    rinaUrl: state.buc.rinaUrl,
    sendingCase: state.loading.sendingCase,
    rinaLoading: state.loading.rinaUrl
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, statusActions, bucActions, appActions), dispatch) }
}

const SEDSaveSend = (props) => {
  const { t, actions } = props
  const { savedData, rinaUrl, sendingCase, rinaLoading } = props
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted && !rinaUrl) {
      actions.getRinaUrl()
      setMounted(true)
    }
  }, [rinaUrl])

  const onSendButtonClick = () => {
    let payload = {
      sendsed: true,
      caseId: savedData.caseId,
      documentId: savedData.documentId
    }
    actions.sendSed(payload)
  }

  const onCreateNewUnsetRinaIdButtonClick = () => {
    actions.unsetStatusParam('rinaId')
    actions.clearData()
  }

  const onCreateNewUnsetSakIdAktoerIdButtonClick = () => {
    actions.unsetStatusParam('sakId')
    actions.unsetStatusParam('aktoerId')
    actions.clearData()
  }

  const buttonText = sendingCase ? t('buc:loading-sendingCase') : t('ui:send')

  return <React.Fragment>
    <div className='fieldset animate text-center'>
      { rinaLoading ? <span>{t('buc:loading-rinaUrl')}</span>
        : (rinaUrl && savedData && savedData.caseId ? <div>
          <div className='m-4'><a target='_blank' rel='noopener noreferrer' href={rinaUrl + savedData.caseId}>{t('buc:form-caseLink')}</a></div>
          <div className='m-4'>
            <h4>{t('buc:form-rinaId') + ': ' + savedData.caseId}</h4>
          </div>
          <Export fileName='kvittering.pdf' nodeId='divToPrint' buttonLabel={t('ui:getReceipt')} />
        </div> : null)}
    </div>

    <div className='mb-4 p-4'>
      <Nav.Hovedknapp className='sendButton mr-3' disabled={sendingCase} spinner={sendingCase} onClick={onSendButtonClick}>{buttonText}</Nav.Hovedknapp>
      <Nav.Knapp className='mr-3 createNewUnsetSakIdAktoerIdButton' onClick={onCreateNewUnsetSakIdAktoerIdButtonClick}>{t('buc:button-createNewUnsetSakIdAktoerId')}</Nav.Knapp>
      <Nav.Knapp className='createNewUnsetRinaIdButton' onClick={onCreateNewUnsetRinaIdButtonClick}>{t('buc:button-createNewUnsetRinaId')}</Nav.Knapp>
    </div>
  </React.Fragment>
}

SEDSaveSend.propTypes = {
  actions: PT.object,
  history: PT.object,
  location: PT.object,
  savedData: PT.object,
  sendingCase: PT.bool,
  t: PT.func,
  rinaLoading: PT.bool,
  rinaUrl: PT.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SEDSaveSend)
