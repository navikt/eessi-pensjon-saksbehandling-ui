import { PersonIcon, HouseIcon, CalendarIcon, GlobeIcon, PersonRectangleIcon, HeartIcon } from '@navikt/aksel-icons'
import PostalCodes from 'src/components/PostalCodes/PostalCodes'
import { AllowedLocaleStringPropType } from 'src/declarations/app.pt'
import { PersonAvdod, PersonAvdods } from 'src/declarations/person.d'
import CountryData from '@navikt/land-verktoy'
import _ from 'lodash'
import moment from 'moment'
import { BodyLong, Box, Detail, HStack } from '@navikt/ds-react'
import PT from 'prop-types'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import PopoverCustomized from "src/components/Tooltip/PopoverCustomized";
import HorizontalLineSeparator from "src/components/HorizontalLineSeparator/HorizontalLineSeparator";
import styles from "./PersonBody.module.css";

const Element = styled.div`
  display: flex;
  align-items: baseline;
`
const MarginRow = styled(HStack)`
  margin: 1.5rem;
  display: flex;
`
const MarginColumn = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  flex: ${(props: any) => props.flex || 1};
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`
export const PersonBodyDiv = styled.div``

export interface PersonBodyProps {
  locale: string
  person: any
  personAvdods: PersonAvdods | undefined
}

const PersonBody: React.FC<PersonBodyProps> = ({
  locale,
  person,
  personAvdods
}: PersonBodyProps): JSX.Element | null => {
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
        id={'w-overview-PersonBody--element-' + label.replace('ui:', '')}
        data-testid={'w-overview-PersonBody--element-' + label.replace('ui:', '')}
      >
        <Detail>
          <strong>
            {t(label)}
          </strong>:
        </Detail>
        <Box paddingInline="4 0">
          <div className='navds-body-long'>
            {_value.map((val: any) => val)}
          </div>
        </Box>
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
        <PopoverCustomized label={<span>{label}</span>} key={"tooltip-" + + label + value}>
          <span key={value}>{value}</span>
        </PopoverCustomized>
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
      husnummer || husbokstav ?
        <span className={styles.horizontalSeparatorSpan} key={1} /> :
        <br key={1} />
    )
    adresse = addAddressLine(adresse, husnummer, t('ui:husnummer'),
      husbokstav ?
        <span className={styles.horizontalSeparatorSpan} key={2} /> :
        <br key={2} />
    )
    adresse = addAddressLine(adresse, husbokstav, t('ui:husbokstav'), <br key={3} />)
    const zipCode = _.get(person, category + '.vegadresse.postnummer')
    if (zipCode) {
      adresse = addAddressLine(adresse, zipCode, t('ui:poststed'),
        <span className={styles.horizontalSeparatorSpan} key={4} />
      )
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

  if (_.get(person, 'foedselsdato.foedselsdato')) {
    birthDateString = moment(person.foedselsdato.foedselsdato).format('DD.MM.YYYY')
  }
  if (_.get(person, 'doedsfall.doedsdato')) {
    deathDateString = moment(person.doedsfall.doedsdato).format('DD.MM.YYYY')
  }
  if (!_.isEmpty(person.statsborgerskap)) {
    let order = 0
    nationality = person.statsborgerskap.map((l: any) => {
      order += 1
      let label = (order>1 ? ', ' : "") + getCountry(l.land)
      if (l.gyldigFraOgMed) {
        label += ' (' + moment(l.gyldigFraOgMed).format('DD.MM.YYYY')
      }
      if (l.gyldigTilOgMed) {
        label += ' - ' + moment(l.gyldigTilOgMed).format('DD.MM.YYYY')
      }
      return label + (l.gyldigFraOgMed ? ')' : "")
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
      const label = t(type) +
        (type !== 'Null' && type !== 'Ugift' && dateString
          ? ' (' + dateString + ')'
          : '')
      return label
    })
  }

  return (
    <PersonBodyDiv data-testid="person-body-div">
      <MarginRow key="personBody-marginrow-1">
        <MarginColumn key="personBody-marginrow-1-margincolumn-1">
          <HStack gap="4">
            <HouseIcon title={t('ui:bostedsadresse')} fontSize="1.5rem" />
            {bostedsadresse ? renderEntity('ui:bostedsadresse', bostedsadresse) : null}
          </HStack>
        </MarginColumn>
        <MarginColumn key="personBody-marginrow-1-margincolumn-2">
          <HStack gap="4">
            <CalendarIcon title={t('ui:birthdate')} fontSize="1.5rem" />
            {renderEntity('ui:birthdate', birthDateString)}
          </HStack>
        </MarginColumn>
        <MarginColumn key="personBody-marginrow-1-margincolumn-3">
          <HStack gap="4">
            <PersonRectangleIcon title={t('ui:nationality')} fontSize="1.5rem"/>
            {renderEntity('ui:nationality', nationality)}
          </HStack>
        </MarginColumn>
      </MarginRow>
      <HorizontalLineSeparator />
      <MarginRow key="personBody-marginrow-2">
        <MarginColumn key="personBody-marginrow-2-margincolumn-1">
          <HStack gap="4">
            <GlobeIcon title={t('ui:oppholdsadresse')} fontSize="1.5rem" />
            {renderEntity('ui:oppholdsadresse', oppholdsadresse)}
          </HStack>
        </MarginColumn>
        <MarginColumn key="personBody-marginrow-2-margincolumn-2">
          <HStack gap="4">
            <HeartIcon title={t('ui:marital-status')} fontSize="1.5rem"/>
            {renderEntity('ui:marital-status', maritalStatus)}
          </HStack>
        </MarginColumn>
        <MarginColumn key="personBody-marginrow-2-margincolumn-3"/>
      </MarginRow>
      {((personAvdods && personAvdods.length > 0) || deathDateString) && (
        <>
          <HorizontalLineSeparator />
          <MarginRow key="personBody-marginrow-3">

            <MarginColumn key="personBody-marginrow-3-margincolumn-1">
              <PersonIcon fontSize="1.5rem" />
              <Box paddingInline="4 0">
                <Detail size='small'>
                  <strong>{t('ui:deceased')}</strong>:
                </Detail>
               </Box>
              <div>
                {personAvdods && personAvdods.length > 0
                  ? personAvdods.map((avdod: PersonAvdod) => (
                    <Element
                      key={avdod.fnr}
                      id='w-overview-PersonBody--element-deceased'
                    >
                      <Box paddingInline="4 0">
                        <BodyLong>
                          {avdod?.fornavn +
                            (avdod?.mellomnavn ? ' ' + avdod?.mellomnavn : '') +
                            (avdod?.etternavn ? ' ' + avdod?.etternavn : '') +
                            ' - ' + avdod.fnr}
                          {avdod.relasjon ? ' (' + t('buc:relasjon-' + avdod?.relasjon) + ')' : ''}
                          {avdod?.doedsDato ? ' (Dødsdato: ' + avdod.doedsDato + ')' : ''}

                        </BodyLong>
                      </Box>
                    </Element>
                  ))
                  : (
                    <Element
                        key='noAvdod'
                        id='w-overview-PersonBody--element-deceased'
                      >
                        <Box paddingInline="4 0">
                          <BodyLong>
                            {t('buc:form-noAvdod')}
                          </BodyLong>
                        </Box>
                      </Element>
                      )}
              </div>
            </MarginColumn>
            {deathDateString
              ? (
                <MarginColumn key="personBody-marginrow-3-margincolumn-2">
                  <HStack gap="4">
                    <CalendarIcon fontSize="1.5rem" />
                    {renderEntity('ui:deathdate', deathDateString)}
                  </HStack>
                </MarginColumn>
                )
              : (
                <MarginColumn key="personBody-marginrow-3-margincolumn-2"/>
                )}
          </MarginRow>
        </>
      )}
    </PersonBodyDiv>
  )
}

PersonBody.propTypes = {
  locale: AllowedLocaleStringPropType.isRequired,
  person: PT.object
}

export default PersonBody
