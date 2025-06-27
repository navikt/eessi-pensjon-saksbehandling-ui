import {bucsThatSupportAvdod, getFnr} from 'src/applications/BUC/components/BUCUtils/BUCUtils'
import * as types from 'src/constants/actionTypes'
import {VEDTAKSKONTEKST} from 'src/constants/constants'
import { BUCMode, RinaUrl } from 'src/declarations/app.d'
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
  SedsWithAttachmentsMap,
  ValidBuc,
  P6000,
  BucListItem,
} from 'src/declarations/buc'
import {PSED} from "src/declarations/app.d";
import { JoarkBrowserItem, JoarkBrowserItems, JoarkPreview } from 'src/declarations/joark'
import { ActionWithPayload } from '@navikt/fetch'
import _ from 'lodash'
import md5 from 'md5'
import { standardLogger } from 'src/metrics/loggers'
import { AnyAction } from 'redux'
import { P5000sFromRinaMap } from 'src/declarations/p5000'
import {P4000SED} from "../declarations/p4000"
import {P8000SED} from "src/declarations/p8000";
import {BUC_CREATE_ATP_SED_SUCCESS} from "src/constants/actionTypes";

export interface BucState {
  attachmentsError: boolean
  bucs: Bucs | undefined
  bucsList: Array<BucListItem> | null | undefined
  bucsInfoList: Array<string> | undefined
  bucsInfo: BucsInfo | undefined
  bucOptions: Array<string> | undefined
  countryList: Array<string> | undefined
  currentBuc: string | undefined
  currentSed: Sed | undefined
  PSED: PSED | undefined | null
  PSEDChanged: boolean
  PSEDSendResponse: any | null | undefined
  PSEDSavedResponse: any | null | undefined
  previewPDF: JoarkPreview | null | undefined
  followUpSeds: Array<Sed> | undefined
  howManyBucLists: number
  kravDato: string | null | undefined
  institutionList: InstitutionListMap<Institution> | undefined
  institutionNames: InstitutionNames
  mode: BUCMode
  newlyCreatedBuc: Buc | undefined
  newlyCreatedSed: Sed | undefined
  newlyCreatedSedTime: number | undefined
  newlyCreatedATPBuc: Buc | undefined | null
  newlyCreatedATPSed: Sed | undefined | null
  rinaId: string | undefined
  rinaUrl: RinaUrl | undefined
  savingAttachmentsJob: SavingAttachmentsJob | undefined
  sed: Sed | undefined
  p4000: P4000SED | undefined
  p5000sFromRinaMap: P5000sFromRinaMap
  p6000s: Array<P6000> | null | undefined
  p6000PDF: JoarkPreview | null | undefined
  sedsWithAttachments: SedsWithAttachmentsMap
  sedList: Array<string> | undefined
  subjectAreaList: Array<string>
  tagList: Array<string> | undefined
}

export const initialBucState: BucState = {
  attachmentsError: false,
  bucs: {},
  bucsInfoList: undefined,
  bucsInfo: undefined,
  bucsList: undefined,
  bucOptions: undefined,
  countryList: undefined,
  currentBuc: undefined,
  currentSed: undefined,
  PSED: undefined,
  PSEDChanged: false,
  PSEDSendResponse: undefined,
  PSEDSavedResponse: undefined,
  previewPDF: undefined,
  followUpSeds: undefined,
  institutionList: undefined,
  institutionNames: {},
  howManyBucLists: 0,
  kravDato: undefined,
  mode: 'buclist' as BUCMode,
  newlyCreatedBuc: undefined,
  newlyCreatedSed: undefined,
  newlyCreatedSedTime: undefined,
  newlyCreatedATPBuc: undefined,
  newlyCreatedATPSed: undefined,
  rinaId: undefined,
  rinaUrl: undefined,
  savingAttachmentsJob: undefined,
  sed: undefined,
  p4000: undefined,
  p5000sFromRinaMap: {},
  p6000s: undefined,
  p6000PDF: undefined,
  sedList: undefined,
  sedsWithAttachments: {},
  subjectAreaList: ['Pensjon'],
  tagList: undefined,
}

