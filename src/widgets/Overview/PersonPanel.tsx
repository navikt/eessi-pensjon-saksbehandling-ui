import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import Ui from 'eessi-pensjon-ui'
import { T } from 'types'

export interface PersonPanelProps {
  highContrast: boolean;
  locale: string;
  person: any;
  t: T
}

const PersonPanel = ({ highContrast, locale, person, t }: PersonPanelProps) => {
  if (!person) {
    return null
  }

  let dateString = ''
  let birthDateString
  let deathDateString
  let nationality
  let maritalStatus
  let bostedsadresse: Array<JSX.Element | Element | string> = []
  let postadresse: Array<JSX.Element | Element | string> = []

  const renderEntity = (label: string, value: any) => {
    let _value
    if (!value) {
      _value = [t('ui:notRegistered')]
    } else {
      _value = typeof value === 'string' ? [value] : value
    }
    if (_.isEmpty(_value)) {
      _value = [t('ui:notRegistered')]
    }
    return (
      <div
        id={'w-overview-personPanel__element-' + label.replace('ui:', '')}
        className='w-overview-personPanel__element'
      >
        <Ui.Nav.Undertekst className='mr-2'>
          <strong>{t(label)}</strong>:
        </Ui.Nav.Undertekst>
        <Ui.Nav.Normaltekst>
          {_value.map((val: any) => val)}
        </Ui.Nav.Normaltekst>
      </div>
    )
  }

  const addAddressLine = (address: Array<JSX.Element | Element | string>, value: string | null, label: string, separator: JSX.Element): Array<JSX.Element | Element | string> => {
    if (value) {
      address.push(<span key={value} data-tip={label}>{value}</span>)
      address.push(separator)
    }
    return address
  }

  const getCountry = (value: string): string | null => {
    const nationality = Ui.CountryData.getCountryInstance(locale).findByValue3(value)
    if (nationality) {
      return nationality.label
    }
    return null
  }

  if (_.get(person, 'sivilstand.fomGyldighetsperiode')) {
    dateString = moment(person.sivilstand.fomGyldighetsperiode).format('DD.MM.YYYY')
  }
  if (_.get(person, 'sivilstand.tomGyldighetsperiode')) {
    dateString += ' - ' + moment(person.sivilstand.tomGyldighetsperiode).format('DD.MM.YYYY')
  }
  if (_.get(person, 'foedselsdato.foedselsdato')) {
    birthDateString = moment(person.foedselsdato.foedselsdato).format('DD.MM.YYYY')
  }
  if (_.get(person, 'doedsdato.doedsdato')) {
    deathDateString = moment(person.doedsdato.doedsdato).format('DD.MM.YYYY')
  }
  if (_.get(person, 'statsborgerskap.land.value')) {
    nationality = getCountry(person.statsborgerskap.land.value)
  }

  if (_.get(person, 'sivilstand.sivilstand.value')) {
    maritalStatus = person.sivilstand.sivilstand.value.toLowerCase()
    maritalStatus = maritalStatus.charAt(0).toUpperCase() + maritalStatus.slice(1)
  }

  const zipCode = _.get(person, 'bostedsadresse.strukturertAdresse.poststed.value')

  if (_.get(person, 'bostedsadresse.strukturertAdresse')) {
    bostedsadresse = addAddressLine(bostedsadresse, _.get(person, 'bostedsadresse.strukturertAdresse.gatenavn'), t('ui:gatenavn'), <span key={0} className='mr-2' />)
    bostedsadresse = addAddressLine(bostedsadresse, _.get(person, 'bostedsadresse.strukturertAdresse.gatenummer'), t('ui:gatenummer'), <br key={1} />)
    bostedsadresse = addAddressLine(bostedsadresse, _.get(person, 'bostedsadresse.strukturertAdresse.husnummer'), t('ui:husnummer'), <br key={2} />)
    bostedsadresse = addAddressLine(bostedsadresse, _.get(person, 'bostedsadresse.strukturertAdresse.husbokstav'), t('ui:husbokstav'), <span key={3} className='mr-2' />)
    bostedsadresse = addAddressLine(bostedsadresse, _.get(person, 'bostedsadresse.strukturertAdresse.tilleggsadresse'), t('ui:tilleggsadresse'), <br key={4} />)
    bostedsadresse = addAddressLine(bostedsadresse, zipCode, t('ui:poststed'), <span className='mr-2' key={5} />)
    if (zipCode) {
      bostedsadresse = addAddressLine(bostedsadresse, Ui.PostalCodes.get(zipCode), t('ui:city'), <br key={6} />)
    }
  }

  if (_.get(person, 'postadresse.ustrukturertAdresse')) {
    postadresse = addAddressLine(postadresse, _.get(person, 'postadresse.ustrukturertAdresse.adresselinje1'), t('ui:adresse'), <br key={0} />)
    postadresse = addAddressLine(postadresse, _.get(person, 'postadresse.ustrukturertAdresse.adresselinje2'), t('ui:adresse'), <br key={1} />)
    postadresse = addAddressLine(postadresse, _.get(person, 'postadresse.ustrukturertAdresse.adresselinje3'), t('ui:adresse'), <br key={2} />)
    postadresse = addAddressLine(postadresse, _.get(person, 'postadresse.ustrukturertAdresse.adresselinje4'), t('ui:adresse'), <br key={3} />)
    postadresse = addAddressLine(postadresse, _.get(person, 'postadresse.ustrukturertAdresse.postnr'), t('ui:postnummer'), <span key={4} className='mr-2' />)
    postadresse = addAddressLine(postadresse, _.get(person, 'postadresse.ustrukturertAdresse.poststed'), t('ui:poststed'), <br key={5} />)
    postadresse = addAddressLine(postadresse, getCountry(_.get(person, 'postadresse.ustrukturertAdresse.landkode.value')), t('ui:country'), <br key={6} />)
  }
  return (
    <>
      <Ui.Nav.Row className='w-overview-personPanel__content m-4'>
        <div className='w-overview-personPanel__item col-md-4'>
          <div className='mr-2'>
            <Ui.Icons kind='nav-home' color={highContrast ? 'white' : 'black'} />
          </div>
          {bostedsadresse ? renderEntity('ui:bostedsadresse', bostedsadresse) : null}
        </div>
        <div className='w-overview-personPanel__item col-md-4'>
          <div className='mr-2'>
            <Ui.Icons kind='calendar' color={highContrast ? 'white' : 'black'} />
          </div>
          {renderEntity('ui:birthdate', birthDateString)}
        </div>
        <div className='w-overview-personPanel__item col-md-4'>
          <div className='mr-2'>
            <Ui.Icons kind='nav-work' color={highContrast ? 'white' : 'black'} />
          </div>
          {renderEntity('ui:nationality', nationality)}
        </div>
      </Ui.Nav.Row>
      <hr className='m-4' />
      <Ui.Nav.Row className='w-overview-personPanel__content m-4'>
        <div className='w-overview-personPanel__item col-md-4'>
          <div className='mr-2'>
            <Ui.Icons kind='address' color={highContrast ? 'white' : 'black'} />
          </div>
          {renderEntity('ui:postadresse', postadresse)}
        </div>
        <div className='w-overview-personPanel__item col-md-4'>
          <div className='mr-2'>
            <Ui.Icons kind='calendar' color={highContrast ? 'white' : 'black'} />
          </div>
          {renderEntity('ui:deathdate', deathDateString)}
        </div>
        <div className='w-overview-personPanel__item col-md-4'>
          <div className='mr-2'>
            <Ui.Icons kind='nav-child' color={highContrast ? 'white' : 'black'} />
          </div>
          {renderEntity('ui:marital-status',
            t('ui:widget-overview-maritalstatus-' + maritalStatus) +
            (maritalStatus !== 'Null' && maritalStatus !== 'Ugif' && dateString
              ? ' (' + dateString + ')' : '')
          )}
        </div>
      </Ui.Nav.Row>
    </>
  )
}

PersonPanel.propTypes = {
  highContrast: PT.bool,
  locale: PT.string,
  person: PT.object,
  t: PT.func.isRequired
}

export default PersonPanel
