import * as types from 'constants/actionTypes'
import { PersonAvdods, PersonPDL } from 'declarations/person'
import { ActionWithPayload } from '@navikt/fetch'
import _ from 'lodash'
import moment from 'moment'
import { AnyAction } from 'redux'

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
        personPdl: action.payload
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
        personAvdods: action.payload
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
      const identer = action.payload.identer
      const fnrIdent = _.find(identer, (i) => {if(i.gruppe === "FOLKEREGISTERIDENT") return i})
      const aktoerIdIdent = _.find(identer, (i) => {if(i.gruppe === "AKTORID") return i})
      return {
        ...state,
        personAvdods: [{
            aktoerId: aktoerIdIdent.ident,
            etternavn: action.payload.navn.etternavn,
            fnr: fnrIdent.ident,
            fornavn: action.payload.navn.fornavn,
            fulltNavn: action.payload.navn.sammensattNavn,
            mellomnavn: action.payload.navn.mellomnavn,
            doedsDato: action.payload.doedsfall?.doedsdato
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
      if (_.isArray((action as ActionWithPayload).payload) && !_.isEmpty((action as ActionWithPayload).payload)) {
        try {
          gjpbp = moment(_.get((action as ActionWithPayload).payload[0], 'doedsdato'), 'YYYY-MM-DD').toDate()
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
        gjpbp: state.personAvdods && state.personAvdods.length > 0 ? moment(state.personAvdods[0].doedsDato, 'YYYY-MM-DD').toDate() : null
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
        uforetidspunkt = moment((action as ActionWithPayload).payload.uforetidspunkt, 'YYYY-MM-DD').toDate()
      } catch (e) {
        uforetidspunkt = null
      }

      try {
        virkningstidspunkt = moment((action as ActionWithPayload).payload.virkningstidspunkt, 'YYYY-MM-DD').toDate()
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
