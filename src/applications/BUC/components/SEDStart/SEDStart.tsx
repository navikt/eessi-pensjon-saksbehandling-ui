import {
  createReplySed,
  createSed,
  fetchBucs,
  fetchBucsInfo,
  getCountryList,
  getSedList,
  resetSed,
  resetSedAttachments,
  sendAttachmentToSed,
  setSedList
} from 'actions/buc'
import { sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDAttachmentSender, {
  SEDAttachmentPayload,
  SEDAttachmentPayloadWithFile
} from 'applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender'
import P4000Payload from 'applications/BUC/components/SEDP4000/P4000Payload'
import { IS_TEST } from 'constants/environment'
import * as storage from 'constants/storage'
import {
  AttachedFiles,
  Buc,
  Bucs,
  InstitutionListMap,
  Institutions,
  RawInstitution,
  Sed, SedsWithAttachmentsMap,
  ValidBuc
} from 'declarations/buc'
import { AttachedFilesPropType, BucsPropType } from 'declarations/buc.pt'
import { JoarkFile, JoarkFiles } from 'declarations/joark'
import { P4000Info } from 'declarations/period'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, Loading, Validation } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Step1 from './Step1'
import Step2 from './Step2'

export interface SEDStartProps {
  aktoerId?: string;
  bucs: Bucs;
  currentBuc: string;
  initialAttachments ?: AttachedFiles;
  initialSed ?: string | undefined;
  initialStep ?: number;
  setMode: (s: string) => void;
}

export interface SEDStartSelector {
  attachments: AttachedFiles;
  attachmentsError: boolean;
  avdodfnr: string | undefined;
  bucsInfoList: Array<string> | undefined;
  countryList: Array<string> | undefined;
  currentSed: string | undefined;
  institutionList: InstitutionListMap<RawInstitution> | undefined;
  loading: Loading;
  locale: AllowedLocaleString;
  sakId?: string;
  sed: Sed | undefined;
  sedsWithAttachments: SedsWithAttachmentsMap;
  sedList: Array<string> | undefined;
  p4000info: P4000Info | undefined;
  vedtakId: string | undefined;
}

const mapState = /* istanbul ignore next */ (state: State): SEDStartSelector => ({
  attachments: state.buc.attachments,
  attachmentsError: state.buc.attachmentsError,
  avdodfnr: state.app.params.avdodfnr,
  bucsInfoList: state.buc.bucsInfoList,
  countryList: state.buc.countryList,
  currentSed: state.buc.currentSed,
  institutionList: state.buc.institutionList,
  loading: state.loading,
  locale: state.ui.locale,
  sakId: state.app.params.sakId,
  sed: state.buc.sed,
  sedList: state.buc.sedList,
  sedsWithAttachments: state.buc.sedsWithAttachments,
  p4000info: state.buc.p4000info,
  vedtakId: state.app.params.vedtakId

})

