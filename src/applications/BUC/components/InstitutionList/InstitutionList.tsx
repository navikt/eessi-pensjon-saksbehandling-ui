import { countrySorter } from 'src/applications/BUC/components/BUCUtils/BUCUtils'
import { AllowedLocaleString } from 'src/declarations/app.d'
import { AllowedLocaleStringPropType } from 'src/declarations/app.pt'
import { InstitutionListMap, InstitutionNames, Institutions } from 'src/declarations/buc'
import { State } from 'src/declarations/reducers'
import Flag, { FlagType } from '@navikt/flagg-ikoner'
import CountryData, { Country } from '@navikt/land-verktoy'
import _ from 'lodash'
import { BodyLong } from '@navikt/ds-react'
import PT from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import classNames from 'classnames'

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

const InstitutionText = styled(BodyLong)`
  margin-left: 0.5rem;
  &.oneLine {
    white-space: nowrap;
  }
`

export interface InstitutionListProps {
  className?: string
  flag?: boolean
  flagType?: FlagType
  institutions: Institutions
  locale: AllowedLocaleString
  type?: InstitutionListType
  oneLine?: boolean
}

const InstitutionList: React.FC<InstitutionListProps> = ({
  className, flag = true, flagType = 'circle', institutions = [], locale, type = 'joined', oneLine = false, ...props
}: InstitutionListProps): JSX.Element => {
  const institutionList: InstitutionListMap<string> = {}
  const institutionNames: InstitutionNames = useSelector<State, InstitutionNames>(state => state.buc.institutionNames)
  const { t } = useTranslation()

  if (institutions) {
    institutions.forEach(item => {
      const institution: string = item.institution
      let country: string = item.country
      // Used for simulating sending to/from Norway to/from DK/FI (Q2-->Q1/Q1-->Q2)
      /*
      if (country === 'NO' && institution === 'NO:NAVAT06') {
        country = 'DK'
      }
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
      <InstitutionListDiv
        className={className}
        {...props}
      >
        <BodyLong>
          {t('buc:form-noInstitutionYet')}
        </BodyLong>
      </InstitutionListDiv>
      )
    : (
      <>
        {Object.keys(institutionList)
          .sort(countrySorter(locale) as (a: string, b: string) => number)
          .map((landkode: string) => {
            const country: Country = CountryData.getCountryInstance(locale).findByValue(landkode)
            return (
              <InstitutionListDiv
                className={className}
                key={landkode}
                {...props}
              >
                {type === 'joined' && (
                  <InstitutionDiv
                    data-testid='a_buc_c_institutionlist--div-id'
                    className={className}
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
                    <InstitutionText>
                      {institutionList[landkode].map((institution: string) => getLabel(institution)).join(', ')}
                    </InstitutionText>
                  </InstitutionDiv>
                )}
                {type === 'separated' && institutionList[landkode].map((institution : string) => (
                  <InstitutionDiv
                    key={institution}
                    data-testid='a_buc_c_institutionlist--div-id'
                    className={className}
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
                    <InstitutionText className={classNames({ oneLine })}>
                      {getLabel(institution)}
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
  locale: AllowedLocaleStringPropType.isRequired,
  type: PT.oneOf(['joined', 'separated'])
}

export default InstitutionList
