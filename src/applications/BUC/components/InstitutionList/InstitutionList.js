import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import { CountryData, Flag, Nav } from 'eessi-pensjon-ui'
import './InstitutionList.css'

const InstitutionList = ({ className, flagType = 'circle', institutions, institutionNames, locale, t, type }) => {
  const institutionList = {}
  if (institutions) {
    institutions.forEach(item => {
      if (Object.prototype.hasOwnProperty.call(institutionList, item.country)) {
        institutionList[item.country].push(item.institution)
      } else {
        institutionList[item.country] = [item.institution]
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
            <Flag label={country.label} country={landkode} size='M' type={flagType} />
            <Nav.Element className='pr-2 pl-2'>{country.label}: </Nav.Element>
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
          const label = institutionNames &&
          Object.prototype.hasOwnProperty.call(institutionNames, landkode + ':' + institutionId)
            ? institutionNames[landkode + ':' + institutionId]
            : institutionId
          return (
            <div className='a-buc-c-institution' key={institutionId}>
              <Flag label={country ? country.label : landkode} country={landkode} size='M' type={flagType}/>
              <Nav.Element className='pr-2 pl-2'>{country ? country.label : landkode}: </Nav.Element>
              <Nav.Normaltekst>{label}</Nav.Normaltekst>
            </div>
          )
        }) : null}
      </div>
    )
  })
}

InstitutionList.propTypes = {
  className: PT.string,
  flagType: PT.string,
  institutions: PT.array.isRequired,
  institutionNames: PT.object,
  locale: PT.string.isRequired,
  t: PT.func.isRequired,
  type: PT.string.isRequired
}

export default InstitutionList
