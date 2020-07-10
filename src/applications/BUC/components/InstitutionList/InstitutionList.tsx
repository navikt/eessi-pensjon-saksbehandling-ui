import { InstitutionListMap, InstitutionNames, Institutions } from 'declarations/buc'
import { InstitutionsPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString } from 'declarations/types'
import { AllowedLocaleStringPropType } from 'declarations/types.pt'
import Flag from 'flagg-ikoner'
import CountryData from 'land-verktoy'
import _ from 'lodash'
import { Normaltekst } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

export interface InstitutionListProps {
  className?: string
  flag?: boolean
  flagType?: 'original' | 'circle'
  institutions: Institutions
  locale: AllowedLocaleString
  type?: string
}

const InstitutionListDiv = styled.div`
  display: flex;
  flex-direction: column;
`
const InstitutionDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const InstitutionText = styled(Normaltekst)`
  margin-left: 0.5rem;
`
const InstitutionList: React.FC<InstitutionListProps> = ({
  className, flag = true, flagType = 'circle', institutions = [], locale, type = 'joined'
}: InstitutionListProps): JSX.Element => {
  const institutionList: InstitutionListMap<string> = {}
  const institutionNames: InstitutionNames = useSelector<State, InstitutionNames>(state => state.buc.institutionNames)
  const { t } = useTranslation()

  if (institutions) {
    institutions.forEach(item => {
      let institution: string = item.institution
      const country: string = item.country
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
      {Object.keys(institutionList).map(landkode => {
        const country = CountryData.getCountryInstance(locale).findByValue(landkode)
        return (
          <InstitutionListDiv
            className={className}
            key={landkode}
          >
            {type === 'joined' && (
              <InstitutionDiv>
                {flag && (
                  <Flag
                    className='mr-2'
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
              <InstitutionDiv key={institutionId}>
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
  type: PT.string
}

export default InstitutionList
