import { PersonIcon, HouseIcon, CalendarIcon, GlobeIcon, PersonRectangleIcon, HeartIcon } from '@navikt/aksel-icons'
import PostalCodes from 'src/components/PostalCodes/PostalCodes'
import { PersonAvdod, PersonAvdods } from 'src/declarations/person.d'
import CountryData from '@navikt/land-verktoy'
import _ from 'lodash'
import moment from 'moment'
import {BodyLong, Box, HGrid, HStack, Label, VStack} from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import PopoverCustomized from "src/components/Tooltip/PopoverCustomized";
import HorizontalLineSeparator from "src/components/HorizontalLineSeparator/HorizontalLineSeparator";
import styles from "./PersonBody.module.css";


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
      <VStack
        id={'w-overview-PersonBody--element-' + label.replace('ui:', '')}
        data-testid={'w-overview-PersonBody--element-' + label.replace('ui:', '')}
        align="baseline"
      >
        <Label>
          {t(label)}:
        </Label>
        <Box>
          <div className='navds-body-long'>
            {_value.map((val: any) => val)}
          </div>
        </Box>
      </VStack>
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
    nationality = person.statsborgerskap.map((l: any) => {
      let label = getCountry(l.land)
      if (l.gyldigFraOgMed) {
        label += ' (' + moment(l.gyldigFraOgMed).format('DD.MM.YYYY')
      }
      if (l.gyldigTilOgMed) {
        label += ' - ' + moment(l.gyldigTilOgMed).format('DD.MM.YYYY')
      }
      return <>{label + (l.gyldigFraOgMed ? ')' : "")}<br/></>
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
    <div data-testid="person-body-div">
      <HGrid columns={3} gap="4" padding="8" align="start">
        <HStack gap="4" align="start">
          <HouseIcon title={t('ui:bostedsadresse')} fontSize="1.5rem" />
          {bostedsadresse ? renderEntity('ui:bostedsadresse', bostedsadresse) : null}
        </HStack>
        <HStack gap="4" align="start">
          <CalendarIcon title={t('ui:birthdate')} fontSize="1.5rem" />
          {renderEntity('ui:birthdate', birthDateString)}
        </HStack>
        <HStack gap="4" align="start">
          <PersonRectangleIcon title={t('ui:nationality')} fontSize="1.5rem"/>
          {renderEntity('ui:nationality', nationality)}
        </HStack>
      </HGrid>
      <HorizontalLineSeparator />
      <HGrid columns={3} gap="4" padding="8" align="start">
        <HStack gap="4">
          <GlobeIcon title={t('ui:oppholdsadresse')} fontSize="1.5rem" />
          {renderEntity('ui:oppholdsadresse', oppholdsadresse)}
        </HStack>
        <HStack gap="4">
          <HeartIcon title={t('ui:marital-status')} fontSize="1.5rem"/>
          {renderEntity('ui:marital-status', maritalStatus)}
        </HStack>
      </HGrid>
      {((personAvdods && personAvdods.length > 0) || deathDateString) && (
        <>
          <HorizontalLineSeparator />
          <HGrid columns={3} gap="4" padding="8" align="start">
            <HStack gap="4">
              <PersonIcon fontSize="1.5rem" />
              <VStack>
                <Label>{t('ui:deceased')}:</Label>
                <div>
                  {personAvdods && personAvdods.length > 0
                    ? personAvdods.map((avdod: PersonAvdod) => (
                      <div
                        key={avdod.fnr}
                        id='w-overview-PersonBody--element-deceased'
                      >
                        <Box>
                          <BodyLong>
                            {avdod?.fornavn +
                              (avdod?.mellomnavn ? ' ' + avdod?.mellomnavn : '') +
                              (avdod?.etternavn ? ' ' + avdod?.etternavn : '') +
                              ' - ' + avdod.fnr}
                            {avdod.relasjon ? ' (' + t('buc:relasjon-' + avdod?.relasjon) + ')' : ''}<br/>
                            {avdod?.doedsDato ? ' (Dødsdato: ' + avdod.doedsDato + ')' : ''}
                          </BodyLong>
                        </Box>
                      </div>
                    ))
                    : (
                      <div
                        key='noAvdod'
                        id='w-overview-PersonBody--element-deceased'
                      >
                        <Box paddingInline="4 0">
                          <BodyLong>
                            {t('buc:form-noAvdod')}
                          </BodyLong>
                        </Box>
                      </div>
                    )}
                </div>
              </VStack>
            </HStack>
            {deathDateString
              ? (

                  <HStack gap="4">
                    <CalendarIcon fontSize="1.5rem" />
                    {renderEntity('ui:deathdate', deathDateString)}
                  </HStack>
              )
              : (
                <></>
              )}
          </HGrid>
        </>
      )}
    </div>
  )
}

export default PersonBody
