import * as bucActions from 'actions/buc'
import * as storageActions from 'actions/storage'
import * as uiActions from 'actions/ui'
import { sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDAttachmentSender from 'applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender'
import P4000Payload from 'applications/BUC/components/SEDP4000/P4000Payload'
import { IS_TEST } from 'constants/environment'
import * as storage from 'constants/storage'
import {
  AttachedFiles,
  Buc,
  Bucs,
  Institution,
  InstitutionListMap,
  InstitutionNames,
  Institutions,
  RawInstitution,
  Sed
} from 'declarations/buc'
import {
  AttachedFilesPropType,
  BucsPropType,
  InstitutionListMapPropType,
  InstitutionNamesPropType,
  SedPropType
} from 'declarations/buc.pt'
import { JoarkFiles } from 'declarations/joark'
import { P4000Info } from 'declarations/period'
import { P4000InfoPropType } from 'declarations/period.pt'
import { AllowedLocaleString, Loading, T, Validation } from 'declarations/types'
import { ActionCreatorsPropType, AllowedLocaleStringPropType, LoadingPropType, TPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import { ActionCreators, Dispatch, State } from 'eessi-pensjon-ui/dist/declarations/types'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { bindActionCreators, connect } from 'store'
import Step1 from './Step1'
import Step2 from './Step2'

export interface SEDStartProps {
  actions: ActionCreators;
  aktoerId?: string;
  avdodfnr?: string;
  attachments: AttachedFiles;
  attachmentsError ?: boolean;
  bucs: Bucs;
  bucsInfoList?: Array<string>;
  countryList: Array<string>;
  currentBuc?: string;
  currentSed ?: string;
  initialAttachments ?: AttachedFiles;
  initialSed ?: string | undefined;
  initialStep ?: number;
  institutionList: InstitutionListMap<RawInstitution>;
  institutionNames ?: InstitutionNames;
  loading: Loading;
  locale?: AllowedLocaleString;
  p4000info: P4000Info;
  sakId?: string;
  sed?: Sed | undefined;
  sedList?: Array<string>;
  setMode: (s: string) => void;
  t: T;
  vedtakId: string | undefined;
}

const mapStateToProps: Function = /* istanbul ignore next */ (state: State): State => ({
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
})

const mapDispatchToProps: Function = /* istanbul ignore next */ (dispatch: Dispatch) => ({
  actions: bindActionCreators({ ...storageActions, ...bucActions, ...uiActions }, dispatch)
})

export const SEDStart: React.FC<SEDStartProps> = (props: SEDStartProps): JSX.Element | null => {
  const { actions, aktoerId, avdodfnr, attachments, attachmentsError, bucs, bucsInfoList, countryList, currentBuc, currentSed } = props
  const { initialAttachments = {}, initialSed = undefined, initialStep = 0, institutionList, institutionNames } = props
  const { loading, locale, p4000info, sakId, sed, sedList, setMode, t, vedtakId = undefined } = props

  const prefill: (prop: string) => Array<string> = (prop: string) => {
    const institutions: Array<any> = bucs[currentBuc!] && bucs[currentBuc!].institusjon
      ? bucs[currentBuc!]
        .seds!
        .filter(sedFilter)
        .map((sed: Sed) => {
          return sed.participants
            .filter(p => p.role === 'Sender')
            .map(p => {
              return _.get(p.organisation, prop)
            })
        })
      : []
    return Array.from(new Set(_.flatten(institutions))) // remove duplicates
  }
  const [_sed, setSed] = useState<string | undefined>(initialSed)
  const [_institutions, setInstitutions] = useState<Array<string>>(prefill('id'))
  const [_countries, setCountries] = useState<Array<string>>(prefill('countryCode'))
  const [_vedtakId, setVedtakId] = useState<number | undefined>(vedtakId ? parseInt(vedtakId, 10) : undefined)
  const [_attachments, setAttachments] = useState<AttachedFiles>(initialAttachments)
  const [step, setStep] = useState<number>(initialStep)
  const [validation, setValidation] = useState<Validation>({})

  const [showButtons, setShowButtons] = useState<boolean>(true)
  const [sedSent, setSedSent] = useState<boolean>(false)
  const [sendingAttachments, setSendingAttachments] = useState<boolean>(false)
  const [attachmentsSent, setAttachmentsSent] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)
  const buc: Buc = _.cloneDeep(bucs[currentBuc!])

  useEffect(() => {
    if (_.isEmpty(countryList) && !loading.gettingCountryList) {
      actions.getCountryList(buc.type)
    }
  }, [actions, countryList, loading, buc.type])

  useEffect(() => {
    if (!mounted) {
      if (!currentSed || !currentBuc) {
        actions.getSedList(buc)
      } else {
        actions.setSedList(
          bucs[currentBuc].seds!
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
        bucsInfoList!.indexOf(aktoerId + '___' + storage.NAMESPACE_BUC + '___' + storage.FILE_BUCINFO) >= 0) {
        actions.fetchBucsInfo(aktoerId, storage.NAMESPACE_BUC, storage.FILE_BUCINFO)
      }
      setMode('bucedit')
    }
  }, [actions, aktoerId, attachmentsSent, avdodfnr, bucsInfoList, sedSent, setMode])

  if (_.isEmpty(bucs) || !currentBuc) {
    return null
  }

  const bucHasSedsWithAtLeastOneInstitution: Function = (): boolean => {
    if (buc.seds) {
      return _(buc.seds).find(sed => {
        return _.isArray(sed.participants) && !_.isEmpty(sed.participants)
      }) !== undefined
    }
    return false
  }

  const sedNeedsVedtakId = (): boolean => {
    return _sed === 'P6000' || _sed === 'P7000'
  }

  const sedCanHaveAttachments = (): boolean => {
    const sedsWithoutAttachments = ['P4000', 'P5000', 'P7000', 'H070']
    return _sed !== undefined && !_.includes(sedsWithoutAttachments, _sed)
  }

  const convertInstitutionIDsToInstitutionObjects: Function = (): Array<Institution> => {
    const institutions = [] as Institutions
    _institutions.forEach(item => {
      Object.keys(institutionList).forEach((landkode: string) => {
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
      const payload: any = {
        sakId: sakId,
        buc: buc.type,
        sed: _sed,
        institutions: institutions,
        aktoerId: aktoerId,
        euxCaseId: buc.caseId
      }

      if (_sed === 'P4000' && p4000info) {
        const periods = new P4000Payload(p4000info.stayAbroad, t).generatePayload()
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
    <Ui.Nav.Row className='a-buc-c-sedstart'>
      {step === 0 ? (
        <Step1
          {...props}
          locale={locale!}
          _sed={_sed} setSed={setSed} currentSed={currentSed} sedList={sedList} buc={buc}
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
          _sed={_sed!}
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
            rinaDokumentId: sed!.id
          }}
          allAttachments={_attachments.joark as JoarkFiles}
          savedAttachments={attachments.joark as JoarkFiles}
          onFinished={() => setAttachmentsSent(true)}
          t={t}
        />
      ) : null}
      {showButtons ? (
        <div className='col-md-12 mt-4'>
          <Ui.Nav.Hovedknapp
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
          </Ui.Nav.Hovedknapp>
          {step > 0 ? (
            <Ui.Nav.Flatknapp
              id='a-buc-c-sedstart__back-button-id'
              className='a-buc-c-sedstart__back-button'
              onClick={onBackButtonClick}
            >{t('ui:back')}
            </Ui.Nav.Flatknapp>
          ) : null}
          <Ui.Nav.Flatknapp
            id='a-buc-c-sedstart__cancel-button-id'
            className='a-buc-c-sedstart__cancel-button'
            onClick={onCancelButtonClick}
          >{t('ui:cancel')}
          </Ui.Nav.Flatknapp>
        </div>
      ) : null}
    </Ui.Nav.Row>
  )
}

SEDStart.propTypes = {
  actions: ActionCreatorsPropType.isRequired,
  aktoerId: PT.string.isRequired,
  avdodfnr: PT.string,
  attachments: AttachedFilesPropType.isRequired,
  bucs: BucsPropType.isRequired,
  bucsInfoList: PT.arrayOf(PT.string.isRequired),
  countryList: PT.arrayOf(PT.string.isRequired).isRequired,
  currentBuc: PT.string.isRequired,
  initialAttachments: AttachedFilesPropType,
  institutionList: InstitutionListMapPropType.isRequired,
  institutionNames: InstitutionNamesPropType.isRequired,
  loading: LoadingPropType.isRequired,
  locale: AllowedLocaleStringPropType.isRequired,
  p4000info: P4000InfoPropType.isRequired,
  sakId: PT.string.isRequired,
  sed: SedPropType,
  t: TPropType.isRequired,
  vedtakId: PT.string
}

export default connect(mapStateToProps, mapDispatchToProps)(SEDStart)
