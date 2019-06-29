import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect } from 'store'
import Flag from 'components/ui/Flag/Flag'
import countries from 'components/ui/CountrySelect/CountrySelectData'
import { Element, Normaltekst } from 'components/ui/Nav'

import './InstitutionList.css'

const mapStateToProps = (state) => {
  return {
    institutionNames: state.buc.institutionNames
  }
}

const InstitutionList = (props) => {
  const { institutions, institutionNames, t, type, locale } = props

  let institutionList = {}
  if (institutions) {
    institutions.forEach(item => {
      if (institutionList.hasOwnProperty(item.country)) {
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
    const country = _.find(countries[locale], { value: landkode })
    return <div
      id='a-buc-c-institutionlist-id'
      className='a-buc-c-institutionlist'
      key={landkode}>
      {type === 'joined' ? <div className='a-buc-c-institution'>
        <Flag label={country.label} country={landkode} size='M' />
        <Element className='pr-2 pl-2'>{country.label}: </Element>
        <Normaltekst>{institutionList[landkode].map(institutionId => {
          return institutionNames.hasOwnProperty(landkode + ':' + institutionId)
            ? institutionNames[landkode + ':' + institutionId] : institutionId
        }).join(', ')}</Normaltekst>
      </div> : null}
      {type === 'separated' ? institutionList[landkode].map(institutionId => {
        const label = institutionNames.hasOwnProperty(landkode + ':' + institutionId)
          ? institutionNames[landkode + ':' + institutionId] : institutionId
        return <div className='a-buc-c-institution' key={institutionId}>
          <Flag label={country.label} country={landkode} size='M' />
          <Element className='pr-2 pl-2'>{country.label}: </Element>
          <Normaltekst>{label}</Normaltekst>
        </div>
      }) : null}
    </div>
  })
}

InstitutionList.propTypes = {
  t: PT.func.isRequired,
  type: PT.string.isRequired,
  institutions: PT.array.isRequired,
  institutionNames: PT.object.isRequired,
  locale: PT.string.isRequired
}

export default connect(mapStateToProps, () => {})(InstitutionList)
