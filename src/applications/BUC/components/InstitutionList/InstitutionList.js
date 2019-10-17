import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import { CountryData, Flag, Nav } from 'eessi-pensjon-ui'
import './InstitutionList.css'

const InstitutionList = ({ className, flag = true, flagType = 'circle', institutions, institutionNames, locale, t, type }) => {
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
    return <Nav.Normaltekst>{t('buc:form-noInstitutionYet')}</Nav.Normaltekst>
  }

  return Object.keys(institutionList).map(landkode => {
    const country = CountryData.findByValue(locale, landkode)

    return (
      <div
        id='a-buc-c-institutionlist-id'
        className={classNames('a-buc-c-institutionlist', className)}
        key={landkode}
      >
        {type === 'joined' ? (
          <div className='a-buc-c-institution'>
            {flag ? <Flag className='mr-2' label={country.label} country={landkode} size='M' type={flagType} /> : null}
            <Nav.Normaltekst>{institutionList[landkode].map(institutionId => {
              return institutionNames &&
          Object.prototype.hasOwnProperty.call(institutionNames, landkode + ':' + institutionId)
                ? institutionNames[landkode + ':' + institutionId]
                : institutionId
            }).join(', ')}
            </Nav.Normaltekst>
          </div>
        ) : null}
        {type === 'separated' ? institutionList[landkode].map(institutionId => {
          return (
            <div className='a-buc-c-institution' key={institutionId}>
              {flag ? <Flag className='mr-2' label={country ? country.label : landkode} country={landkode} size='M' type={flagType} /> : null}
              <Nav.Normaltekst>{
                institutionNames &&
                Object.prototype.hasOwnProperty.call(institutionNames, landkode + ':' + institutionId)
                  ? institutionNames[landkode + ':' + institutionId]
                  : institutionId
              }
              </Nav.Normaltekst>
            </div>
          )
        }) : null}
      </div>
    )
  })
}

InstitutionList.propTypes = {
  className: PT.string,
  flag: PT.bool,
  flagType: PT.string,
  institutions: PT.array.isRequired,
  institutionNames: PT.object,
  locale: PT.string.isRequired,
  t: PT.func.isRequired,
  type: PT.string.isRequired
}

export default InstitutionList
