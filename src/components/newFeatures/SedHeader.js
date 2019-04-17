import React from 'react'
import { Element } from 'nav-frontend-typografi'

export default (props)=>{
    return (
        <div className='SedContainer d-flex justify-content-between'>
            <div className='col-2 c-ui-mw-150'><Element>Navn på sed</Element></div>
            <div className='col-4 c-ui-mw-250'><Element>Status</Element></div>
            <div className='col-4 c-ui-mw-250'><Element>Mottaker/Avsender</Element></div>
            <div className='col-2 c-ui-mw-150'></div>
        </div>
    )
}