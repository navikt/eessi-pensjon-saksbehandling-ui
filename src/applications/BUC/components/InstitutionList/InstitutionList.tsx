import classNames from 'classnames'
import { InstitutionListMap, InstitutionNames, Institutions } from 'declarations/buc'
import { InstitutionsPropType } from 'declarations/buc.pt'
import { AllowedLocaleString, T } from 'declarations/types'
import { AllowedLocaleStringPropType, TPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
import { State } from 'declarations/reducers'
import './InstitutionList.css'

export interface InstitutionListProps {
  className?: string;
  flag?: boolean;
  flagType?: string;
  institutions: Institutions;
  locale: AllowedLocaleString;
  t: T;
  type?: string;
}

const InstitutionList: React.FC<InstitutionListProps> = ({
  className, flag = true, flagType = 'circle', institutions = [], locale, t, type = 'joined'
}: InstitutionListProps): JSX.Element => {
  const institutionList: InstitutionListMap<string> = {}
  const institutionNames: InstitutionNames = useSelector<State, InstitutionNames>(state => state.buc.institutionNames)
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
    <div
      className={classNames('a-buc-c-institutionlist', className)}
    >
      <Ui.Nav.Normaltekst>{t('buc:form-noInstitutionYet')}</Ui.Nav.Normaltekst>
    </div>
  ) : (
    <>
      {Object.keys(institutionList).map(landkode => {
        const country = Ui.CountryData.getCountryInstance(locale).findByValue(landkode)
        return (
          <div
            className={classNames('a-buc-c-institutionlist', className)}
            key={landkode}
          >
            {type === 'joined' ? (
              <div className='a-buc-c-institutionlist__institution'>
                {flag ? <Ui.Flag className='mr-2' label={country ? country.label : landkode} country={landkode} size='M' type={flagType} /> : null}
                <Ui.Nav.Normaltekst>
                  {institutionList[landkode].map((institutionId: string) => getLabel(landkode, institutionId)).join(', ')}
                </Ui.Nav.Normaltekst>
              </div>
            ) : null}
            {type === 'separated' ? institutionList[landkode].map((institutionId : string) => (
              <div className='a-buc-c-institutionlist__institution' key={institutionId}>
                {flag ? <Ui.Flag className='mr-2' label={country ? country.label : landkode} country={landkode} size='M' type={flagType} /> : null}
                <Ui.Nav.Normaltekst>
                  {getLabel(landkode, institutionId)}
                </Ui.Nav.Normaltekst>
              </div>
            )) : null}
          </div>
        )
      })}
    </>
  )
}

InstitutionList.propTypes = {
  className: PT.string,
  flag: PT.bool,
  flagType: PT.string,
  institutions: InstitutionsPropType.isRequired,
  locale: AllowedLocaleStringPropType.isRequired,
  t: TPropType.isRequired,
  type: PT.string
}

export default InstitutionList
