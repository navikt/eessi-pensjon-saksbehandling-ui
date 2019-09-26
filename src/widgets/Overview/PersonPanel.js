import React from 'react'
import _ from 'lodash'
import classNames from 'classnames'
import moment from 'moment'
import { Undertekst } from 'components/Nav'
import PT from 'prop-types'

const PersonPanel = (props) => {
  const { t, person } = props

  if (!person) {
    return null
  }

  let dateString = ''

  const renderEntity = (label, value) => {
    const isValue = !_.isEmpty(value)
    return (
      <div
        id={'w-overview-personPanel__element-' + label.replace('ui:', '')}
        className='w-overview-personPanel__element'
      >
        <Undertekst className={classNames({ grey: !isValue })}>
          <span className={classNames({ 'font-weight-bold': isValue })}>
            {t(label)}
          </span>
        : {value}
        </Undertekst>
      </div>
    )
  }

  if (_.get(person, 'sivilstand.fomGyldighetsperiode')) {
    dateString = moment(person.sivilstand.fomGyldighetsperiode).format('Y-M-D')
  }
  if (_.get(person, 'sivilstand.tomGyldighetsperiode')) {
    dateString += ' - ' + moment(person.sivilstand.tomGyldighetsperiode).format('Y-M-D')
  }

  return (

    <div className='w-overview-personPanel__content'>
      {person.bostedsadresse && person.bostedsadresse.strukturertAdresse
        ? (
          <>
            <div>
              <Undertekst>{t('ui:strukturertAdresse')}</Undertekst>
            </div>
            <div className='pl-4'>
              {renderEntity('ui:landkode', person.bostedsadresse.strukturertAdresse.landkode.value)}
              {renderEntity('ui:tilleggsadresse', person.bostedsadresse.strukturertAdresse.tilleggsadresse)}
              {renderEntity('ui:tilleggsadresseType', person.bostedsadresse.strukturertAdresse.tilleggsadresseType)}
              {renderEntity('ui:poststed', person.bostedsadresse.strukturertAdresse.poststed.value)}
              {renderEntity('ui:bolignummer', person.bostedsadresse.strukturertAdresse.bolignummer)}
              {renderEntity('ui:kommunenummer', person.bostedsadresse.strukturertAdresse.kommunenummer)}
              {renderEntity('ui:gatenummer', person.bostedsadresse.strukturertAdresse.gatenummer)}
              {renderEntity('ui:gatenavn', person.bostedsadresse.strukturertAdresse.gatenavn)}
              {renderEntity('ui:husnummer', person.bostedsadresse.strukturertAdresse.husnummer)}
              {renderEntity('ui:husbokstav', person.bostedsadresse.strukturertAdresse.husbokstav)}
            </div>
          </>
        ) : null}
      {person.postadresse && person.postadresse.ustrukturertAdresse
        ? (
          <>
            <div>
              <Undertekst>{t('ui:ustrukturertAdresse')}</Undertekst>
            </div>
            <div className='pl-4'>
              {renderEntity('ui:adresselinje1', person.postadresse.ustrukturertAdresse.adresselinje1)}
              {renderEntity('ui:adresselinje2', person.postadresse.ustrukturertAdresse.adresselinje2)}
              {renderEntity('ui:adresselinje3', person.postadresse.ustrukturertAdresse.adresselinje3)}
              {renderEntity('ui:adresselinje4', person.postadresse.ustrukturertAdresse.adresselinje4)}
              {renderEntity('ui:landkode', person.postadresse.ustrukturertAdresse.landkode.value)}
              {renderEntity('ui:postnr', person.postadresse.ustrukturertAdresse.postnr)}
              {renderEntity('ui:poststed', person.postadresse.ustrukturertAdresse.poststed)}
            </div>
          </>
        ) : null}
      {renderEntity('ui:statsborgerskap', person.statsborgerskap.land.value)}
      {renderEntity('ui:diskresjonskode', person.diskresjonskode)}
      {renderEntity('ui:marital-status', person.sivilstand.sivilstand.value + (dateString ? ' (' + dateString + ')' : ''))}
      {renderEntity('ui:personstatus', person.personstatus.personstatus.value)}
      {renderEntity('ui:doedsdato', person.doedsdato ? person.doedsdato.doedsdato : null)}
      {renderEntity('ui:foedselsdato', person.foedselsdato.foedselsdato)}
      {renderEntity('ui:foedested', person.foedselsdato.foedested)}
      {renderEntity('ui:gjeldendePostadressetype', person.gjeldendePostadressetype.value)}
      {renderEntity('ui:geografiskTilknytning', person.geografiskTilknytning.geografiskTilknytning)}
      {renderEntity('ui:midlertidigPostadresse', person.midlertidigPostadresse)}
      {renderEntity('ui:vergeListe', person.vergeListe.join(', '))}
      {renderEntity('ui:kontaktinformasjon', person.kontaktinformasjon.join(', '))}
      {renderEntity('ui:bankkonto', person.bankkonto)}
      {renderEntity('ui:tilrettelagtKommunikasjon', person.tilrettelagtKommunikasjon.join(', '))}
      {renderEntity('ui:sikkerhetstiltak', person.sikkerhetstiltak)}
      {renderEntity('ui:maalform', person.maalform)}
      {person.harFraRolleI ? (
        <>
          <div>
            <Undertekst>{t('ui:harFraRolleI')}</Undertekst>
          </div>
          <div className='pl-4'>
            {person.harFraRolleI.map((rolle, i) => {
              let age
              if (rolle.tilPerson.foedselsdato) {
                const birthDate = new Date(Date.parse(rolle.tilPerson.foedselsdato))
                age = new Date().getFullYear() - birthDate.getFullYear()
              }
              return (
                <div key={i}>
                  {renderEntity('ui:tilRolle', rolle.tilRolle.value)}
                  {renderEntity('ui:tilPerson', rolle.tilPerson.personnavn.sammensattNavn + ' - ' +
              (age ? '(' + age + ')' : '') + ' - ' + rolle.tilPerson.aktoer.ident.ident)}
                </div>
              )
            })}
          </div>
        </>
      ) : null}
    </div>
  )
}

PersonPanel.propTypes = {
  t: PT.func.isRequired,
  person: PT.object
}

export default PersonPanel
