import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import Flag from 'components/Flag/Flag'
import CountryData from 'components/CountryData/CountryData'
import { Element, Normaltekst } from 'components/Nav'
import './InstitutionList.css'

const InstitutionList = (props) => {
  const { className, institutions, institutionNames, locale, t, type } = props

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
    return <Normaltekst>{t('buc:form-noInstitutionYet')}</Normaltekst>
  }

  return Object.keys(institutionList).map(landkode => {
    const country = CountryData.findByValue(locale, landkode)
    return <div
      id='a-buc-c-institutionlist-id'
      className={classNames('a-buc-c-institutionlist', className)}
      key={landkode}>
      {type === 'joined' ? <div className='a-buc-c-institution'>
        <Flag label={country.label} country={landkode} size='M' />
        <Element className='pr-2 pl-2'>{country.label}: </Element>
        <Normaltekst>{institutionList[landkode].map(institutionId => {
          return institutionNames &&
          Object.prototype.hasOwnProperty.call(institutionNames, landkode + ':' + institutionId)
            ? institutionNames[landkode + ':' + institutionId]
            : institutionId
        }).join(', ')}</Normaltekst>
      </div> : null}
      {type === 'separated' ? institutionList[landkode].map(institutionId => {
        const label = institutionNames &&
          Object.prototype.hasOwnProperty.call(institutionNames, landkode + ':' + institutionId)
          ? institutionNames[landkode + ':' + institutionId]
          : institutionId
        return <div className='a-buc-c-institution' key={institutionId}>
          <Flag label={country ? country.label : landkode} country={landkode} size='M' />
          <Element className='pr-2 pl-2'>{country ? country.label : landkode}: </Element>
          <Normaltekst>{label}</Normaltekst>
        </div>
      }) : null}
    </div>
  })
}

InstitutionList.propTypes = {
  className: PT.string,
  institutions: PT.array.isRequired,
  institutionNames: PT.object,
  locale: PT.string.isRequired,
  t: PT.func.isRequired,
  type: PT.string.isRequired
}

export default InstitutionList
