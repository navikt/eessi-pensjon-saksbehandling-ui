import React, { useState, useEffect } from 'react'
import { connect, bindActionCreators } from 'store'
import _ from 'lodash'
import Step1 from './Step1'
import Step2 from './Step2'
import { Flatknapp, Hovedknapp, Row } from 'components/Nav'
import * as bucActions from 'actions/buc'
import * as uiActions from 'actions/ui'
import * as storageActions from 'actions/storage'
import { getDisplayName } from 'utils/displayName'
import PInfoUtil from 'applications/BUC/components/SEDP4000/Util'

export const mapStateToProps = (state) => {
  return {
    attachments: state.buc.attachments,
    buc: state.buc.buc,
    bucsInfoList: state.buc.bucsInfoList,
    countryList: state.buc.countryList,
    institutionList: state.buc.institutionList,
    loading: state.loading,
    locale: state.ui.locale,
    sed: state.buc.sed,
    sedList: state.buc.sedList,
    p4000info: state.buc.p4000info,
    avdodfnr: state.app.params.avdodfnr
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({ ...storageActions, ...bucActions, ...uiActions }, dispatch) }
}

const SEDStart = (props) => {
  const { actions, aktoerId, avdodfnr, attachments, buc, bucsInfoList, countryList, institutionList } = props
  const { loading, p4000info, sakId, sed, t, vedtakId } = props

  const [_sed, setSed] = useState(undefined)
  const [_institutions, setInstitutions] = useState([])
  const [_countries, setCountries] = useState([])
  const [_vedtakId, setVedtakId] = useState(parseInt(vedtakId, 10))
  const [_attachments, setAttachments] = useState({})

  const [step, setStep] = useState(0)
  const [validation, setValidation] = useState({})
  const [showButtons, setShowButtons] = useState(true)

  const [sedSent, setSedSent] = useState(false)
  const [sendingAttachments, setSendingAttachments] = useState(false)
  const [attachmentsSent, setAttachmentsSent] = useState(false)

  useEffect(() => {
    if (_.isEmpty(countryList) && !loading.gettingCountryList) {
      actions.getCountryList()
    }
  }, [actions, countryList, loading])

  useEffect(() => { actions.getSedList(buc) }, [])

  useEffect(() => {
    if (sed && !sedSent) {
      setSedSent(true)
    }
  }, [sed, sedSent])

  useEffect(() => {
    if (sedSent && !attachmentsSent) {
      if (!sendingAttachments) {
        setSendingAttachments(true)
        if (_.isEmpty(_attachments) || !_attachments.joark || _.isEmpty(_attachments.joark)) {
          setAttachmentsSent(true)
          setSendingAttachments(false)
          return
        }
        _attachments.joark.forEach(attachment => {
          const params = {
            aktoerId: aktoerId,
            rinaId: buc.caseId,
            rinaDokumentId: sed.id,
            joarkJournalpostId: attachment.journalpostId,
            joarkDokumentInfoId: attachment.dokumentInfoId,
            variantFormat: attachment.variant
          }
          console.log('sending ', params)
          actions.sendAttachmentToSed(params)
        })
        return
      }
      if (attachments && _attachments.joark.length === attachments.length) {
        setAttachmentsSent(true)
        setSendingAttachments(false)
      }
    }
  }, [_attachments, actions, aktoerId, attachments, attachmentsSent, buc, sed, sedSent, sendingAttachments])

  useEffect(() => {
    if (sedSent && attachmentsSent) {
      actions.resetSed()
      actions.fetchBucs(aktoerId)
      if(avdodfnr){
        actions.fetchBucs(avdodfnr)
      }
      if (!_.isEmpty(bucsInfoList) && bucsInfoList.indexOf(aktoerId + '___BUC___INFO') >= 0) {
        actions.fetchBucsInfo(aktoerId + '___BUC___INFO')
      }
      actions.setMode('bucedit')
    }
  }, [attachmentsSent, aktoerId, avdodfnr, actions, sedSent])

  const sedNeedsVedtakId = () => {
    return _sed === 'P5000' || _sed === 'P6000' || _sed === 'P7000'
  }

  const convertInstitutionIDsToInstitutionObjects = () => {
    const institutions = []
    _institutions.forEach(item => {
      Object.keys(institutionList).forEach(landkode => {
        const found = _.find(institutionList[landkode], { id: item })
        if (found) {
          institutions.push({
            country: found.landkode,
            institution: found.id,
            name: found.navn
          })
        }
      })
    })
    return institutions
  }

  const onForwardButtonClick = () => {
    if (_.isEmpty(validation)) {
      const institutions = convertInstitutionIDsToInstitutionObjects()
      const payload = {
        sakId: sakId,
        buc: buc.type,
        sed: _sed,
        institutions: institutions,
        aktoerId: aktoerId,
        euxCaseId: buc.caseId,
        attachments: attachments
      }

      if (_sed === 'P4000' && p4000info) {
        const periods = new PInfoUtil(p4000info.stayAbroad).generatePayload()
        payload.periodeInfo = periods.periodeInfo
      }
      if (sedNeedsVedtakId()) {
        payload.vedtakId = _vedtakId
      }
      if (avdodfnr) {
        payload.avdodfnr = avdodfnr
      }
      actions.createSed(payload)
    }
  }

  const onNextButtonClick = () => {
    setStep(step + 1)
  }

  const onBackButtonClick = () => {
    setStep(step - 1)
  }

  const onCancelButtonClick = () => {
    actions.resetSed()
    actions.setMode('bucedit')
  }

  const createSEDneedsMoreSteps = () => {
    return step === 0 && _sed === 'P4000'
  }

  const allowedToForward = () => {
    if (step === 0) {
      return _sed && _.isEmpty(validation) && !_.isEmpty(_institutions) &&
       !loading.creatingSed && !sendingAttachments &&
       (sedNeedsVedtakId() ? _.isNumber(_vedtakId) && !_.isNaN(_vedtakId) : true)
    }
    if (step === 1) {
      return _sed === 'P4000' ? p4000info && !_.isEmpty(p4000info.stayAbroad) : true
    }
    return false
  }

  return <Row className='a-buc-c-sedstart'>
    { step === 0 ? <Step1
      _sed={_sed} setSed={setSed}
      _countries={_countries} setCountries={setCountries}
      _institutions={_institutions} setInstitutions={setInstitutions}
      _attachments={_attachments} setAttachments={setAttachments}
      validation={validation} setValidation={setValidation}
      sedNeedsVedtakId={sedNeedsVedtakId}
      vedtakId={_vedtakId} setVedtakId={setVedtakId}
      {...props} /> : null}
    { step === 1 ? <Step2
      _sed={_sed}
      showButtons={showButtons} setShowButtons={setShowButtons}
      validation={validation} setValidation={setValidation}
      {...props} /> : null }
    { showButtons ? <div className='col-md-12 mt-4'>
      <Hovedknapp
        id='a-buc-c-sedstart__forward-button-id'
        className='a-buc-c-sedstart__forward-button'
        disabled={!allowedToForward()}
        spinner={loading.creatingSed || sendingAttachments}
        onClick={createSEDneedsMoreSteps() ? onNextButtonClick : onForwardButtonClick}>
        {loading.creatingSed ? t('buc:loading-creatingSED')
          : sendingAttachments ? t('buc:loading-sendingSEDattachments')
            : createSEDneedsMoreSteps() ? t('ui:next')
              : t('buc:form-orderSED')}
      </Hovedknapp>
      {step > 0 ? <Flatknapp
        id='a-buc-c-sedstart__back-button-id'
        className='a-buc-c-sedstart__back-button'
        onClick={onBackButtonClick}>{t('ui:back')}
      </Flatknapp> : null}
      <Flatknapp
        id='a-buc-c-sedstart__cancel-button-id'
        className='a-buc-c-sedstart__cancel-button'
        onClick={onCancelButtonClick}>{t('ui:cancel')}</Flatknapp>
    </div> : null }
  </Row>
}

const ConnectedSEDStart = connect(mapStateToProps, mapDispatchToProps)(SEDStart)
ConnectedSEDStart.displayName = `Connect(${getDisplayName(SEDStart)})`
export default ConnectedSEDStart
