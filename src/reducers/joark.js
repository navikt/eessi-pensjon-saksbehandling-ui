import * as types from '../constants/actionTypes'
import _ from 'lodash'

export const initialJoarkState = {
  list: undefined,
  file: undefined,
  previewFile: undefined
}

const joarkReducer = (state = initialJoarkState, action = {}) => {
  switch (action.type) {
    case types.JOARK_LIST_SUCCESS:
      let documents = []
      action.payload.data.dokumentoversiktBruker.journalposter.forEach(it => {
        let registeredDate = _.find(it.relevanteDatoer, {datotype : 'DATO_REGISTRERT'})
        it.dokumenter.forEach(it2 => {
          documents.push({
            tilleggsopplysninger: it.tilleggsopplysninger,
            journalpostId : it.journalpostId,
            tittel: it2.tittel,
            tema: it.tema,
            dokumentInfoId: it2.dokumentInfoId,
            datoOpprette : it.datoOpprettet,
            datoRegistrert: registeredDate ? new Date(Date.parse(registeredDate.dato)) : undefined
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
          ...action.context,
          content: {
             base64: action.payload
          }
        }
      }

    case types.JOARK_PREVIEW_SUCCESS:
      return {
        ...state,
        previewFile: action.payload
      }

    default:
      return state
  }
}

export default joarkReducer