const bucReducer = (state: BucState = initialBucState, action: AnyAction) => {
  switch (action.type) {
    case types.APP_DATA_CLEAR: {
      return initialBucState
    }

    case types.BUC_BUC_RESET:
      return {
        ...state,
        currentBuc: undefined,
        currentSed: undefined,
        followUpSeds: undefined,
        sed: undefined,
        savingAttachmentsJob: undefined,
        p6000s: undefined,
        p6000PDF: undefined,
        p5000sFromRinaMap: {}
      }


    case types.BUC_ATP_RESET:
      return {
        ...state,
        newlyCreatedATPBuc: undefined,
        newlyCreatedATPSed: undefined,
        PSED: undefined,
        PSEDSavedResponse: undefined,
        PSEDSendResponse: undefined
      }

    case types.BUC_CREATE_BUC_REQUEST:
    case types.BUC_CREATE_ATP_BUC_REQUEST:
    case types.GJENNY_CREATE_BUC_REQUEST:
      return {
        ...state,
        rinaId: undefined
      }

    case types.BUC_CREATE_BUC_FAILURE:
    case types.GJENNY_CREATE_BUC_FAILURE:
      standardLogger('buc.new.create.failure')
      return {
        ...state,
        rinaId: undefined
      }

    case types.BUC_CREATE_BUC_SUCCESS:
    case types.GJENNY_CREATE_BUC_SUCCESS: {
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
        bucs,
        kravDato: undefined,
        newlyCreatedBuc: newBuc,
        savingAttachmentsJob: undefined,
        sedsWithAttachments: newSedsWithAttachments,
        p6000s: undefined
      }
    }

    case types.BUC_CREATE_ATP_BUC_SUCCESS: {
      const bucs = _.cloneDeep(state.bucs)
      const newSedsWithAttachments: SedsWithAttachmentsMap = _.cloneDeep(state.sedsWithAttachments)
      const newBuc: ValidBuc = _.cloneDeep((action as ActionWithPayload).payload)

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
        bucs,
        kravDato: undefined,
        newlyCreatedATPBuc: newBuc,
        savingAttachmentsJob: undefined,
        sedsWithAttachments: newSedsWithAttachments,
        p6000s: undefined
      }
    }

    case types.BUC_CREATE_ATP_BUC_FAILURE:
      return {
        ...state,
        newlyCreatedATPBuc: null
      }

    case types.BUC_CREATE_ATP_SED_FAILURE:
      return {
        ...state,
        newlyCreatedATPSed: null
      }

    case types.BUC_CREATE_SED_FAILURE:
    case types.GJENNY_CREATE_SED_FAILURE:
      standardLogger('sed.new.create.failure')
      return state

    case types.BUC_CREATE_SED_SUCCESS:
    case types.BUC_CREATE_REPLY_SED_SUCCESS:
    case types.GJENNY_CREATE_SED_SUCCESS:
    case types.GJENNY_CREATE_REPLY_SED_SUCCESS: {
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
        bucs
      }
    }

    case BUC_CREATE_ATP_SED_SUCCESS:{
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
        newlyCreatedATPSed: newSed,
        newlyCreatedSedTime: Date.now(),
        sed: newSed,
        bucs
      }
    }

    case types.BUC_CURRENTBUC_SET: {
      const isNewlyCreatedBuc = state.newlyCreatedBuc && state.newlyCreatedBuc.caseId === (action as ActionWithPayload).payload
      const isNewlyCreatedATPBuc = state.newlyCreatedATPBuc && state.newlyCreatedATPBuc.caseId === (action as ActionWithPayload).payload

      return {
        ...state,
        newlyCreatedBuc: isNewlyCreatedBuc ? undefined : state.newlyCreatedBuc,
        newlyCreatedATPBuc: isNewlyCreatedATPBuc ? undefined : state.newlyCreatedATPBuc,
        currentBuc: (action as ActionWithPayload).payload,
        countryList: undefined,
        p6000s: undefined
      }
    }

    case types.BUC_FOLLOWUPSEDS_SET:

      return {
        ...state,
        currentSed: (action as ActionWithPayload).payload.sed,
        followUpSeds: (action as ActionWithPayload).payload.followUpSeds
      }

    case types.BUC_GET_BUCSLIST_REQUEST:
      return {
        ...state,
        howManyBucLists: (action as ActionWithPayload).context && (action as ActionWithPayload).context.howManyBucLists ? (action as ActionWithPayload).context.howManyBucLists : 1,
        bucsList: _.isNil(state.bucsList) ? undefined : state.bucsList
      }

    case types.BUC_GET_BUCSLIST_SUCCESS:
    case types.BUC_GET_BUCSLIST_VEDTAK_SUCCESS: {
      // merge only the new ones, do not have duplicates
      const newBucsList = _.isNil(state.bucsList) ? [] : _.cloneDeep(state.bucsList);
      (action as ActionWithPayload).payload?.forEach((buc: BucListItem) => {
        const foundIndex = _.findIndex(newBucsList, (b: BucListItem) => b.euxCaseId === buc.euxCaseId)
        if (foundIndex < 0) {
          newBucsList.push(buc)
        } else {
          // sometimes, list 1 and list 2 gets bucswith same euxCaseID, but list 2 comes with a avdodFnr filled out
          // so, if that is the case, replace it
          if (!_.isNil(buc.avdodFnr) && _.isNil(newBucsList[foundIndex].avdodFnr)) {
            newBucsList[foundIndex] = buc
          }
        }
      })
      return {
        ...state,
        howManyBucLists: (state.howManyBucLists - 1),
        bucsList: newBucsList
      }
    }

    case types.BUC_GET_BUCSLIST_FAILURE:
    case types.BUC_GET_BUCSLIST_VEDTAK_FAILURE:

      return {
        ...state,
        howManyBucLists: (state.howManyBucLists - 1),
        bucsList: _.isNil(state.bucsList) ? null : state.bucsList
      }

    case types.BUC_GET_BUC_SUCCESS: {
      const bucs = _.cloneDeep(state.bucs)
      const buc: Buc | undefined = (action as ActionWithPayload).payload

      if (!buc?.caseId || !buc?.type) {
        if((action as ActionWithPayload).payload) {
          // CAN BE UNDEFINED ON LOCALHOST
          bucs![(action as ActionWithPayload).context.rinaCaseId] = (action as ActionWithPayload).payload
        }

        return {
          ...state,
          bucs
        }
      } else {
        const institutionNames = _.cloneDeep(state.institutionNames)
        const sedsWithAttachments: SedsWithAttachmentsMap = _.cloneDeep(state.sedsWithAttachments)

        if (buc.institusjon) {
          buc.institusjon.forEach((inst: Institution) => {
            if (inst.institution && !institutionNames[inst.institution]) {
              institutionNames[inst.institution] = inst
            }
          })
        }

        // Cache seds allowing attachments
        const seds = buc.seds
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

        if (!(buc as ValidBuc).addedParams) {
          (buc as ValidBuc).addedParams = {}
        }

        // @ts-ignore
        if (buc.subject) {
          // @ts-ignore
          (buc as ValidBuc).addedParams.subject = _.cloneDeep(buc.subject)
        }

        bucs![(action as ActionWithPayload).payload.caseId] = (action as ActionWithPayload).payload
        bucs![(action as ActionWithPayload).payload.caseId].deltakere = bucs![(action as ActionWithPayload).payload.caseId].institusjon

        return {
          ...state,
          bucs,
          institutionNames,
          sedsWithAttachments
        }
      }
    }

    /*
    case types.BUC_GET_BUCS_FAILURE:
      standardLogger('buc.list.error')
      const bucs = _.cloneDeep(state.bucs)
      bucs![(action as ActionWithPayload).context.euxCaseId] = null
      return {
        ...state,
        bucs: null
      } */

    case types.BUC_GET_BUC_OPTIONS_SUCCESS:
    {
      const excludedBucs: Array<string> = []

      const pesysContext = _.get((action as ActionWithPayload), 'context.pesysContext')

      const sakTypeAllowingPBUC05notVedtakscontext: Array<SakTypeValue> = ['Alderspensjon', 'Barnepensjon', 'Generell', 'Gjenlevendeytelse', 'Omsorgsopptjening', 'Uføretrygd']
      const sakTypeAllowingPBUC05vedtakscontext: Array<SakTypeValue> = ['Alderspensjon', 'Barnepensjon', 'Gjenlevendeytelse', 'Omsorgsopptjening' ,'Uføretrygd']

      const sakTypeAllowingPBUC05 = pesysContext === VEDTAKSKONTEKST ? sakTypeAllowingPBUC05vedtakscontext : sakTypeAllowingPBUC05notVedtakscontext
      const sakType: SakTypeValue | null | undefined = (action as ActionWithPayload).context.sakType

      if (pesysContext !== VEDTAKSKONTEKST) {
        excludedBucs.push('P_BUC_02')
      }

      if (sakType && sakTypeAllowingPBUC05.indexOf(sakType) < 0) {
        excludedBucs.push('P_BUC_05')
      }

      return {
        ...state,
        bucOptions: _.difference((action as ActionWithPayload).payload, excludedBucs)
      }
    }

    case types.GJENNY_GET_BUC_OPTIONS_SUCCESS:
      return {
        ...state,
        bucOptions: (action as ActionWithPayload).payload
      }


    case types.BUC_GET_BUC_OPTIONS_REQUEST:
    case types.BUC_GET_BUC_OPTIONS_FAILURE:
    case types.GJENNY_GET_BUC_OPTIONS_REQUEST:
    case types.GJENNY_GET_BUC_OPTIONS_FAILURE:
      return {
        ...state,
        bucOptions: []
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
        institutionList,
        institutionNames
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
        bucs
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

    case types.BUC_GET_P4000_REQUEST:
      return {
        ...state,
        p4000: undefined
      }

    case types.BUC_GET_P4000_FAILURE:
      return {
        ...state,
        p4000: null
      }

    case types.BUC_GET_P4000_SUCCESS:
      return {
        ...state,
        p4000: {
          ...(action as ActionWithPayload).payload,
          sedId: (action as ActionWithPayload).context.sedId
        }
      }

    case types.BUC_GET_P6000_REQUEST:
      return {
        ...state,
        p6000s: undefined
      }

    case types.BUC_GET_P6000_FAILURE:
      return {
        ...state,
        p6000s: null
      }

    case types.BUC_GET_P6000_SUCCESS:
      return {
        ...state,
        p6000s: (action as ActionWithPayload).payload
      }

    case types.BUC_P6000PDF_RESET:
    case types.BUC_GET_P6000PDF_REQUEST:
      return {
        ...state,
        p6000PDF: undefined
      }

    case types.BUC_GET_P6000PDF_FAILURE:
      return {
        ...state,
        p6000PDF: null
      }

    case types.BUC_GET_P6000PDF_SUCCESS:
      return {
        ...state,
        p6000PDF: (action as ActionWithPayload).payload
      }


    case types.BUC_PREVIEWPDF_RESET:
    case types.BUC_GET_PREVIEWPDF_REQUEST:
      return {
        ...state,
        previewPDF: undefined
      }

    case types.BUC_GET_PREVIEWPDF_FAILURE:
      return {
        ...state,
        previewPDF: null
      }

    case types.BUC_GET_PREVIEWPDF_SUCCESS:
      return {
        ...state,
        previewPDF: (action as ActionWithPayload).payload
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
        currentSed: undefined,
        countryList: undefined,
        followUpSeds: undefined,
        institutionList: undefined,
        p5000sFromRinaMap: {}
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
      const newSaved: JoarkBrowserItems = _.cloneDeep(state.savingAttachmentsJob?.saved!)
      if (_.isArray(newSaved)) {
        newSaved.push(newlySavedJoarkBrowserItem)
      }

      newSeds!.forEach(sed => {
        if (sed.id === (action as ActionWithPayload).context.params.rinaDokumentId) {
          const name = (action as ActionWithPayload).context.joarkBrowserItem.dokumentInfoId + '_' +
            (action as ActionWithPayload).context.joarkBrowserItem.variant.variantformat + '.pdf'
          const date: number = Date.now()
          const newSedAttachment: SEDAttachment = {
            id: md5('id' + date),
            name,
            fileName: name,
            mimeType: 'application/pdf',
            documentId: md5('documentId' + date),
            lastUpdate: (action as ActionWithPayload).context.joarkBrowserItem.date.getTime(),
            medical: false
          } as SEDAttachment
          sed.attachments.push(newSedAttachment)
        }
      })
      newBucs![(action as ActionWithPayload).context.params.rinaId].seds = newSeds

      return {
        ...state,
        bucs: newBucs,
        savingAttachmentsJob: {
          total: _.cloneDeep(state.savingAttachmentsJob!.total),
          saving: undefined,
          saved: newSaved,
          remaining: newRemaining
        } as SavingAttachmentsJob
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
        } as SavingAttachmentsJob
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
        newlyCreatedATPSed: undefined,
        newlyCreatedSedTime: undefined
      }

    case types.BUC_SAVINGATTACHMENTJOB_SET:

      return {
        ...state,
        savingAttachmentsJob: {
          total: (action as ActionWithPayload).payload!,
          remaining: (action as ActionWithPayload).payload!,
          saving: undefined,
          saved: []
        } as SavingAttachmentsJob
      }

    case types.BUC_SAVINGATTACHMENTJOB_RESET:

      return {
        ...state,
        savingAttachmentsJob: undefined
      }

    case types.BUC_NEWLYCREATEDBUC_RESET: {
      return {
        ...state,
        newlyCreatedBuc: undefined,
        newlyCreatedATPBuc: undefined
      }
    }

    case types.GJENNY_GET_BUCSLIST_FOR_GJENLEVENDE_REQUEST:
      return {
        ...state,
        howManyBucLists: 2,
        bucsList: _.isNil(state.bucsList) ? undefined : state.bucsList
      }

    case types.GJENNY_GET_BUCSLIST_FOR_GJENLEVENDE_SUCCESS:
    case types.GJENNY_GET_BUCSLIST_FOR_AVDOD_SUCCESS: {
      // merge only the new ones, do not have duplicates
      const newBucsList = _.isNil(state.bucsList) ? [] : _.cloneDeep(state.bucsList);
      (action as ActionWithPayload).payload?.forEach((buc: BucListItem) => {
        const foundIndex = _.findIndex(newBucsList, (b: BucListItem) => b.euxCaseId === buc.euxCaseId)
        if (foundIndex < 0) {
          newBucsList.push(buc)
        } else {
          // sometimes, list 1 and list 2 gets bucswith same euxCaseID, but list 2 comes with a avdodFnr filled out
          // so, if that is the case, replace it
          if (!_.isNil(buc.avdodFnr) && _.isNil(newBucsList[foundIndex].avdodFnr)) {
            newBucsList[foundIndex] = buc
          }
        }
      })
      return {
        ...state,
        howManyBucLists: (state.howManyBucLists - 1),
        bucsList: newBucsList
      }
    }

    case types.GJENNY_GET_BUCSLIST_FOR_GJENLEVENDE_FAILURE:
    case types.GJENNY_GET_BUCSLIST_FOR_AVDOD_FAILURE:

      return {
        ...state,
        howManyBucLists: (state.howManyBucLists - 1),
        bucsList: _.isNil(state.bucsList) ? null : state.bucsList
      }

    case types.PSED_RESET:
    case types.BUC_GET_SED_REQUEST:
    case types.BUC_GET_P8000SED_REQUEST: {
      return {
        ...state,
        PSED: undefined,
        PSEDChanged: false
      }
    }

    case types.BUC_GET_SED_SUCCESS: {
      const payload = (action as ActionWithPayload).payload
      const sed = (action as ActionWithPayload).context.sed
      return {
        ...state,
        PSED: {
          ...payload,
          originalSed: sed,
        },
        PSEDChanged: false
      }
    }

    case types.BUC_GET_P8000SED_SUCCESS: {
      const payload = (action as ActionWithPayload).payload
      const sed = (action as ActionWithPayload).context.sed

      const fritekstArray: string[] | undefined = (payload as P8000SED).pensjon?.ytterligeinformasjon?.split(/\*+/)
        .map(part => part.trim()) // Remove whitespace and newlines
        .filter(Boolean); // Remove empty strings

      let fritekst = undefined
      if(fritekstArray && fritekstArray.length === 2){
        fritekst = fritekstArray[1]
      } else if(fritekstArray && fritekstArray.length === 1 && !fritekstArray[0].startsWith("1)")){
        // if first item is empty string (i.e. no options)
        fritekst = fritekstArray[0]
      }

      return {
        ...state,
        PSED: {
          ...payload,
          fritekst: fritekst,
          originalSed: sed
        },
        PSEDChanged: false
      }
    }
    case types.BUC_GET_SED_FAILURE:
    case types.BUC_GET_P8000SED_FAILURE: {
      return {
        ...state,
        PSED: null
      }
    }


    case types.BUC_SED_SET:
      return {
        ...state,
        PSED: (action as ActionWithPayload).payload,
        PSEDChanged: true
      }

    case types.BUC_SED_UPDATE: {
      let newPSED: PSED | null | undefined = _.cloneDeep(state.PSED)
      if (!newPSED) {
        newPSED = {} as PSED
      }
      _.set(newPSED,
        (action as ActionWithPayload).payload.needle,
        (action as ActionWithPayload).payload.value
      )

      return {
        ...state,
        PSED: newPSED,
        PSEDChanged: true
      }
    }

    case types.BUC_SED_DELETE_PROPERTY: {
      let newPSED: PSED | null | undefined = _.cloneDeep(state.PSED)
      if (!newPSED) {
        newPSED = {} as PSED
      }

      _.unset(newPSED,
        (action as ActionWithPayload).payload.needle
      )

      return {
        ...state,
        PSED: newPSED,
        PSEDChanged: true
      }
    }

    case types.BUC_PUT_SED_REQUEST:
      return {
        ...state,
        PSEDSavedResponse: undefined
      }

    case types.BUC_PUT_SED_SUCCESS:
      const savedPSED: PSED = _.cloneDeep(state.PSED) as PSED
      if (_.isNil(savedPSED.originalSed)) {
        savedPSED.originalSed = {} as PSED
      }

      if(savedPSED.originalSed.status === "sent"){
        // Set status to ACTIVE when SAVE after SENT
        savedPSED.originalSed.status = 'active'
      }

      return {
        ...state,
        PSED: savedPSED,
        PSEDSendResponse: undefined,
        PSEDSavedResponse: {
          saved: true
        },
        PSEDChanged: false
      }

    case types.BUC_PUT_SED_FAILURE:
      return {
        ...state,
        PSEDSavedResponse: null
      }

    case types.BUC_SEND_SED_REQUEST:
      return {
        ...state,
        PSEDSendResponse: undefined
      }

    case types.BUC_SEND_SED_FAILURE:
      return {
        ...state,
        PSEDSendResponse: null
      }

    case types.BUC_SEND_SED_SUCCESS: {
      const newPSED: PSED = _.cloneDeep(state.PSED) as PSED
      if (_.isNil(newPSED.originalSed)) {
        newPSED.originalSed = {} as PSED
      }
      newPSED.originalSed.status = 'sent'
      return {
        ...state,
        PSED: newPSED,
        PSEDSendResponse: { success: true }
      }
    }

    default:
      return state
  }
}

export default bucReducer
