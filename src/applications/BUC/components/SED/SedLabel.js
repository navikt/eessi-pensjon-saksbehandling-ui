import React from 'react'
import PT from 'prop-types'
import { Element, PanelBase } from 'components/ui/Nav'

import StatusLabel from './StatusLabel'
import './SedLabel.css'

const SedLabel = (props) => {
  const { t, sed } = props
  return <PanelBase className='a-buc-c-sed-sedlabel p-0'>
    <div className='content pt-3 pb-3'>
      <div className='col-2 d-flex align-content-center c-ui-sed-name'>
        <Element data-qa='SedLabel-name'>
          {sed.name}
        </Element>
      </div>
      <div className='col-4 d-flex c-ui-status pl-0 pr-0 justify-content-center'>
        <StatusLabel data-qa='SedLabel-StatusLabel' t={t} className='col-auto' status={sed.status} />
        <div data-qa='SedLabel-date' className='col'>
          {sed.date}
        </div>
      </div>
      <div className='col-4 d-flex flex-column'>
        {sed.institutions.map(el => {
          return <div key={el.country + el.institution} className='d-flex flex-row'>
          <Element data-qa='SedLabel-country'>{el.country}</Element>
          {': '}
          <span>{el.institution}</span>
         </div>
        })}
      </div>
      <div className='col-2' />
    </div>
  </PanelBase>
}

SedLabel.defaultProps = {
  sed: {
    name: '',
    status: '',
    date: '',
    country: '',
    institution: '',
    t: arg => arg
  }
}

SedLabel.propTypes = {
  t: PT.func.isRequired
}

export default SedLabel
