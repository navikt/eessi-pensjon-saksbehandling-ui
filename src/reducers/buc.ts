import { BUCMode } from 'applications/BUC'
import { bucsThatSupportAvdod, getFnr } from 'applications/BUC/components/BUCUtils/BUCUtils'
import * as types from 'constants/actionTypes'
import { VEDTAKSKONTEKST } from 'constants/constants'
import { RinaUrl } from 'declarations/app.d'
import {
  Buc,
  Bucs,
  BucsInfo,
  BUCSubject,
  Institution,
  InstitutionListMap,
  InstitutionNames,
  Institutions,
  NewSedPayload,
  Participant,
  Participants,
  SakTypeValue,
  SavingAttachmentsJob,
  Sed,
  SEDAttachment,
  SedContentMap,
  SedsWithAttachmentsMap,
  ValidBuc
} from 'declarations/buc'
import { JoarkBrowserItem } from 'declarations/joark'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import md5 from 'md5'
import { standardLogger } from 'metrics/loggers'
import { Action } from 'redux'

export interface BucState {
  attachmentsError: boolean
  bucs: Bucs | undefined
  bucsInfoList: Array<string> | undefined
  bucsInfo: BucsInfo | undefined
  bucList: Array<string> | undefined
  countryList: Array<string> | undefined
  currentBuc: string | undefined
  currentSed: Sed | undefined
  kravDato: string | null | undefined
  institutionList: InstitutionListMap<Institution> | undefined
  institutionNames: InstitutionNames
  mode: BUCMode
  newlyCreatedBuc: Buc | undefined
  newlyCreatedSed: Sed | undefined
  newlyCreatedSedTime: number | undefined
  replySed: Sed | undefined
  rinaId: string | undefined
  rinaUrl: RinaUrl | undefined
  savingAttachmentsJob: SavingAttachmentsJob | undefined
  sed: Sed | undefined
  sedContent: SedContentMap
  sedsWithAttachments: SedsWithAttachmentsMap
  sedList: Array<string> | undefined
  sentP5000info: any,
  subjectAreaList: Array<string> | undefined
  tagList: Array<string> | undefined
}

export const initialBucState: BucState = {
  attachmentsError: false,
  bucs: undefined,
  bucsInfoList: undefined,
  bucsInfo: undefined,
  bucList: undefined,
  countryList: undefined,
  currentBuc: undefined,
  currentSed: undefined,
  institutionList: undefined,
  institutionNames: {},
  kravDato: undefined,
  mode: 'buclist' as BUCMode,
  newlyCreatedBuc: undefined,
  newlyCreatedSed: undefined,
  newlyCreatedSedTime: undefined,
  replySed: undefined,
  rinaId: undefined,
  rinaUrl: undefined,
  savingAttachmentsJob: undefined,
  sed: undefined,
  sedContent: {},
  sedList: undefined,
  sedsWithAttachments: {},
  sentP5000info: undefined,
  subjectAreaList: undefined,
  tagList: undefined
}

