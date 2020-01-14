import * as types from 'constants/actionTypes'
import { Action, State } from 'types.d'
import { JoarkDoc, JoarkFile, JoarkPoster, JoarkFileVariant } from '../applications/BUC/declarations/joark'
import _ from 'lodash'

export const initialJoarkState: State = {
  list: undefined,
  file: undefined,
  previewFile: undefined
}

const joarkReducer = (state: State = initialJoarkState, action: Action) => {
  switch (action.type) {
    case types.JOARK_LIST_SUCCESS: {
      const documents: Array<JoarkFile> = []
      action.payload.data.dokumentoversiktBruker.journalposter.forEach((post: JoarkPoster) => {
        post.dokumenter.forEach((doc: JoarkDoc) => {
          let variant = _.find(doc.dokumentvarianter, (v: JoarkFileVariant) => v.variantformat === 'SLADDET')
          if (!variant) {
            variant = _.find(doc.dokumentvarianter, (v: JoarkFileVariant) => v.variantformat === 'ARKIV')
          }
          if (!variant && !_.isEmpty(doc.dokumentvarianter)) {
            variant = doc.dokumentvarianter[0]
          }
          documents.push({
            tilleggsopplysninger: post.tilleggsopplysninger,
            journalpostId: post.journalpostId,
            tittel: doc.tittel,
            tema: post.tema,
            dokumentInfoId: doc.dokumentInfoId,
            datoOpprettet: new Date(Date.parse(post.datoOpprettet)),
            variant: variant!
          })
        })
      })

      return {
        ...state,
        list: documents
      }
    }

    case types.JOARK_GET_SUCCESS:
      return {
        ...state,
        file: {
          journalpostId: action.context.journalpostId,
          tilleggsopplysninger: action.context.tilleggsopplysninger,
          tittel: action.context.tittel,
          tema: action.context.tema,
          dokumentInfoId: action.context.dokumentInfoId,
          datoOpprettet: action.context.datoOpprettet,
          variant: action.context.variant,
          name: action.payload.fileName,
          size: action.payload.filInnhold.length,
          mimetype: action.payload.contentType,
          content: {
            base64: action.payload.filInnhold
          }
        }
      }

    case types.JOARK_PREVIEW_SET:
      return {
        ...state,
        previewFile: action.payload
      }

    case types.JOARK_PREVIEW_SUCCESS:
      return {
        ...state,
        previewFile: {
          journalpostId: action.context.journalpostId,
          tilleggsopplysninger: action.context.tilleggsopplysninger,
          tittel: action.context.tittel,
          tema: action.context.tema,
          dokumentInfoId: action.context.dokumentInfoId,
          datoOpprettet: action.context.datoOpprettet,
          variant: action.context.variant,
          name: action.payload.fileName,
          size: action.payload.filInnhold.length,
          mimetype: action.payload.contentType,
          content: {
            base64: action.payload.filInnhold
          }
        }
      }

    default:
      return state
  }
}

export default joarkReducer
