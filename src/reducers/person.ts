import * as types from 'src/constants/actionTypes'
import { PersonAvdods, PersonPDL } from 'src/declarations/person'
import { ActionWithPayload } from '@navikt/fetch'
import _ from 'lodash'
import { AnyAction } from 'redux'
import dayjs from "dayjs";

export interface PersonState {
  personPdl: PersonPDL | undefined
  personAvdods: PersonAvdods | undefined
  gjpbp: Date | null | undefined
  uforetidspunkt: Date | null | undefined
  virkningstidspunkt: Date | null | undefined
}

export const initialPersonState: PersonState = {
  personPdl: undefined,
  personAvdods: undefined,
  gjpbp: undefined,
  uforetidspunkt: undefined,
  virkningstidspunkt: undefined
}

const personReducer = (state: PersonState = initialPersonState, action: AnyAction) => {
  switch (action.type) {
    case types.PERSON_DATA_CLEAR:
      return initialPersonState

    case types.PERSON_PDL_REQUEST:

      return {
        ...state,
        personPdl: undefined
      }

    case types.PERSON_PDL_FAILURE:

      return {
        ...state,
        personPdl: null
      }

    case types.PERSON_PDL_SUCCESS:

      return {
        ...state,
        personPdl: action.payload.result
      }

    case types.PERSON_AVDOD_REQUEST:

      return {
        ...state,
        personAvdods: undefined
      }

    case types.PERSON_AVDOD_FAILURE:

      return {
        ...state,
        personAvdods: null
      }

    case types.PERSON_AVDOD_SUCCESS:

      return {
        ...state,
        personAvdods: action.payload.result
      }

    case types.PERSON_AVDOD_FROM_AKTOERID_REQUEST:

      return {
        ...state,
        personAvdods: undefined
      }

    case types.PERSON_AVDOD_FROM_AKTOERID_FAILURE:

      return {
        ...state,
        personAvdods: null
      }

    case types.PERSON_AVDOD_FROM_AKTOERID_SUCCESS:
      const identer = action.payload.result.identer
      const fnrIdent = _.find(identer, (i) => {if(i.gruppe === "FOLKEREGISTERIDENT") return i})
      const aktoerIdIdent = _.find(identer, (i) => {if(i.gruppe === "AKTORID") return i})
      return {
        ...state,
        personAvdods: [{
            aktoerId: aktoerIdIdent.ident,
            etternavn: action.payload.result.navn.etternavn,
            fnr: fnrIdent.ident,
            fornavn: action.payload.result.navn.fornavn,
            fulltNavn: action.payload.result.navn.sammensattNavn,
            mellomnavn: action.payload.result.navn.mellomnavn,
            doedsDato: action.payload.result.doedsfall?.doedsdato
          }
        ]
      }

    case types.PERSON_GJP_BP_REQUEST:

      return {
        ...state,
        gjpbp: undefined

      }

    case types.PERSON_GJP_BP_FAILURE:

      return {
        ...state,
        gjpbp: null
      }

    case types.PERSON_GJP_BP_SUCCESS: {
      let gjpbp: Date | null |undefined
      if (_.isArray((action as ActionWithPayload).payload.result) && !_.isEmpty((action as ActionWithPayload).payload.result)) {
        try {
          gjpbp = dayjs(_.get((action as ActionWithPayload).payload.result[0], 'doedsdato'), 'YYYY-MM-DD').toDate()
        } catch (e) {
        }
      }

      return {
        ...state,
        gjpbp
      }
    }

    case types.PERSON_SET_GJP_BP:
      return {
        ...state,
        gjpbp: state.personAvdods && state.personAvdods.length > 0 ? dayjs(state.personAvdods[0].doedsDato, 'YYYY-MM-DD').toDate() : null
      }

    case types.PERSON_UFT_REQUEST:

      return {
        ...state,
        uforetidspunkt: undefined,
        virkningstidspunkt: undefined
      }

    case types.PERSON_UFT_SUCCESS: {
      let uforetidspunkt, virkningstidspunkt
      try {
        uforetidspunkt = dayjs((action as ActionWithPayload).payload.uforetidspunkt, 'YYYY-MM-DD').toDate()
      } catch (e) {
        uforetidspunkt = null
      }

      try {
        virkningstidspunkt = dayjs((action as ActionWithPayload).payload.virkningstidspunkt, 'YYYY-MM-DD').toDate()
      } catch (e) {
        virkningstidspunkt = null
      }

      return {
        ...state,
        uforetidspunkt,
        virkningstidspunkt
      }
    }

    case types.PERSON_UFT_FAILURE:
      return {
        ...state,
        uforetidspunkt: null,
        virkningstidspunkt: null
      }

    default:
      return state
  }
}

export default personReducer
