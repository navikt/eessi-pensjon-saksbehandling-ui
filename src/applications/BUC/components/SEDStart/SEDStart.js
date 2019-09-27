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
import { getDisplayName } from 'utils/displayName'
import PInfoUtil from 'applications/BUC/components/SEDP4000/Util'
import { IS_TEST } from 'constants/environment'

const mapStateToProps = (state) => {
  return {
    attachments: state.buc.attachments,
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

export const SEDStart = (props) => {
  const { actions, aktoerId, avdodfnr, attachments, bucs, bucsInfoList, countryList, currentBuc, currentSed } = props
  const { initialAttachments = {}, initialSed = undefined, initialStep = 0, institutionList } = props
  const { loading, p4000info, sakId, sed, t, vedtakId } = props

  const [_sed, setSed] = useState(initialSed)
  const [_institutions, setInstitutions] = useState([])
  const [_countries, setCountries] = useState([])
  const [_vedtakId, setVedtakId] = useState(parseInt(vedtakId, 10))

  const [step, setStep] = useState(initialStep)
  const [validation, setValidation] = useState({})
  const [showButtons, setShowButtons] = useState(true)

  const [sedSent, setSedSent] = useState(false)
  const [sendingAttachment, setSendingAttachment] = useState(false)
  const [sendingAttachments, setSendingAttachments] = useState(false)
  const [attachmentsSent, setAttachmentsSent] = useState(false)
  const [_attachments, setAttachments] = useState(initialAttachments)
  const [_storeAttachments, setStoreAttachments] = useState(attachments || [])
  const [mounted, setMounted] = useState(false)

  const buc = _.cloneDeep(bucs[currentBuc])

  useEffect(() => {
    if (_.isEmpty(countryList) && !loading.gettingCountryList) {
      actions.getCountryList()
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
        setAttachmentsSent(true)
        return
      }
      // all attachments are sent - conclude
      if (_attachments.joark.length === _storeAttachments.length) {
        setAttachmentsSent(true)
        setSendingAttachments(false)
        return
      }
      // mark state as sending attachments
      setSendingAttachments(true)
      if (!IS_TEST) {
        console.log('Starting sending attachments')
      }
    }
  }, [_attachments, attachmentsSent, sedSent, _storeAttachments])

  useEffect(() => {
    if (sendingAttachments) {
      if (!sendingAttachment) {
        const unsentAttachments = _.differenceWith(_attachments.joark, _storeAttachments, (a, b) => {
          return a.dokumentInfoId === b.dokumentInfoId &&
            a.journalpostId === b.journalpostId &&
            a.variant.variantFormat === b.variant.variantFormat
        })

        // all sent, mark sending attachments as done
        if (_.isEmpty(unsentAttachments)) {
          setSendingAttachments(false)
          if (!IS_TEST) {
            console.log('All attachments sent')
          }
          return
        }

        const unsentAttachment = _.first(unsentAttachments)
        const params = {
          aktoerId: aktoerId,
          rinaId: buc.caseId,
          rinaDokumentId: sed.id,
          journalpostId: unsentAttachment.journalpostId,
          dokumentInfoId: unsentAttachment.dokumentInfoId,
          variantFormat: unsentAttachment.variant.variantformat
        }
        if (!IS_TEST) {
          console.log('Sending attachment ' + (_storeAttachments.length + 1) + ' of ' + _attachments.joark.length + ': ' +
          unsentAttachment.journalpostId + '/' + unsentAttachment.dokumentInfoId + '/' + unsentAttachment.variant.variantformat)
        }
        actions.sendAttachmentToSed(params, unsentAttachment)
        setSendingAttachment(true)
        return
      }

      // handle if we have a newly sent attachment
      if (sendingAttachment && _storeAttachments.length !== attachments.length) {
        if (!IS_TEST) {
          console.log('Attachment ' + (attachments.length) + ' of ' + _attachments.joark.length + ' sent')
        }
        setStoreAttachments(attachments)
        setSendingAttachment(false)
      }
    }
  }, [actions, aktoerId, attachments, _attachments, buc, sed, sendingAttachment, sendingAttachments, _storeAttachments])

  useEffect(() => {
    // cleanup after attachments sent
    if (sedSent && attachmentsSent) {
      actions.resetSed()
      actions.fetchBucs(aktoerId)
      if (avdodfnr) {
        actions.fetchBucs(avdodfnr)
      }
      if (!_.isEmpty(bucsInfoList) && bucsInfoList.indexOf(aktoerId + '___BUC___INFO') >= 0) {
        actions.fetchBucsInfo(aktoerId, 'BUC', 'INFO')
      }
      actions.setMode('bucedit')
    }
  }, [_attachments, actions, aktoerId, attachments, attachmentsSent, avdodfnr, buc, bucsInfoList, sed, sedSent, sendingAttachments])

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
    actions.setMode('bucedit')
  }

  const createSEDneedsMoreSteps = () => {
    return step === 0 && _sed === 'P4000'
  }

  const allowedToForward = () => {
    if (step === 0) {
      return _sed && _.isEmpty(validation) &&
       (bucHasSedsWithAtLeastOneInstitution() || !_.isEmpty(_institutions)) &&
       !loading.creatingSed && !sendingAttachments &&
       (sedNeedsVedtakId() ? _.isNumber(_vedtakId) && !_.isNaN(_vedtakId) : true)
    }
    if (step === 1) {
      return _sed === 'P4000' ? p4000info && !_.isEmpty(p4000info.stayAbroad) : true
    }
    return false
  }

  return (
    <Nav.Row className='a-buc-c-sedstart'>
      {step === 0 ? (
        <Step1
          {...props}
          _sed={_sed} setSed={setSed} currentSed={currentSed}
          buc={buc}
          _countries={_countries} setCountries={setCountries}
          _institutions={_institutions} setInstitutions={setInstitutions}
          _attachments={_attachments} setAttachments={setAttachments}
          validation={validation} setValidation={setValidation}
          sedNeedsVedtakId={sedNeedsVedtakId}
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
      {showButtons ? (
        <div className='col-md-12 mt-4'>
          <Nav.Hovedknapp
            id='a-buc-c-sedstart__forward-button-id'
            className='a-buc-c-sedstart__forward-button'
            disabled={!allowedToForward()}
            spinner={loading.creatingSed || sendingAttachments}
            onClick={createSEDneedsMoreSteps() ? onNextButtonClick : onForwardButtonClick}
          >
            {loading.creatingSed ? t('buc:loading-creatingSED')
              : sendingAttachments ? t('buc:loading-sendingSEDattachments', {
                current: (_storeAttachments.length + 1),
                total: _attachments.joark.length
              })
                : createSEDneedsMoreSteps() ? t('ui:next')
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
  loading: PT.object.isRequired,
  p4000info: PT.object,
  sakId: PT.string.isRequired,
  sed: PT.object,
  t: PT.func.isRequired,
  vedtakId: PT.string
}

const ConnectedSEDStart = connect(mapStateToProps, mapDispatchToProps)(SEDStart)
ConnectedSEDStart.displayName = `Connect(${getDisplayName(SEDStart)})`
export default ConnectedSEDStart
