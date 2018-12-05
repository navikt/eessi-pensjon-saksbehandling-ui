import * as types from '../constants/actionTypes'

function setString(field, payload) {
  return {
    type: types.E207_SET_STRING,
    field: field,
    payload: payload
  }
}

function setObject(field, key, payload) {
  return {
    type: types.E207_SET_OBJECT,
    field: field,
    key: key,
    payload: payload
  }
}

function removeObject(field, key) {
  return {
    type: type.E207_REMOVE_OBJECT,
    field: field,
    key: key
  }
}

export function setEtternavnVedFodsel(payload) {
  return setString('etterNavnVedFodsel', payload)
}
export function setTidligereNavn(payload) {
  return setString('tidligereNavn', payload)
}
export function setFodested(payload) {
  return setString('fodested', payload)
}

export function setProvins(payload) {
  return setString('provins', payload)
}
export function setBankNavn(payload) {
  return setString('bankNavn', payload)
}
export function setBankAddresse(payload) {
  return setString('bankAddresse', payload)
}

export function setBankKonto(payload) {
  return setString('bankKonto', payload)
}
export function setIban(payload) {
  return setString('iban', payload)
}
export function setSwift(payload) {
  return setString('swift', payload)
}

export function setUtlandPersonTrygdeNummer(key, payload) {
  return setObject('utlandPersonTrygdeNummer', key, payload)
}
export function removeUtlandPersonTrygdeNummer(key) {
  return removeObject('utlandPersonTrygdeNummer', key)
}

export function setOpplysningerOmOpphold(key, payload) {
  return setObject('opplysningerOmOpphold', key, payload)
}
export function removeOpplysningerOmOpphold(key) {
  return removeObject('opplysningerOmOpphold', key)
}

export function setSivilstand(key, payload) {
  return setObject('sivilstand', key, payload)
}
export function removeSivilstand(key) {
  return removeObject('sivilstand', key)
}