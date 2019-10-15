import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import { Nav, CountryData } from 'eessi-pensjon-ui'
import PT from 'prop-types'

const PersonPanel = ({ t, person }) => {
  if (!person) {
    return null
  }

  let dateString = ''
  let birthDateString
  let deathDateString
  let nationality
  let maritalStatus
  let bostedsadresse = []
  let postadresse = []

  const renderEntity = (label, value) => {
    if (!value) {
      return null
    }
    const _value = typeof value === 'string' ? [value] : value
    if (!_(_value).isEmpty()) {
      return (
        <div
          id={'w-overview-personPanel__element-' + label.replace('ui:', '')}
          className='w-overview-personPanel__element'
        >
          <Nav.Undertekst>
            <strong>{t(label)}</strong>: {_value.map(val => val)}
          </Nav.Undertekst>
        </div>
      )
    }
  }

  const addAddressLine = (address, person, param, label) => {
    const value = _.get(person, param)
    if (value) {
      address.push(label ? <span>{label}: {value}</span> : <span>{value}</span>)
      address.push(<br />)
    }
    return address
  }

  const getCountry = (value) => {
    const nationality = CountryData.findByValue3('nb', value)
    if (nationality) {
      return nationality.label
    }
    return null
  }

  if (_.get(person, 'sivilstand.fomGyldighetsperiode')) {
    dateString = moment(person.sivilstand.fomGyldighetsperiode).format('D.M.Y')
  }
  if (_.get(person, 'sivilstand.tomGyldighetsperiode')) {
    dateString += ' - ' + moment(person.sivilstand.tomGyldighetsperiode).format('D.M.Y')
  }
  if (person.foedselsdato.foedselsdato) {
    birthDateString = moment(person.foedselsdato.foedselsdato).format('D.M.Y')
  }
  if (person.doedsdato.doedsdato) {
    deathDateString = moment(person.doedsdato.doedsdato).format('D.M.Y')
  }
  if (person.statsborgerskap.land.value) {
    nationality = getCountry(person.statsborgerskap.land.value)
  }

  if (person.sivilstand.sivilstand.value) {
    maritalStatus = person.sivilstand.sivilstand.value.toLowerCase()
    maritalStatus = maritalStatus.charAt(0).toUpperCase() + maritalStatus.slice(1)
  }

  if (person.bostedsadresse && person.bostedsadresse.strukturertAdresse) {
    bostedsadresse = addAddressLine(bostedsadresse, person, 'bostedsadresse.strukturertAdresse.gatenavn', t('ui:gatenavn'))
    bostedsadresse = addAddressLine(bostedsadresse, person, 'bostedsadresse.strukturertAdresse.gatenummer', t('ui:gatenummer'))
    bostedsadresse = addAddressLine(bostedsadresse, person, 'bostedsadresse.strukturertAdresse.husnummer', t('ui:husnummer'))
    bostedsadresse = addAddressLine(bostedsadresse, person, 'bostedsadresse.strukturertAdresse.husbokstav', t('ui:husbokstav'))
    bostedsadresse = addAddressLine(bostedsadresse, person, 'bostedsadresse.strukturertAdresse.kommunenummer', t('ui:kommunenummer'))
    bostedsadresse = addAddressLine(bostedsadresse, person, 'bostedsadresse.strukturertAdresse.tilleggsadresse', t('ui:tilleggsadresse'))
    bostedsadresse = addAddressLine(bostedsadresse, person, 'bostedsadresse.strukturertAdresse.tilleggsadresseType', t('ui:tilleggsadresseType'))
    bostedsadresse = addAddressLine(bostedsadresse, person, 'bostedsadresse.strukturertAdresse.poststed.value', t('ui:poststed'))
  }

  if (person.postadresse && person.postadresse.ustrukturertAdresse) {
    postadresse = addAddressLine(postadresse, person, 'postadresse.ustrukturertAdresse.adresselinje1')
    postadresse = addAddressLine(postadresse, person, 'postadresse.ustrukturertAdresse.adresselinje2')
    postadresse = addAddressLine(postadresse, person, 'postadresse.ustrukturertAdresse.adresselinje3')
    postadresse = addAddressLine(postadresse, person, 'postadresse.ustrukturertAdresse.adresselinje4')
    postadresse = addAddressLine(postadresse, person, 'postadresse.ustrukturertAdresse.postnr')
    postadresse = addAddressLine(postadresse, person, 'postadresse.ustrukturertAdresse.poststed')
    const country = getCountry(_.get(person, 'postadresse.ustrukturertAdresse.landkode.value'))
    if (country) postadresse.push(country)
  }

  return (
    <Nav.Row className='w-overview-personPanel__content'>
      <div className='col-md-4'>
      {renderEntity('ui:birthdate', birthDateString)}
      {renderEntity('ui:deathdate', deathDateString)}
      {renderEntity('ui:nationality', nationality)}
      </div>
      <div className='col-md-4'>
      {renderEntity('ui:marital-status',maritalStatus + (dateString ? ', ' + dateString : ''))}
      </div>
      <div className='col-md-4'>
      {renderEntity('ui:bostedsadresse', bostedsadresse)}
      {renderEntity('ui:postadresse', postadresse)}
      </div>
    </Nav.Row>
  )
}

PersonPanel.propTypes = {
  t: PT.func.isRequired,
  person: PT.object
}

export default PersonPanel
