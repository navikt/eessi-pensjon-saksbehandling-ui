import React, {JSX} from 'react'
import { countrySorter } from 'src/applications/BUC/components/BUCUtils/BUCUtils'
import { AllowedLocaleString } from 'src/declarations/app.d'
import { InstitutionListMap, InstitutionNames, Institutions } from 'src/declarations/buc'
import { State } from 'src/declarations/reducers'
import Flag, { FlagType } from '@navikt/flagg-ikoner'
import CountryData, { Country } from '@navikt/land-verktoy'
import _ from 'lodash'
import {BodyLong, HStack, VStack} from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

export type InstitutionListType = 'joined' | 'separated'

export interface InstitutionListProps {
  flag?: boolean
  flagType?: FlagType
  institutions: Institutions
  locale: AllowedLocaleString
  type?: InstitutionListType
}

const InstitutionList: React.FC<InstitutionListProps> = ({
  flag = true, flagType = 'circle', institutions = [], locale, type = 'joined', ...props
}: InstitutionListProps): JSX.Element => {
  const institutionList: InstitutionListMap<string> = {}
  const institutionNames: InstitutionNames = useSelector<State, InstitutionNames>(state => state.buc.institutionNames)
  const { t } = useTranslation()

  if (institutions) {
    institutions.forEach(item => {
      const institution: string = item.institution
      let country: string = item.country
      // Used for simulating sending to/from Norway to/from DK/FI (Q2-->Q1/Q1-->Q2)
      if (country === 'NO' && institution === 'NO:NAVAT05') {
        country = 'DK'
      }
      /*
      if (country === 'NO' && institution === 'NO:NAVAT08') {
        country = 'FI'
      }
      */
      if (Object.prototype.hasOwnProperty.call(institutionList, country)) {
        institutionList[country].push(institution)
      } else {
        institutionList[country] = [institution]
      }
    })
  }

  const getLabel = (institution: string): string => {
    return institutionNames &&
    Object.prototype.hasOwnProperty.call(institutionNames, institution)
      ? institutionNames[institution].name
      : institution
  }

  return _.isEmpty(institutionList)
    ? (
      <VStack
        {...props}
      >
        <BodyLong>
          {t('buc:form-noInstitutionYet')}
        </BodyLong>
      </VStack>
      )
    : (
      <>
        {Object.keys(institutionList)
          .sort(countrySorter(locale) as (a: string, b: string) => number)
          .map((landkode: string) => {
            const country: Country = CountryData.getCountryInstance(locale).findByValue(landkode)
            return (
              <VStack
                key={landkode}
                {...props}
              >
                {type === 'joined' && (
                  <HStack
                    data-testid='a_buc_c_institutionlist--div-id'
                    align="center"
                    wrap={false}
                    gap="2"
                    paddingInline="0 2"

                  >
                    {flag && (
                      <Flag
                        animate
                        label={country ? country.label : landkode}
                        country={landkode}
                        size='S'
                        type={flagType}
                        wave={false}
                      />
                    )}
                    <BodyLong>
                      {institutionList[landkode].map((institution: string) => getLabel(institution)).join(', ')}
                    </BodyLong>
                  </HStack>
                )}
                {type === 'separated' && institutionList[landkode].map((institution : string) => (
                  <HStack
                    key={institution}
                    data-testid='a_buc_c_institutionlist--div-id'
                    align="center"
                    wrap={false}
                    gap="2"
                    paddingInline="0 2"
                  >
                    {flag && (
                      <Flag
                        animate
                        label={country ? country.label : landkode}
                        country={landkode}
                        size='S'
                        type={flagType}
                        wave={false}
                      />
                    )}
                    <BodyLong>
                      {getLabel(institution)}
                    </BodyLong>
                  </HStack>
                ))}
              </VStack>
            )
          })}
      </>
      )
}

export default InstitutionList