const bucReducer = (state: BucState = initialBucState, action: Action | ActionWithPayload = { type: '' }) => {
  switch (action.type) {
    case types.APP_CLEAR_DATA: {
      return initialBucState
    }

    case types.BUC_P5000_SEND_RESET:
    case types.BUC_P5000_SEND_REQUEST:
      return {
        ...state,
        sentP5000info: undefined
      }

    case types.BUC_P5000_SEND_SUCCESS:
      return {
        ...state,
        sentP5000info: (action as ActionWithPayload).payload
      }

    case types.BUC_P5000_SEND_FAILURE:
      return {
        ...state,
        sentP5000info: null
      }

    case types.BUC_BUC_RESET:
      return {
        ...state,
        currentBuc: undefined,
        currentSed: undefined,
        replySed: undefined,
        sed: undefined,
        savingAttachmentsJob: undefined,
        sedContent: {}
      }

    case types.BUC_CREATE_BUC_REQUEST:

      return {
        ...state,
        rinaId: undefined
      }

    case types.BUC_CREATE_BUC_FAILURE:
      standardLogger('buc.new.create.failure')
      return {
        ...state,
        rinaId: undefined
      }

    case types.BUC_CREATE_BUC_SUCCESS: {
      const bucs = _.cloneDeep(state.bucs)
      const newSedsWithAttachments: SedsWithAttachmentsMap = _.cloneDeep(state.sedsWithAttachments)
      const newBuc: ValidBuc = _.cloneDeep((action as ActionWithPayload).payload)

      const person = (action as ActionWithPayload).context.person
      const avdod = (action as ActionWithPayload).context.avdod
      const avdodfnr = (action as ActionWithPayload).context.avdodfnr
      const kravDato = (action as ActionWithPayload).context.kravDato

      if (!newBuc.addedParams) {
        newBuc.addedParams = {}
      }

      if (kravDato) {
        newBuc.addedParams.kravDato = kravDato
      }

      if (bucsThatSupportAvdod(newBuc.type) && person) {
        newBuc.addedParams.subject = {
          gjenlevende: {
            fnr: getFnr(person)
          },
          avdod: {
            fnr: avdod ? avdod.fnr : avdodfnr
          }
        } as BUCSubject
      }

      standardLogger('buc.new.create.success')

      // Cache seds allowing attachments
      if (newBuc.seds) {
        newBuc.seds.forEach((sed: Sed) => {
          newSedsWithAttachments[sed.type] = sed.allowsAttachments
        })
      }

      bucs![(action as ActionWithPayload).payload.caseId] = newBuc

      return {
        ...state,
        currentBuc: newBuc.caseId,
        sed: undefined,
        countryList: undefined,
        bucs: bucs,
        kravDato: undefined,
        newlyCreatedBuc: newBuc,
        savingAttachmentsJob: undefined,
        sedsWithAttachments: newSedsWithAttachments
      }
    }

    case types.BUC_CREATE_SED_FAILURE:

      standardLogger('sed.new.create.failure')
      return state

    case types.BUC_CREATE_SED_SUCCESS:
    case types.BUC_CREATE_REPLY_SED_SUCCESS: {
      const newSed: Sed = (action as ActionWithPayload).payload as Sed
      const bucs = _.cloneDeep(state.bucs)
      const contextSed: NewSedPayload = (action as ActionWithPayload).context.sed

      newSed.status = 'new'
      if (!newSed.participants) {
        newSed.participants = []

        if (bucs && bucs[state.currentBuc!]) {
          newSed.participants.push({
            role: 'Sender',
            organisation: {
              countryCode: bucs[state.currentBuc!].creator!.country,
              name: bucs[state.currentBuc!].creator!.name || '',
              id: bucs[state.currentBuc!].creator!.institution
            },
            selected: true
          })
        }

        if (_.isArray(contextSed.institutions)) {
          contextSed.institutions.forEach(inst => {
            newSed.participants.push({
              role: 'Receiver',
              organisation: {
                countryCode: inst.country,
                name: inst.name || '',
                id: inst.institution
              },
              selected: true
            })
          })
        }
      }

      if (bucs) {
        bucs[state.currentBuc!].seds!.push(newSed)
      }
      standardLogger('sed.new.create.success')
      return {
        ...state,
        newlyCreatedSed: newSed,
        newlyCreatedSedTime: Date.now(),
        sed: newSed,
        bucs: bucs
      }
    }

    case types.BUC_CURRENTBUC_SET: {
      const isNewlyCreatedBuc = state.newlyCreatedBuc && state.newlyCreatedBuc.caseId === (action as ActionWithPayload).payload

      return {
        ...state,
        newlyCreatedBuc: isNewlyCreatedBuc ? undefined : state.newlyCreatedBuc,
        currentBuc: (action as ActionWithPayload).payload,
        countryList: undefined
      }
    }

    case types.BUC_CURRENTSED_SET:

      return {
        ...state,
        currentSed: (action as ActionWithPayload).payload.sed,
        replySed: (action as ActionWithPayload).payload.replySed
      }

    case types.BUC_GET_BUCS_SUCCESS: {
      if (!_.isArray((action as ActionWithPayload).payload)) {
        return state
      }

      const bucs = _.keyBy((action as ActionWithPayload).payload, 'caseId') || {}
      const institutionNames = _.cloneDeep(state.institutionNames)
      const sedsWithAttachments: SedsWithAttachmentsMap = {}

      Object.keys(bucs).forEach(bucId => {
        // Cache institution names
        if (bucs[bucId].institusjon) {
          bucs[bucId].institusjon.forEach((inst: Institution) => {
            if (inst.institution && !institutionNames[inst.institution]) {
              institutionNames[inst.institution] = inst
            }
          })
        }

        // Cache seds allowing attachments
        const seds = bucs[bucId].seds
        if (seds) {
          seds.forEach((sed: Sed) => {
            sedsWithAttachments[sed.type] = sed.allowsAttachments
            sed?.participants?.forEach((p) => {
              if (!_.isNil(p.organisation.id) && !institutionNames[p.organisation.id]) {
                institutionNames[p.organisation.id] = {
                  country: p.organisation.countryCode,
                  institution: p.organisation.id,
                  name: p.organisation.name,
                  acronym: p.organisation.acronym!
                }
              }
            })
          })
        }

        if (!bucs[bucId].addedParams) {
          bucs[bucId].addedParams = {}
        }

        if (bucs[bucId].subject) {
          bucs[bucId].addedParams.subject = _.cloneDeep(bucs[bucId].subject)
        }

        /* Lazy load: pick one:
        * 1 - Simulate lazy load while we do not have lazy load backend: to simulate no seds and institutions
        *   bucs[bucId].institusjon = undefined
        *   bucs[bucId].seds = undefined
        *
        * 2- Get all working for no lazy load */
        bucs[bucId].deltakere = bucs[bucId].institusjon
      })

      return {
        ...state,
        bucs: bucs,
        institutionNames: institutionNames,
        sedsWithAttachments: sedsWithAttachments
      }
    }

    case types.BUC_GET_BUCS_FAILURE:
      standardLogger('buc.list.error')
      return {
        ...state,
        bucs: null
      }

    case types.BUC_GET_BUC_LIST_SUCCESS:
    {
      const excludedBucs: Array<string> = []

      const pesysContext = _.get((action as ActionWithPayload), 'context.pesysContext')

      const sakTypeAllowingPBUC05notVedtakscontext: Array<SakTypeValue> = ['Alderspensjon', 'Barnepensjon', 'Generell', 'Gjenlevendeytelse', 'Omsorgsopptjening', 'Uføretrygd']
      const sakTypeAllowingPBUC05vedtakscontext: Array<SakTypeValue> = ['Alderspensjon', 'Barnepensjon', 'Gjenlevendeytelse', 'Omsorgsopptjening', 'Uføretrygd']

      const sakTypeAllowingPBUC05 = pesysContext === VEDTAKSKONTEKST ? sakTypeAllowingPBUC05vedtakscontext : sakTypeAllowingPBUC05notVedtakscontext
      const sakType: SakTypeValue |undefined = (action as ActionWithPayload).context.sakType

      if (pesysContext !== VEDTAKSKONTEKST) {
        excludedBucs.push('P_BUC_02')
      }

      if (sakType && sakTypeAllowingPBUC05.indexOf(sakType) < 0) {
        excludedBucs.push('P_BUC_05')
      }

      return {
        ...state,
        bucList: _.difference((action as ActionWithPayload).payload, excludedBucs)
      }
    }

    case types.BUC_GET_BUC_LIST_REQUEST:
    case types.BUC_GET_BUC_LIST_FAILURE:

      return {
        ...state,
        bucList: []
      }

    case types.BUC_GET_BUCSINFO_SUCCESS:

      return {
        ...state,
        bucsInfo: typeof (action as ActionWithPayload).payload === 'object' ? (action as ActionWithPayload).payload : JSON.parse((action as ActionWithPayload).payload)
      }

    case types.BUC_GET_BUCSINFO_REQUEST:
    case types.BUC_GET_BUCSINFO_FAILURE:

      return {
        ...state,
        bucsInfo: undefined
      }

    case types.BUC_GET_BUCSINFO_LIST_SUCCESS:

      return {
        ...state,
        bucsInfoList: (action as ActionWithPayload).payload
      }

    case types.BUC_GET_BUCSINFO_LIST_REQUEST:
    case types.BUC_GET_BUCSINFO_LIST_FAILURE:

      return {
        ...state,
        bucsInfoList: undefined
      }

    case types.BUC_GET_COUNTRY_LIST_SUCCESS:

      return {
        ...state,
        countryList: (action as ActionWithPayload).payload
      }

    case types.BUC_GET_COUNTRY_LIST_REQUEST:
      return {
        ...state,
        countryList: undefined
      }

    case types.BUC_GET_COUNTRY_LIST_FAILURE:

      return {
        ...state,
        countryList: null
      }

    case types.BUC_GET_KRAVDATO_REQUEST:
      return {
        ...state,
        kravDato: undefined
      }

    case types.BUC_GET_KRAVDATO_FAILURE:
      return {
        ...state,
        kravDato: null
      }

    case types.BUC_GET_KRAVDATO_SUCCESS:
      return {
        ...state,
        kravDato: (action as ActionWithPayload).payload.kravDato
      }

    case types.BUC_GET_INSTITUTION_LIST_SUCCESS: {
      const institutionList: InstitutionListMap<Institution> = state.institutionList ? _.cloneDeep(state.institutionList!) : {}
      const institutionNames: InstitutionNames = _.clone(state.institutionNames);
      (action as ActionWithPayload).payload.forEach((institution: Institution) => {
        const existingInstitutions: Institutions = institutionList[institution.country] || []
        if (!_.find(existingInstitutions, { institution: institution.institution })) {
          existingInstitutions.push({
            ...institution,
            buc: (action as ActionWithPayload).context.buc
          })
        }
        existingInstitutions.sort((a: Institution, b: Institution) => a.institution.localeCompare(b.institution))
        institutionList[institution.country] = existingInstitutions
        institutionNames[institution.institution] = institution
      })
      return {
        ...state,
        institutionList: institutionList,
        institutionNames: institutionNames
      }
    }

    case types.BUC_GET_PARTICIPANTS_SUCCESS: {
      const rinaCaseId = (action as ActionWithPayload).context.rinaCaseId
      const bucs = _.cloneDeep(state.bucs)

      const deltakere: Institutions = (action as ActionWithPayload<Participants>).payload.map((participant: Participant) => ({
        country: participant.organisation.countryCode,
        institution: participant.organisation.id,
        name: participant.organisation.name,
        acronym: participant.organisation.acronym || participant.organisation.id
      }))

      if (bucs![rinaCaseId]) {
        bucs![rinaCaseId].deltakere = deltakere
      }

      return {
        ...state,
        bucs: bucs
      }
    }

    case types.BUC_GET_SINGLE_BUC_SUCCESS: {
      if (!(action as ActionWithPayload).payload.caseId || !(action as ActionWithPayload).payload.type) { return state }
      const bucs = _.cloneDeep(state.bucs)
      bucs![(action as ActionWithPayload).payload.caseId] = (action as ActionWithPayload).payload
      bucs![(action as ActionWithPayload).payload.caseId].deltakere = bucs![(action as ActionWithPayload).payload.caseId].institusjon
      return {
        ...state,
        bucs: bucs
      }
    }

    case types.BUC_GET_SED_LIST_SUCCESS: {
      const sedTypes = ['X', 'H', 'P']
      return {
        ...state,
        sedList: (action as ActionWithPayload).payload.sort((a: string, b: string) => {
          const mainCompare = parseInt(a.replace(/[^\d]/g, ''), 10) - parseInt(b.replace(/[^\d]/g, ''), 10)
          const sedTypeA = a.charAt(0)
          const sedTypeB = b.charAt(0)
          if (sedTypes.indexOf(sedTypeB) - sedTypes.indexOf(sedTypeA) > 0) return 1
          if (sedTypes.indexOf(sedTypeB) - sedTypes.indexOf(sedTypeA) < 0) return -1
          return mainCompare
        }).filter((sed: string) => sed !== 'P9000')
      }
    }

    case types.BUC_GET_SED_LIST_REQUEST:
    case types.BUC_GET_SED_LIST_FAILURE:

      return {
        ...state,
        sedList: undefined
      }

    case types.BUC_GET_SED_SUCCESS: {
      const newSedContent = _.cloneDeep(state.sedContent)
      newSedContent[(action as ActionWithPayload).context.id] = (action as ActionWithPayload).payload
      return {
        ...state,
        sedContent: newSedContent
      }
    }

    case types.BUC_GET_SUBJECT_AREA_LIST_SUCCESS:

      return {
        ...state,
        subjectAreaList: (action as ActionWithPayload).payload
      }

    case types.BUC_GET_SUBJECT_AREA_LIST_REQUEST:
    case types.BUC_GET_SUBJECT_AREA_LIST_FAILURE:

      return {
        ...state,
        subjectAreaList: []
      }

    case types.BUC_GET_TAG_LIST_SUCCESS:

      return {
        ...state,
        tagList: (action as ActionWithPayload).payload
      }

    case types.BUC_GET_TAG_LIST_REQUEST:
    case types.BUC_GET_TAG_LIST_FAILURE:

      return {
        ...state,
        tagList: []
      }

    case types.BUC_RINA_GET_URL_SUCCESS:

      return {
        ...state,
        rinaUrl: (action as ActionWithPayload).payload.rinaUrl
      }

    case types.BUC_SAVE_BUCSINFO_REQUEST:
    case types.BUC_SAVE_BUCSINFO_FAILURE:

      return state

    case types.BUC_SAVE_BUCSINFO_SUCCESS:
      return {
        ...state,
        bucsInfo: (action as ActionWithPayload).context
      }

    case types.BUC_SED_RESET:
      return {
        ...state,
        sed: undefined,
        replySed: undefined,
        currentSed: undefined,
        countryList: undefined,
        institutionList: undefined,
        sedContent: {}
      }

    case types.BUC_SED_ATTACHMENTS_RESET: {
      return {
        ...state,
        savingAttachmentsJob: undefined
      }
    }

    case types.BUC_SEDLIST_SET:

      return {
        ...state,
        sedList: (action as ActionWithPayload).payload
      }

    case types.BUC_SEND_ATTACHMENT_SUCCESS: {
      const newlySavedJoarkBrowserItem: JoarkBrowserItem = (action as ActionWithPayload).context.joarkBrowserItem
      const newBucs = _.cloneDeep(state.bucs)
      const newSeds = _.cloneDeep(state.bucs![(action as ActionWithPayload).context.params.rinaId].seds)
      const newRemaining = _.reject(state.savingAttachmentsJob!.remaining, (item: JoarkBrowserItem) => {
        return item.dokumentInfoId === newlySavedJoarkBrowserItem.dokumentInfoId &&
          item.journalpostId === newlySavedJoarkBrowserItem.journalpostId &&
          item.variant === newlySavedJoarkBrowserItem.variant
      })
      newlySavedJoarkBrowserItem.type = 'sednew'
      const newSaved = state.savingAttachmentsJob?.saved.concat(newlySavedJoarkBrowserItem)

      newSeds!.forEach(sed => {
        if (sed.id === (action as ActionWithPayload).context.params.rinaDokumentId) {
          const name = (action as ActionWithPayload).context.joarkBrowserItem.dokumentInfoId + '_' +
            (action as ActionWithPayload).context.joarkBrowserItem.variant.variantformat + '.pdf'
          const date: number = Date.now()
          const newSedAttachment: SEDAttachment = {
            id: md5('id' + date),
            name: name,
            fileName: name,
            mimeType: 'application/pdf',
            documentId: md5('documentId' + date),
            lastUpdate: (action as ActionWithPayload).context.joarkBrowserItem.date.getTime(),
            medical: false
          }
          sed.attachments.push(newSedAttachment)
        }
      })
      newBucs![(action as ActionWithPayload).context.params.rinaId].seds = newSeds

      return {
        ...state,
        bucs: newBucs,
        savingAttachmentsJob: {
          ...state.savingAttachmentsJob,
          saving: undefined,
          saved: newSaved,
          remaining: newRemaining
        }
      }
    }

    case types.BUC_SEND_ATTACHMENT_REQUEST:
      return {
        ...state,
        attachmentsError: false,
        savingAttachmentsJob: {
          ...state.savingAttachmentsJob,
          saving: {
            foo: 'bar'
          }
        }
      }

    case types.BUC_SEND_ATTACHMENT_FAILURE:
      return {
        ...state,
        attachmentsError: true
      }

    case types.BUC_NEWSED_RESET:
      return {
        ...state,
        newlyCreatedSed: undefined,
        newlyCreatedSedTime: undefined
      }

    case types.BUC_SAVINGATTACHMENTJOB_SET:

      return {
        ...state,
        savingAttachmentsJob: {
          total: (action as ActionWithPayload).payload,
          remaining: (action as ActionWithPayload).payload,
          saving: undefined,
          saved: []
        }
      }

    case types.BUC_SAVINGATTACHMENTJOB_RESET:

      return {
        ...state,
        savingAttachmentsJob: undefined
      }

    case types.BUC_NEWLYCREATEDBUC_RESET: {
      return {
        ...state,
        newlyCreatedBuc: undefined
      }
    }
    default:
      return state
  }
}

export default bucReducer
