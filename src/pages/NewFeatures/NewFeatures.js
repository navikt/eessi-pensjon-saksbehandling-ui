import React from 'react'
import { withTranslation } from 'react-i18next'

import Person from './Person'
import SedList from './SedList'

import './NewFeatures.css'

export function NewFeatures (props) {
  const { t } = props

  return <div className='newFeatureBackground'>
    <div className='newFeatureContainer pr-5 pl-5'>
      <Person t={t}/>
      <SedList t={t}/>
    </div>
  </div>
}

export default withTranslation('newFeatures')(NewFeatures)