export const SEDStart: React.FC<SEDStartProps> = ({
  aktoerId, bucs, currentBuc, initialAttachments = {}, initialSed = undefined, initialStep = 0, setMode
} : SEDStartProps): JSX.Element | null => {
  const {
    attachments, attachmentsError, avdodfnr, bucsInfoList, currentSed, countryList,
    institutionList, loading, locale,
    sakId, sed, sedsWithAttachments, sedList, p4000info, vedtakId
  }: SEDStartSelector = useSelector<State, SEDStartSelector>(mapState)
  const { t } = useTranslation()
  const dispatch = useDispatch()

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
  const [_avdodfnr, setAvdodfnr] = /* istanbul ignore next */ useState<number | undefined>(avdodfnr ? parseInt(avdodfnr, 10) : undefined)
  const [_sed, setSed] = useState<string | undefined>(initialSed)
  const [_institutions, setInstitutions] = useState<Array<string>>(prefill('id'))
  const [_countries, setCountries] = useState<Array<string>>(prefill('countryCode'))
  const [_vedtakId, setVedtakId] = /* istanbul ignore next */ useState<number | undefined>(vedtakId ? parseInt(vedtakId, 10) : undefined)
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
    if (_.isEmpty(countryList) && buc && buc.type && !loading.gettingCountryList) {
      dispatch(getCountryList(buc.type))
    }
  }, [countryList, dispatch, loading, buc])

  useEffect(() => {
    if (!mounted) {
      if (!currentSed) {
        dispatch(getSedList(buc as ValidBuc))
      } else {
        dispatch(setSedList(
          bucs[currentBuc].seds!
            .filter(sed => sed.parentDocumentId === currentSed)
            .map(sed => sed.type)
        ))
      }
      setMounted(true)
    }
  }, [mounted, buc, bucs, currentBuc, currentSed, dispatch])

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
        /* istanbul ignore next */ if (!IS_TEST) {
          console.log('SEDStart: No attachments to send, concluding')
        }
        setAttachmentsSent(true)
        return
      }
      // mark state as sending attachments
      setSendingAttachments(true)
      /* istanbul ignore next */ if (!IS_TEST) {
        console.log('SEDStart: Marking setSendingAttachments as true')
      }
    }
  }, [_attachments, attachmentsSent, sedSent])

  useEffect(() => {
    // cleanup after attachments sent
    if (aktoerId && sedSent && attachmentsSent) {
      /* istanbul ignore next */ if (!IS_TEST) {
        console.log('SEDStart: Attachments sent, cleaning up')
      }
      setSed(undefined)
      dispatch(resetSed())
      dispatch(resetSedAttachments())
      dispatch(fetchBucs(aktoerId))
      if (_avdodfnr) {
        dispatch(fetchBucs(_avdodfnr))
      }
      if (!_.isEmpty(bucsInfoList) &&
        bucsInfoList!.indexOf(aktoerId + '___' + storage.NAMESPACE_BUC + '___' + storage.FILE_BUCINFO) >= 0) {
        dispatch(fetchBucsInfo(aktoerId, storage.NAMESPACE_BUC, storage.FILE_BUCINFO))
      }
      setMode('bucedit')
    }
  }, [aktoerId, attachmentsSent, _avdodfnr, bucsInfoList, dispatch, sedSent, setMode])

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

  const sedNeedsAvdodfnr = (): boolean => {
    return _sed === 'P2100'
  }

  const _sendAttachmentToSed = (params: SEDAttachmentPayloadWithFile, unsentAttachment: JoarkFile): void => {
    dispatch(sendAttachmentToSed(params, unsentAttachment))
  }

  const sedCanHaveAttachments = (): boolean => {
    return _sed !== undefined && sedsWithAttachments[_sed]
  }

  const convertInstitutionIDsToInstitutionObjects: Function = (): Institutions => {
    const institutions = [] as Institutions
    _institutions.forEach(item => {
      Object.keys(institutionList!).forEach((landkode: string) => {
        const found = _.find(institutionList![landkode], { id: item })
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

  const onForwardButtonClick = (e: React.MouseEvent) => {
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
      if (sedNeedsAvdodfnr()) {
        payload.avdodfnr = _avdodfnr
      }
      if (currentSed) {
        dispatch(createReplySed(payload, currentSed))
      } else {
        dispatch(createSed(payload))
      }
      buttonLogger(e, payload)
    }
  }

  const onNextButtonClick = (e: React.MouseEvent) => {
    buttonLogger(e)
    setStep(step + 1)
  }

  const onBackButtonClick = (e: React.MouseEvent) => {
    buttonLogger(e)
    setStep(step - 1)
  }

  const onCancelButtonClick = (e: React.MouseEvent) => {
    buttonLogger(e)
    setSed(undefined)
    dispatch(resetSed())
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
       (sedNeedsVedtakId() ? _.isNumber(_vedtakId) && !_.isNaN(_vedtakId) : true) &&
       (sedNeedsAvdodfnr() ? _.isNumber(_avdodfnr) && !_.isNaN(_avdodfnr) : true)
    }
    return false
  }

  return (
    <Ui.Nav.Row className='a-buc-c-sedstart'>
      {step === 0 ? (
        <Step1
          loading={loading}
          locale={locale!}
          _sed={_sed} setSed={setSed} currentSed={currentSed} sedList={sedList} buc={buc}
          _countries={_countries} setCountries={setCountries} countryList={countryList!}
          _institutions={_institutions} setInstitutions={setInstitutions} institutionList={institutionList!}
          _attachments={_attachments} setAttachments={setAttachments}
          validation={validation} setValidation={setValidation}
          sedCanHaveAttachments={sedCanHaveAttachments}
          sedNeedsAvdodfnr={sedNeedsAvdodfnr}
          avdodfnr={_avdodfnr} setAvdodfnr={setAvdodfnr}
          vedtakId={_vedtakId} setVedtakId={setVedtakId}
          sedNeedsVedtakId={sedNeedsVedtakId}
        />
      ) : null}
      {step === 1 ? (
        <Step2
          locale={locale!}
          aktoerId={aktoerId!}
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
          sendAttachmentToSed={_sendAttachmentToSed}
          payload={{
            aktoerId: aktoerId,
            rinaId: buc.caseId,
            rinaDokumentId: sed!.id
          } as SEDAttachmentPayload}
          allAttachments={_attachments.joark as JoarkFiles}
          savedAttachments={attachments.joark as JoarkFiles}
          onFinished={() => setAttachmentsSent(true)}
        />
      ) : null}
      {showButtons ? (
        <div className='col-md-12 mt-4'>
          <Ui.Nav.Hovedknapp
            data-amplitude='sed.new.create'
            id='a-buc-c-sedstart__forward-button-id'
            className='a-buc-c-sedstart__forward-button'
            disabled={!allowedToForward()}
            spinner={loading.creatingSed || sendingAttachments}
            onClick={(e: React.MouseEvent) => {
              if (createSedNeedsMoreSteps()) {
                onNextButtonClick(e)
              } else {
                onForwardButtonClick(e)
              }
            }}
          >
            {loading.creatingSed ? t('buc:loading-creatingSED')
              : sendingAttachments ? t('buc:loading-sendingSEDattachments')
                : createSedNeedsMoreSteps() ? t('ui:next')
                  : t('buc:form-orderSED')}
          </Ui.Nav.Hovedknapp>
          {step > 0 ? (
            <Ui.Nav.Flatknapp
              data-amplitude='sed.new.back'
              id='a-buc-c-sedstart__back-button-id'
              className='a-buc-c-sedstart__back-button'
              onClick={onBackButtonClick}
            >{t('ui:back')}
            </Ui.Nav.Flatknapp>
          ) : null}
          <Ui.Nav.Flatknapp
            data-amplitude='sed.new.cancel'
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
  aktoerId: PT.string.isRequired,
  bucs: BucsPropType.isRequired,
  initialAttachments: AttachedFilesPropType,
  setMode: PT.func.isRequired
}

export default SEDStart
