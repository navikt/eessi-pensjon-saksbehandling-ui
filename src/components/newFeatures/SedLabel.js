import React from 'react'
import PanelBase from 'nav-frontend-paneler'
import * as Typography from 'nav-frontend-typografi'

import StatusLabel from './StatusLabel'
import './SedLabel.css'

function SedLabel(props){
    return <PanelBase className='panel mt-2 pl-0 pr-0 d-flex justify-content-between'>
            <div className='col-2 c-ui-mw-150 d-flex align-content-center c-ui-sed-name'><Typography.Element>{props.sed.name}</Typography.Element></div>
            <div className='col-4 c-ui-mw-250 d-flex c-ui-status pl-0 pr-0 justify-content-center'><StatusLabel className='col-auto' status={props.sed.status}/><div className='col'>{props.sed.date}</div></div>
            <div className='col-4 c-ui-mw-250 d-flex'><Typography.Element>{props.sed.country}:</Typography.Element>{props.sed.institution}</div>
            <div className='col-2 c-ui-mw-150'></div>
        </PanelBase>
}

SedLabel.defaultProps = {
    sed: {
        name: '',
        status: '',
        date: '',
        country: '',
        institution: ''
    }
}

export default SedLabel
