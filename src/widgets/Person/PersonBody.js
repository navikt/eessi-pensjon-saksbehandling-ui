import React from 'react'
import { Undertekst } from 'nav-frontend-typografi'
import _ from 'lodash'

function PersonBody (props) {
  const { t, person } = props

  return <div className='w-100' style={{ columns: 3 }}>
    { !_.isEmpty(person) ? <div>
      <div>
        <Undertekst>{t('ui:diskresjonskode')}: {person.diskresjonskode}</Undertekst>
      </div>
      <div><Undertekst>{t('ui:strukturertAdresse')}</Undertekst>
        <div><Undertekst>{t('ui:landkode')}: {person.bostedsadresse.strukturertAdresse.landkode.value}</Undertekst></div>
        <div><Undertekst>{t('ui:tilleggsadresse')}:{person.bostedsadresse.strukturertAdresse.tilleggsadresse}</Undertekst></div>
        <div><Undertekst>{t('ui:tilleggsadresseType')}:{person.bostedsadresse.strukturertAdresse.tilleggsadresseType}</Undertekst></div>
        <div><Undertekst>{t('ui:poststed')}:{person.bostedsadresse.strukturertAdresse.poststed.value}</Undertekst></div>
        <div><Undertekst>{t('ui:bolignummer')}:{person.bostedsadresse.strukturertAdresse.bolignummer}</Undertekst></div>
        <div><Undertekst>{t('ui:kommunenummer')}:{person.bostedsadresse.strukturertAdresse.kommunenummer}</Undertekst></div>
        <div><Undertekst>{t('ui:gatenummer')}:{person.bostedsadresse.strukturertAdresse.gatenummer}</Undertekst></div>
        <div><Undertekst>{t('ui:gatenavn')}:{person.bostedsadresse.strukturertAdresse.gatenavn}</Undertekst></div>
        <div><Undertekst>{t('ui:husnummer')}:{person.bostedsadresse.strukturertAdresse.husnummer}</Undertekst></div>
        <div><Undertekst>{t('ui:husbokstav')}:{person.bostedsadresse.strukturertAdresse.husbokstav}</Undertekst></div>
      </div>
      <div><Undertekst>{t('ui:statsborgerskap')}:{person.statsborgerskap.land.value}</Undertekst></div>
      <div><Undertekst>{t('ui:personstatus')}:{person.personstatus.personstatus.value}</Undertekst></div>
      <div><Undertekst>{t('ui:postadresse')}:{person.postadresse}</Undertekst></div>
      <div><Undertekst>{t('ui:doedsdato')}:{person.doedsdato}</Undertekst></div>
      <div><Undertekst>{t('ui:foedselsdato')}:{person.foedselsdato.foedselsdato}</Undertekst></div>
      <div><Undertekst>{t('ui:foedested')}:{person.foedselsdato.foedested}</Undertekst></div>
      <div><Undertekst>{t('ui:gjeldendePostadressetype')}:{person.gjeldendePostadressetype.value}</Undertekst></div>
      <div><Undertekst>{t('ui:geografiskTilknytning')}:{person.geografiskTilknytning.geografiskTilknytning}</Undertekst></div>
      <div><Undertekst>{t('ui:midlertidigPostadresse')}:{person.midlertidigPostadresse}</Undertekst></div>
      <div><Undertekst>{t('ui:vergeListe')}:{person.vergeListe.join(', ')}</Undertekst></div>
      <div><Undertekst>{t('ui:kontaktinformasjon')}:{person.kontaktinformasjon.join(', ')}</Undertekst></div>
      <div><Undertekst>{t('ui:bankkonto')}:{person.bankkonto}</Undertekst></div>
      <div><Undertekst>{t('ui:tilrettelagtKommunikasjon')}:{person.tilrettelagtKommunikasjon.join(', ')}</Undertekst></div>
      <div><Undertekst>{t('ui:sikkerhetstiltak')}:{person.sikkerhetstiltak}</Undertekst></div>
      <div><Undertekst>{t('ui:maalform')}:{person.maalform}</Undertekst></div>
      <div><Undertekst>{t('ui:harFraRolleI')}:</Undertekst>
        {person.harFraRolleI.map(rolle => {
          let age
          if (rolle.tilPerson.foedselsdato) {
            const birthDate = new Date(Date.parse(rolle.tilPerson.foedselsdato))
            age = new Date().getFullYear() - birthDate.getFullYear()
          }
          return <div>
            <div><Undertekst>{t('ui:tilRolle')}:{rolle.tilRolle.value}</Undertekst></div>
            <div><Undertekst>{t('ui:tilPerson')}:{rolle.tilPerson.personnavn.sammensattNavn} - {age ? '(' + age + ')' : ''} - {rolle.tilPerson.aktoer.ident.ident}</Undertekst></div>
            <div>
              <Undertekst>{rolle.tilPerson.kjoenn} - {rolle.tilPerson.sivilstand}</Undertekst>
            </div>
          </div>
        })}
      </div>
    </div> : null}
  </div>
}

export default PersonBody
