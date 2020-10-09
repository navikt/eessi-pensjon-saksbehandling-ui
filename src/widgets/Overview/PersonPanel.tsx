import React from 'react'
import LineExpandedCalendar from 'assets/icons/line-version-expanded-calendar-3'
import LineExpandedGlobe from 'assets/icons/line-version-expanded-globe-2'
import LineHandbag from 'assets/icons/line-version-handbag-3'
import LineHeartCircle from 'assets/icons/line-version-heart-circle'
import LineHome from 'assets/icons/line-version-home-3'
import PersonIcon from 'assets/icons/line-version-person-2'
import PostalCodes from 'components/PostalCodes/PostalCodes'
import { Column, HorizontalSeparatorDiv, Row } from 'components/StyledComponents'
import { PersonAvdods } from 'declarations/person.d'
import { AllowedLocaleStringPropType } from 'declarations/app.pt'
import CountryData from 'land-verktoy'
import _ from 'lodash'
import moment from 'moment'
import { Normaltekst, Undertekst } from 'nav-frontend-typografi'
import { themeKeys } from 'nav-styled-component-theme'
import PT from 'prop-types'
import Tooltip from 'rc-tooltip'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export interface PersonPanelProps {
  highContrast: boolean
  locale: string
  person: any
  personAvdods: PersonAvdods | undefined
}

const PersonPanelDiv = styled.div``

const Hr = styled.hr`
  margin: 1.5rem;
  border-color: ${({ theme }) => theme[themeKeys.MAIN_BORDER_COLOR]} !important;
`
const MarginRow = styled(Row)`
  margin: 1.5rem;
  display: flex;
`
const MarginColumn = styled(Column)`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`
const Element = styled.div`
  display: flex;
  align-items: baseline;
`

