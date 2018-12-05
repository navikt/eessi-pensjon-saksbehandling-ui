import * as types from '../constants/actionTypes'

function omit (key, object) {
  let { [key]: remove, ...rest } = object
  return rest
}

const initialState = {
  etterNavnVedFodsel: '',
  tidligereNavn: '',
  fodested: '',
  provins: '',
  bankNavn: '',
  bankAddresse: '',
  bankKonto: '',
  iban: '',
  swift: '',
  utlandPersonTrygdeNummer: {},
  opplysningerOmOpphold: {},
  sivilstand: {},
}

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.E207_SET_STRING:
      return { ...state, [action.field]: action.payload }
    case types.E207_SET_OBJECT:
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          [action.key]: action.payload
        }
      }
    case types.E207_REMOVE_OBJECT:
      return {
        ...state,
        [action.field]: omit(action.key, state[action.field])
      }
    default:
      return state
  }
}