import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import _ from 'lodash'
import Step1 from './Step1'
import Step2 from './Step2'
import { Nav } from 'eessi-pensjon-ui'
import * as bucActions from 'actions/buc'
import * as uiActions from 'actions/ui'
import * as storageActions from 'actions/storage'
import SEDAttachmentSender from 'applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender'
import PInfoUtil from 'applications/BUC/components/SEDP4000/P4000Payload'
import { IS_TEST } from 'constants/environment'
import * as storage from 'constants/storage'

const mapStateToProps = /* istanbul ignore next */ (state) => {
  return {
    attachments: state.buc.attachments,
    bucsInfoList: state.buc.bucsInfoList,
    countryList: state.buc.countryList,
    institutionList: state.buc.institutionList,
    attachmentsError: state.buc.attachmentsError,
    loading: state.loading,
    locale: state.ui.locale,
    sed: state.buc.sed,
    sedList: state.buc.sedList,
    p4000info: state.buc.p4000info,
    avdodfnr: state.app.params.avdodfnr
  }
}

const mapDispatchToProps = /* istanbul ignore next */ (dispatch) => {
  return { actions: bindActionCreators({ ...storageActions, ...bucActions, ...uiActions }, dispatch) }
}

export const SEDStart = (props) => {
  const { actions, aktoerId, avdodfnr, attachments, attachmentsError, bucs, bucsInfoList, countryList, currentBuc, currentSed } = props
  const { initialAttachments = {}, initialSed = undefined, initialStep = 0, institutionList, institutionNames } = props
  const { loading, p4000info, sakId, sed, setMode, t, vedtakId } = props

  const [_sed, setSed] = useState(initialSed)
  const [_institutions, setInstitutions] = useState(
    bucs[currentBuc] && bucs[currentBuc].institusjon
      ? bucs[currentBuc].institusjon
        .filter(inst => inst.institution !== bucs[currentBuc].creator.institution)
        .map(inst => inst.institution) : [])
  const [_countries, setCountries] = useState(
    bucs[currentBuc] && bucs[currentBuc].institusjon
      ? _.uniq(bucs[currentBuc].institusjon.map(inst => inst.country)) : [])
  const [_vedtakId, setVedtakId] = useState(parseInt(vedtakId, 10))
  const [_attachments, setAttachments] = useState(initialAttachments)
  const [step, setStep] = useState(initialStep)
  const [validation, setValidation] = useState({})

  const [showButtons, setShowButtons] = useState(true)
  const [sedSent, setSedSent] = useState(false)
  const [sendingAttachments, setSendingAttachments] = useState(false)
  const [attachmentsSent, setAttachmentsSent] = useState(false)
  const [mounted, setMounted] = useState(false)

  const buc = _.cloneDeep(bucs[currentBuc])

  useEffect(() => {
    if (_.isEmpty(countryList) && !loading.gettingCountryList) {
      actions.getCountryList(buc.type)
    }
  }, [actions, countryList, loading])

  useEffect(() => {
    if (!mounted) {
      if (!currentSed || !currentBuc) {
        actions.getSedList(buc)
      } else {
        actions.setSedList(
          bucs[currentBuc].seds
            .filter(sed => sed.parentDocumentId === currentSed)
            .map(sed => sed.type)
        )
      }
      setMounted(true)
    }
  }, [mounted, actions, buc, bucs, currentBuc, currentSed])

  useEffect(() => {
    // mark sed as sent
    if (sed && !sedSent) {
      setSedSent(true)
    }
  }, [sed, sedSent])

  useEffect(() => {
    // if sed is sent, we can start sending attachments
    if (sedSent && !attachmentsSent) {
      // no attachments to send - conclude
      if (_.isEmpty(_attachments) || !_attachments.joark || _.isEmpty(_attachments.joark)) {
        if (!IS_TEST) {
          console.log('SEDStart: No attachments to send, concluding')
        }
        setAttachmentsSent(true)
        return
      }
      // mark state as sending attachments
      setSendingAttachments(true)
      if (!IS_TEST) {
        console.log('SEDStart: Marking setSendingAttachments as true')
      }
    }
  }, [_attachments, attachmentsSent, sedSent])

  useEffect(() => {
    // cleanup after attachments sent
    if (sedSent && attachmentsSent) {
      if (!IS_TEST) {
        console.log('SEDStart: Attachments sent, cleaning up')
      }
      actions.resetSed()
      actions.resetSedAttachments()
      actions.fetchBucs(aktoerId)
      if (avdodfnr) {
        actions.fetchBucs(avdodfnr)
      }
      if (!_.isEmpty(bucsInfoList) &&
        bucsInfoList.indexOf(aktoerId + '___' + storage.NAMESPACE_BUC + '___' + storage.FILE_BUCINFO) >= 0) {
        actions.fetchBucsInfo(aktoerId, storage.NAMESPACE_BUC, storage.FILE_BUCINFO)
      }
      setMode('bucedit')
    }
  }, [actions, aktoerId, attachmentsSent, avdodfnr, bucsInfoList, sedSent, setMode])

  if (_.isEmpty(bucs) || !currentBuc) {
    return null
  }

  const bucHasSedsWithAtLeastOneInstitution = () => {
    if (buc.seds) {
      return _(buc.seds).find(sed => {
        return _.isArray(sed.participants) && !_.isEmpty(sed.participants)
      }) !== undefined
    }
    return false
  }

  const sedNeedsVedtakId = () => {
    return _sed === 'P6000' || _sed === 'P7000'
  }

  const sedCanHaveAttachments = () => {
    const sedsWithoutAttachments = ['P4000', 'P5000', 'P7000', 'H070']
    return _sed !== undefined && !_.includes(sedsWithoutAttachments, _sed)
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
        euxCaseId: buc.caseId
      }

      if (_sed === 'P4000' && p4000info) {
        const periods = new PInfoUtil(p4000info.stayAbroad, t).generatePayload()
        payload.periodeInfo = periods.periodeInfo
      }
      if (sedNeedsVedtakId()) {
        payload.vedtakId = _vedtakId
      }
      if (avdodfnr) {
        payload.avdodfnr = avdodfnr
      }
      if (currentSed) {
        actions.createReplySed(payload, currentSed)
      } else {
        actions.createSed(payload)
      }
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
    setMode('bucedit')
  }

  const createSedNeedsMoreSteps = () => {
    return false // _sed === 'P4000'
  }

  const allowedToForward = () => {
    if (step === 0) {
      return _sed && _.isEmpty(validation) &&
       (bucHasSedsWithAtLeastOneInstitution() || !_.isEmpty(_institutions)) &&
       !loading.creatingSed && !sendingAttachments &&
       (sedNeedsVedtakId() ? _.isNumber(_vedtakId) && !_.isNaN(_vedtakId) : true)
    }
    return false
  }

  return (
    <Nav.Row className='a-buc-c-sedstart'>
      {step === 0 ? (
        <Step1
          {...props}
          _sed={_sed} setSed={setSed} currentSed={currentSed} buc={buc}
          _countries={_countries} setCountries={setCountries} countryList={countryList}
          _institutions={_institutions} setInstitutions={setInstitutions} institutionList={institutionList}
          institutionNames={institutionNames}
          _attachments={_attachments} setAttachments={setAttachments}
          validation={validation} setValidation={setValidation}
          sedNeedsVedtakId={sedNeedsVedtakId}
          sedCanHaveAttachments={sedCanHaveAttachments}
          vedtakId={_vedtakId} setVedtakId={setVedtakId}
        />
      ) : null}
      {step === 1 ? (
        <Step2
          {...props}
          _sed={_sed}
          buc={buc}
          showButtons={showButtons} setShowButtons={setShowButtons}
          validation={validation} setValidation={setValidation}
        />
      ) : null}
      {sendingAttachments || attachmentsSent ? (
        <SEDAttachmentSender
          className='ml-3 w-50'
          attachmentsError={attachmentsError}
          sendAttachmentToSed={actions.sendAttachmentToSed}
          payload={{
            aktoerId: aktoerId,
            rinaId: buc.caseId,
            rinaDokumentId: sed.id
          }}
          allAttachments={_attachments.joark}
          savedAttachments={attachments}
          onFinished={() => setAttachmentsSent(true)}
          t={t}
        />
      ) : null}
      {showButtons ? (
        <div className='col-md-12 mt-4'>
          <Nav.Hovedknapp
            id='a-buc-c-sedstart__forward-button-id'
            className='a-buc-c-sedstart__forward-button'
            disabled={!allowedToForward()}
            spinner={loading.creatingSed || sendingAttachments}
            onClick={createSedNeedsMoreSteps() ? onNextButtonClick : onForwardButtonClick}
          >
            {loading.creatingSed ? t('buc:loading-creatingSED')
              : sendingAttachments ? t('buc:loading-sendingSEDattachments')
                : createSedNeedsMoreSteps() ? t('ui:next')
                  : t('buc:form-orderSED')}
          </Nav.Hovedknapp>
          {step > 0 ? (
            <Nav.Flatknapp
              id='a-buc-c-sedstart__back-button-id'
              className='a-buc-c-sedstart__back-button'
              onClick={onBackButtonClick}
            >{t('ui:back')}
            </Nav.Flatknapp>
          ) : null}
          <Nav.Flatknapp
            id='a-buc-c-sedstart__cancel-button-id'
            className='a-buc-c-sedstart__cancel-button'
            onClick={onCancelButtonClick}
          >{t('ui:cancel')}
          </Nav.Flatknapp>
        </div>
      ) : null}
    </Nav.Row>
  )
}

SEDStart.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string.isRequired,
  avdodfnr: PT.string,
  attachments: PT.array,
  bucs: PT.object.isRequired,
  bucsInfoList: PT.array,
  countryList: PT.array,
  currentBuc: PT.string.isRequired,
  initialAttachments: PT.object,
  institutionList: PT.object,
  institutionNames: PT.object,
  loading: PT.object.isRequired,
  p4000info: PT.object,
  sakId: PT.string.isRequired,
  sed: PT.object,
  t: PT.func.isRequired,
  vedtakId: PT.string
}

export default connect(mapStateToProps, mapDispatchToProps)(SEDStart)