const PersonPanel: React.FC<PersonPanelProps> = ({
  highContrast,
  locale,
  person,
  personAvdods
}: PersonPanelProps): JSX.Element | null => {
  const { t } = useTranslation()

  if (!person) {
    return null
  }

  let dateString = ''
  let birthDateString
  let deathDateString
  let nationality
  let maritalStatus
  let bostedsadresse: Array<JSX.Element | string> = []
  let postadresse: Array<JSX.Element | string> = []

  const renderEntity = (label: string, value: any): JSX.Element => {
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
      <Element
        id={'w-overview-personPanel__element-' + label.replace('ui:', '')}
      >
        <Undertekst>
          <strong>{t(label)}</strong>:
        </Undertekst>
        <HorizontalSeparatorDiv />
        <Normaltekst>
          {_value.map((val: any) => val)}
        </Normaltekst>
      </Element>
    )
  }

  const addAddressLine = (
    address: Array<JSX.Element | string>,
    value: string | null, label: string,
    separator: JSX.Element
  ): Array<JSX.Element | string> => {
    if (value) {
      address.push((
        <Tooltip placement='top' trigger={['hover']} overlay={<span>{label}</span>}>
          <span key={value}>{value}</span>
        </Tooltip>
      ))
      address.push(separator)
    }
    return address
  }

  const getCountry = (value: string): string | null => {
    const nationality = CountryData.getCountryInstance(locale).findByValue3(value)
    return nationality ? nationality.label : null
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
    bostedsadresse = addAddressLine(bostedsadresse, _.get(person, 'bostedsadresse.strukturertAdresse.gatenavn'), t('ui:gatenavn'), <HorizontalSeparatorDiv key={0} />)
    bostedsadresse = addAddressLine(bostedsadresse, _.get(person, 'bostedsadresse.strukturertAdresse.gatenummer'), t('ui:gatenummer'), <br key={1} />)
    bostedsadresse = addAddressLine(bostedsadresse, _.get(person, 'bostedsadresse.strukturertAdresse.husnummer'), t('ui:husnummer'), <br key={2} />)
    bostedsadresse = addAddressLine(bostedsadresse, _.get(person, 'bostedsadresse.strukturertAdresse.husbokstav'), t('ui:husbokstav'), <HorizontalSeparatorDiv key={3} />)
    bostedsadresse = addAddressLine(bostedsadresse, _.get(person, 'bostedsadresse.strukturertAdresse.tilleggsadresse'), t('ui:tilleggsadresse'), <br key={4} />)
    bostedsadresse = addAddressLine(bostedsadresse, zipCode, t('ui:poststed'), <HorizontalSeparatorDiv key={5} />)
    if (zipCode) {
      bostedsadresse = addAddressLine(bostedsadresse, PostalCodes.get(zipCode), t('ui:city'), <br key={6} />)
    }
  }

  if (_.get(person, 'postadresse.ustrukturertAdresse')) {
    postadresse = addAddressLine(postadresse, _.get(person, 'postadresse.ustrukturertAdresse.adresselinje1'), t('ui:adresse'), <br key={0} />)
    postadresse = addAddressLine(postadresse, _.get(person, 'postadresse.ustrukturertAdresse.adresselinje2'), t('ui:adresse'), <br key={1} />)
    postadresse = addAddressLine(postadresse, _.get(person, 'postadresse.ustrukturertAdresse.adresselinje3'), t('ui:adresse'), <br key={2} />)
    postadresse = addAddressLine(postadresse, _.get(person, 'postadresse.ustrukturertAdresse.adresselinje4'), t('ui:adresse'), <br key={3} />)
    postadresse = addAddressLine(postadresse, _.get(person, 'postadresse.ustrukturertAdresse.postnr'), t('ui:postnummer'), <HorizontalSeparatorDiv key={4} />)
    postadresse = addAddressLine(postadresse, _.get(person, 'postadresse.ustrukturertAdresse.poststed'), t('ui:poststed'), <br key={5} />)
    postadresse = addAddressLine(postadresse, getCountry(_.get(person, 'postadresse.ustrukturertAdresse.landkode.value')), t('ui:country'), <br key={6} />)
  }
  return (
    <PersonPanelDiv>
      <MarginRow>
        <MarginColumn>
          <LineHome color={highContrast ? 'white' : 'black'} />
          <HorizontalSeparatorDiv />
          {bostedsadresse ? renderEntity('ui:bostedsadresse', bostedsadresse) : null}
        </MarginColumn>
        <MarginColumn>
          <LineExpandedCalendar color={highContrast ? 'white' : 'black'} />
          <HorizontalSeparatorDiv />
          {renderEntity('ui:birthdate', birthDateString)}
        </MarginColumn>
        <MarginColumn>
          <LineHandbag color={highContrast ? 'white' : 'black'} />
          <HorizontalSeparatorDiv />
          {renderEntity('ui:nationality', nationality)}
        </MarginColumn>
      </MarginRow>
      <Hr />
      <MarginRow>
        <MarginColumn>
          <LineExpandedGlobe color={highContrast ? 'white' : 'black'} />
          <HorizontalSeparatorDiv />
          {renderEntity('ui:postadresse', postadresse)}
        </MarginColumn>
        <MarginColumn>
          <LineHeartCircle color={highContrast ? 'white' : 'black'} />
          <HorizontalSeparatorDiv />
          {renderEntity('ui:marital-status',
            t('ui:widget-overview-maritalstatus-' + maritalStatus) +
            (maritalStatus !== 'Null' && maritalStatus !== 'Ugif' && dateString
              ? ' (' + dateString + ')' : '')
          )}
        </MarginColumn>
        <MarginColumn />
      </MarginRow>
      {((personAvdods && personAvdods.length > 0) || deathDateString) && (
        <>
          <Hr />
          <MarginRow>
            {personAvdods && personAvdods.length > 0 && (
              <MarginColumn>
                <PersonIcon color={highContrast ? 'white' : 'black'} />
                <HorizontalSeparatorDiv />
                <Undertekst>
                  <strong>{t('ui:deceased')}</strong>:
                </Undertekst>
                <div>
                  {personAvdods.map(avdod => (
                    <Element
                      key={avdod?.fnr}
                      id='w-overview-personPanel__element-deceased'
                    >
                      <HorizontalSeparatorDiv />
                      <Normaltekst>
                        {avdod?.fornavn +
                      (avdod?.mellomnavn ? ' ' + avdod?.mellomnavn : '') +
                      (avdod?.etternavn ? ' ' + avdod?.etternavn : '') +
                      ' - ' + avdod?.fnr + ' (' + t('buc:relasjon-' + avdod.relasjon) + ')'}
                      </Normaltekst>
                    </Element>
                  ))}
                </div>
              </MarginColumn>
            )}
            {deathDateString ? (
              <MarginColumn>
                <LineExpandedCalendar color={highContrast ? 'white' : 'black'} />
                <HorizontalSeparatorDiv />
                {renderEntity('ui:deathdate', deathDateString)}
              </MarginColumn>
            ) : (
              <MarginColumn />
            )}
            <MarginColumn />
          </MarginRow>
        </>
      )}
    </PersonPanelDiv>
  )
}

PersonPanel.propTypes = {
  highContrast: PT.bool.isRequired,
  locale: AllowedLocaleStringPropType.isRequired,
  person: PT.object
}

export default PersonPanel
