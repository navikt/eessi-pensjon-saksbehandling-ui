import { People, Home, Calender, Globe, Profile, Heart } from '@navikt/ds-icons'
import PostalCodes from 'components/PostalCodes/PostalCodes'
import { AllowedLocaleStringPropType } from 'declarations/app.pt'
import { PersonAvdod, PersonAvdods } from 'declarations/person.d'
import CountryData from 'land-verktoy'
import _ from 'lodash'
import moment from 'moment'
import { BodyLong, Detail } from '@navikt/ds-react'
import { Column, HorizontalSeparatorDiv, HorizontalSeparatorSpan, Row } from 'nav-hoykontrast'
import PT from 'prop-types'
import Tooltip from 'rc-tooltip'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const Element = styled.div`
  display: flex;
  align-items: baseline;
`
const Hr = styled.hr`
  margin: 1.5rem;
  border-color: var(--navds-semantic-color-border) !important;
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
export const PersonPanelDiv = styled.div``

export interface PersonPanelProps {
  locale: string
  person: any
  personAvdods: PersonAvdods | undefined
}

const PersonPanel: React.FC<PersonPanelProps> = ({
  locale,
  person,
  personAvdods
}: PersonPanelProps): JSX.Element | null => {
  const { t } = useTranslation()

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
        <Detail>
          <strong>
            {t(label)}
          </strong>:
        </Detail>
        <HorizontalSeparatorDiv />
        <BodyLong>
          {_value.map((val: any) => val)}
        </BodyLong>
      </Element>
    )
  }

  const addAddressLine = (
    address: Array<JSX.Element | string>,
    value: string | null,
    label: string,
    separator: JSX.Element
  ): Array<JSX.Element | string> => {
    if (value) {
      address.push((
        <Tooltip key={label + value} placement='top' trigger={['hover']} overlay={<span>{label}</span>}>
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

  const getDates = (person: any, category: string): string => {
    let beginDate = _.get(person, category + '.gyldigFraOgMed')
    if (beginDate) {
      beginDate = moment(beginDate).format('DD.MM.YYYY')
    }
    let endDate = ''
    if (_.get(person, category + '.gyldigTilOgMed')) {
      endDate = _.get(person, category + '.gyldigTilOgMed')
      if (endDate) {
        endDate = moment(endDate).format('DD.MM.YYYY')
      }
    }
    return beginDate + ' - ' + endDate
  }

  const getAddress = (person: any, category: string): Array<JSX.Element | string> => {
    if (!_.get(person, category + '.vegadresse')) {
      return []
    }
    let adresse: Array<JSX.Element | string> = []
    const husnummer = _.get(person, category + '.vegadresse.husnummer')
    const husbokstav = _.get(person, category + '.vegadresse.husbokstav')
    adresse = addAddressLine(adresse, getDates(person, category), t('ui:fram-og-til'), <br key={0} />)
    adresse = addAddressLine(adresse, _.get(person, category + '.vegadresse.adressenavn'), t('ui:adressenavn'),
      husnummer || husbokstav ? <HorizontalSeparatorSpan key={1} /> : <br key={1} />)
    adresse = addAddressLine(adresse, husnummer, t('ui:husnummer'), husbokstav ? <HorizontalSeparatorSpan key={2} /> : <br key={2} />)
    adresse = addAddressLine(adresse, husbokstav, t('ui:husbokstav'), <br key={3} />)
    const zipCode = _.get(person, category + '.vegadresse.postnummer')
    if (zipCode) {
      adresse = addAddressLine(adresse, zipCode, t('ui:poststed'), <HorizontalSeparatorSpan key={4} />)
      adresse = addAddressLine(adresse, PostalCodes.get(zipCode), t('ui:city'), <br key={5} />)
    }
    return adresse
  }

  if (!person) {
    return null
  }

  let birthDateString
  let deathDateString
  let nationality: Array<string> = []
  let maritalStatus: Array<string> = []
  const bostedsadresse: Array<JSX.Element | string> = getAddress(person, 'bostedsadresse')
  const oppholdsadresse: Array<JSX.Element | string> = getAddress(person, 'oppholdsadresse')

  if (_.get(person, 'foedsel.foedselsdato')) {
    birthDateString = moment(person.foedsel.foedselsdato).format('DD.MM.YYYY')
  }
  if (_.get(person, 'doedsfall.doedsdato')) {
    deathDateString = moment(person.doedsfall.doedsdato).format('DD.MM.YYYY')
  }
  if (!_.isEmpty(person.statsborgerskap)) {
    nationality = person.statsborgerskap.map((l: any) => {
      let label = getCountry(l.land)
      if (l.gyldigFraOgMed) {
        label += ' (' + moment(l.gyldigFraOgMed).format('DD.MM.YYYY')
      }
      if (l.gyldigTilOgMed) {
        label += ' - ' + moment(l.gyldigTilOgMed).format('DD.MM.YYYY')
      }
      return label + ')'
    })
  }

  if (!_.isEmpty(person.sivilstand)) {
    maritalStatus = person.sivilstand.map((s: any) => {
      let type = s.type.toLowerCase()
      type = type.charAt(0).toUpperCase() + type.slice(1)
      let dateString = ''
      if (s.gyldigFraOgMed) {
        dateString = moment(s.gyldigFraOgMed).format('DD.MM.YYYY')
      }
      if (s.gyldigTilOgMed) {
        dateString += ' - ' + moment(s.gyldigTilOgMed).format('DD.MM.YYYY')
      }
      const label = t('ui:widget-overview-maritalstatus-' + type) +
        (type !== 'Null' && type !== 'Ugif' && dateString
          ? ' (' + dateString + ')'
          : '')
      return label
    })
  }

  return (
    <PersonPanelDiv>
      <MarginRow>
        <MarginColumn>
          <Home />
          <HorizontalSeparatorDiv />
          {bostedsadresse ? renderEntity('ui:bostedsadresse', bostedsadresse) : null}
        </MarginColumn>
        <MarginColumn>
          <Calender />
          <HorizontalSeparatorDiv />
          {renderEntity('ui:birthdate', birthDateString)}
        </MarginColumn>
        <MarginColumn>
          <Profile />
          <HorizontalSeparatorDiv />
          {renderEntity('ui:nationality', nationality)}
        </MarginColumn>
      </MarginRow>
      <Hr />
      <MarginRow>
        <MarginColumn>
          <Globe />
          <HorizontalSeparatorDiv />
          {renderEntity('ui:oppholdsadresse', oppholdsadresse)}
        </MarginColumn>
        <MarginColumn>
          <Heart />
          <HorizontalSeparatorDiv />
          {renderEntity('ui:marital-status', maritalStatus)}
        </MarginColumn>
        <MarginColumn />
      </MarginRow>
      {((personAvdods && personAvdods.length > 0) || deathDateString) && (
        <>
          <Hr />
          <MarginRow>

            <MarginColumn>
              <People />
              <HorizontalSeparatorDiv />
              <Detail size='small'>
                <strong>{t('ui:deceased')}</strong>:
              </Detail>
              <div>
                {personAvdods && personAvdods.length > 0
                  ? personAvdods.map((avdod: PersonAvdod) => (
                    <Element
                      key={avdod.fnr}
                      id='w-overview-personPanel__element-deceased'
                    >
                      <HorizontalSeparatorDiv />
                      <BodyLong>
                        {avdod?.fornavn +
                      (avdod?.mellomnavn ? ' ' + avdod?.mellomnavn : '') +
                      (avdod?.etternavn ? ' ' + avdod?.etternavn : '') +
                      ' - ' + avdod.fnr + ' (' + t('buc:relasjon-' + avdod.relasjon) + ')'}
                      </BodyLong>
                    </Element>
                    ))
                  : (
                    <Element
                      key='noAvdod'
                      id='w-overview-personPanel__element-deceased'
                    >
                      <HorizontalSeparatorDiv />
                      <BodyLong>
                        {t('buc:form-noAvdod')}
                      </BodyLong>
                    </Element>
                    )}
              </div>
            </MarginColumn>

            {deathDateString
              ? (
                <MarginColumn>
                  <Calender />
                  <HorizontalSeparatorDiv />
                  {renderEntity('ui:deathdate', deathDateString)}
                </MarginColumn>
                )
              : (
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
  locale: AllowedLocaleStringPropType.isRequired,
  person: PT.object
}

export default PersonPanel
