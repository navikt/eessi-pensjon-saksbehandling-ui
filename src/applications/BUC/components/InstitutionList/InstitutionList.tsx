import { countrySorter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import { InstitutionListMap, InstitutionNames, Institutions } from 'declarations/buc'
import { InstitutionsPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString } from 'declarations/app.d'
import { AllowedLocaleStringPropType } from 'declarations/app.pt'
import Flag, { FlagType } from 'flagg-ikoner'
import CountryData, { Country } from 'land-verktoy'
import _ from 'lodash'
import { Normaltekst } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

const InstitutionDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  &:not(.noMargin) {
     margin-bottom: 0.35rem;
  }
`
const InstitutionListDiv = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`
export type InstitutionListType = 'joined' | 'separated'

const InstitutionText = styled(Normaltekst)`
  margin-left: 0.5rem;
`

export interface InstitutionListProps {
  className?: string
  flag?: boolean
  flagType?: FlagType
  institutions: Institutions
  locale: AllowedLocaleString
  type?: InstitutionListType
}

const InstitutionList: React.FC<InstitutionListProps> = ({
  className, flag = true, flagType = 'circle', institutions = [], locale, type = 'joined'
}: InstitutionListProps): JSX.Element => {
  const institutionList: InstitutionListMap<string> = {}
  const institutionNames: InstitutionNames = useSelector<State, InstitutionNames>(state => state.buc.institutionNames)
  const { t } = useTranslation()

  if (institutions) {
    institutions.forEach(item => {
      let institution: string = item.institution
      let country: string = item.country
      console.log(item.institution, item.country)
      if (country === 'NO' && institution === 'NO:NAVAT08') {
        country = 'AQ'
      }
      if (institution && institution.startsWith(country + ':')) {
        institution = institution.substring(institution.indexOf(':') + 1, institution.length)
      }
      if (Object.prototype.hasOwnProperty.call(institutionList, country)) {
        institutionList[country].push(institution)
      } else {
        institutionList[country] = [institution]
      }
    })
  }

  const getLabel = (landkode: string, institutionId: string): string => {
    return institutionNames &&
    Object.prototype.hasOwnProperty.call(institutionNames, landkode + ':' + institutionId)
      ? institutionNames[landkode + ':' + institutionId]
      : institutionId
  }

  return _.isEmpty(institutionList) ? (
    <InstitutionListDiv
      className={className}
    >
      <Normaltekst>
        {t('buc:form-noInstitutionYet')}
      </Normaltekst>
    </InstitutionListDiv>
  ) : (
    <>
      {Object.keys(institutionList)
        .sort(countrySorter(locale) as (a: string, b: string) => number)
        .map((landkode: string) => {
          const country: Country = CountryData.getCountryInstance(locale).findByValue(landkode)
          return (
            <InstitutionListDiv
              className={className}
              key={landkode}
            >
              {type === 'joined' && (
                <InstitutionDiv
                  data-test-id='a-buc-c-institutionlist__div-id'
                  className={className}
                >
                  {flag && (
                    <Flag
                      label={country ? country.label : landkode}
                      country={landkode}
                      size='S'
                      type={flagType}
                    />
                  )}
                  <InstitutionText>
                    {institutionList[landkode].map((institutionId: string) => getLabel(landkode, institutionId)).join(', ')}
                  </InstitutionText>
                </InstitutionDiv>
              )}
              {type === 'separated' && institutionList[landkode].map((institutionId : string) => (
                <InstitutionDiv
                  key={institutionId}
                  data-test-id='a-buc-c-institutionlist__div-id'
                  className={className}
                >
                  {flag && (
                    <Flag
                      label={country ? country.label : landkode}
                      country={landkode}
                      size='S'
                      type={flagType}
                    />
                  )}
                  <InstitutionText>
                    {getLabel(landkode, institutionId)}
                  </InstitutionText>
                </InstitutionDiv>
              ))}
            </InstitutionListDiv>
          )
        })}
    </>
  )
}

InstitutionList.propTypes = {
  className: PT.string,
  flag: PT.bool,
  flagType: PT.oneOf(['original', 'circle']),
  institutions: InstitutionsPropType.isRequired,
  locale: AllowedLocaleStringPropType.isRequired,
  type: PT.oneOf(['joined', 'separated'])
}

export default InstitutionList
