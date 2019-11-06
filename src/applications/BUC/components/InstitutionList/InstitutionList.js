import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import { CountryData, Flag, Nav } from 'eessi-pensjon-ui'
import './InstitutionList.css'

const InstitutionList = ({ className, flag = true, flagType = 'circle', institutions = [], institutionNames, locale, t, type = 'joined' }) => {
  const institutionList = {}
  if (institutions) {
    institutions.forEach(item => {
      let institution = item.institution
      const country = item.country
      if (institution.startsWith(country + ':')) {
        institution = institution.substring(institution.indexOf(':') + 1, institution.length)
      }
      if (Object.prototype.hasOwnProperty.call(institutionList, country)) {
        institutionList[country].push(institution)
      } else {
        institutionList[country] = [institution]
      }
    })
  }

  if (_.isEmpty(institutionList)) {
    return (
      <div
        className={classNames('a-buc-c-institutionlist', className)}
      >
        <Nav.Normaltekst>{t('buc:form-noInstitutionYet')}</Nav.Normaltekst>
      </div>
    )
  }

  const getLabel = (landkode, institutionId) => {
    return institutionNames &&
    Object.prototype.hasOwnProperty.call(institutionNames, landkode + ':' + institutionId)
      ? institutionNames[landkode + ':' + institutionId]
      : institutionId
  }

  return Object.keys(institutionList).map(landkode => {
    const country = CountryData.findByValue(locale, landkode)
    return (
      <div
        className={classNames('a-buc-c-institutionlist', className)}
        key={landkode}
      >
        {type === 'joined' ? (
          <div className='a-buc-c-institutionlist__institution'>
            {flag ? <Flag className='mr-2' label={country.label} country={landkode} size='M' type={flagType} /> : null}
            <Nav.Normaltekst>
              {institutionList[landkode].map(institutionId => getLabel(landkode, institutionId)).join(', ')}
            </Nav.Normaltekst>
          </div>
        ) : null}
        {type === 'separated' ? institutionList[landkode].map(institutionId => (
          <div className='a-buc-c-institutionlist__institution' key={institutionId}>
            {flag ? <Flag className='mr-2' label={country ? country.label : landkode} country={landkode} size='M' type={flagType} /> : null}
            <Nav.Normaltekst>
              {getLabel(landkode, institutionId)}
            </Nav.Normaltekst>
          </div>
        )) : null}
      </div>
    )
  })
}

InstitutionList.propTypes = {
  className: PT.string,
  flag: PT.bool,
  flagType: PT.string,
  institutions: PT.array,
  institutionNames: PT.object,
  locale: PT.string.isRequired,
  t: PT.func.isRequired,
  type: PT.string
}

export default InstitutionList
