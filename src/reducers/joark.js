import * as types from 'constants/actionTypes'

export const initialJoarkState = {
  list: undefined,
  file: undefined,
  previewFile: undefined
}

const joarkReducer = (state = initialJoarkState, action = {}) => {
  switch (action.type) {
    case types.JOARK_LIST_SUCCESS: {
      const documents = []
      action.payload.data.dokumentoversiktBruker.journalposter.forEach(post => {
        post.dokumenter.forEach(doc => {
          documents.push({
            tilleggsopplysninger: post.tilleggsopplysninger,
            journalpostId: post.journalpostId,
            tittel: doc.tittel,
            tema: post.tema,
            dokumentInfoId: doc.dokumentInfoId,
            datoOpprettet: new Date(Date.parse(post.datoOpprettet)),
            varianter: doc.dokumentvarianter.map(variant => {
              return {
                variantformat: variant.variantformat,
                filnavn: variant.filnavn
              }
            })
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
