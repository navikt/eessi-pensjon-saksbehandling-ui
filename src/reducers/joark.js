import * as types from '../constants/actionTypes'
import _ from 'lodash'

export const initialJoarkState = {
  list: undefined,
  file: undefined,
  previewFile: undefined
}

const joarkReducer = (state = initialJoarkState, action = {}) => {
  let item, base64

  switch (action.type) {
    case types.JOARK_LIST_SUCCESS:
      let documents = []
      action.payload.data.dokumentoversiktBruker.journalposter.forEach(post => {
        let registeredDate = _.find(post.relevanteDatoer, { datotype: 'DATO_REGISTRERT' })
        let varianter = _.find(post.dokumentvarianter, { variantformat: 'ARKIV' })
        post.dokumenter.forEach(doc => {
          documents.push({
            tilleggsopplysninger: post.tilleggsopplysninger,
            journalpostId: post.journalpostId,
            tittel: doc.tittel,
            tema: post.tema,
            dokumentInfoId: doc.dokumentInfoId,
            datoOpprettet: post.datoOpprettet,
            datoRegistrert: registeredDate ? new Date(Date.parse(registeredDate.dato)) : undefined,
            varianter: doc.dokumentvarianter.map(varianter => { return varianter.variantformat })
          })
        })
      })

      return {
        ...state,
        list: documents
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
          datoRegistrert: action.context.datoRegistrert,
          variant: action.context.variant,
          name: action.payload.fileName,
          size: action.payload.base64.length,
          mimetype: action.payload.contentType,
          content: {
            base64: action.payload.base64
          }
        }
      }

    case types.JOARK_PREVIEW_SUCCESS:

      item = action.context
      base64 = action.payload
      let previewFile = {
        journalpostId: item.journalpostId,
        tilleggsopplysninger: item.tilleggsopplysninger,
        tittel: item.tittel,
        tema: item.tema,
        dokumentInfoId: item.dokumentInfoId,
        datoOpprettet: item.datoOpprettet,
        datoRegistrert: item.rdatoRegistrert,
        name: item.tittel,
        size: base64.length,
        mimetype: 'application/pdf',
        content: {
          base64: base64
        }
      }
      return {
        ...state,
        previewFile: previewFile
      }

    default:
      return state
  }
}

export default joarkReducer
