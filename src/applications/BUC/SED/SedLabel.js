import React from 'react'
import PanelBase from 'nav-frontend-paneler'
import * as Typography from 'nav-frontend-typografi'

import StatusLabel from '../StatusLabel'
import './SedLabel.css'

function SedLabel (props) {
  const { t } = props
  return <PanelBase className='a-buc-sed-sedlabel panel mt-2 pl-0 pr-0 d-flex justify-content-between'>
    <div className='col-2 c-ui-mw-150 d-flex align-content-center c-ui-sed-name'>
      <Typography.Element data-qa='SedLabel-name'>
        {props.sed.name}
      </Typography.Element>
    </div>
    <div className='col-4 c-ui-mw-250 d-flex c-ui-status pl-0 pr-0 justify-content-center'>
      <StatusLabel data-qa='SedLabel-StatusLabel' t={t} className='col-auto' status={props.sed.status} />
      <div data-qa='SedLabel-date' className='col'>
        {props.sed.date}
      </div>
    </div>
    <div className='col-4 c-ui-mw-250 d-flex'>
      <Typography.Element data-qa='SedLabel-country'>
        {props.sed.country}
      </Typography.Element>
      <span data-qa='SedLabel-institution'>
        {':  ' + props.sed.institution}
      </span>
    </div>
    <div className='col-2 c-ui-mw-150' />
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

export default SedLabel
