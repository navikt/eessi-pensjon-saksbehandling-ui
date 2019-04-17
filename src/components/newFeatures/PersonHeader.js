import React from 'react'
import { Systemtittel , Undertekst} from 'nav-frontend-typografi';

import { ReactComponent as MannIcon } from '../../resources/images/mann.svg'

export default (props) => {
    return (
        <div className='d-flex w-100'>
            <div>
                <MannIcon />
            </div>
            <div className='w-100'>
                <div className='col-12'>
                    <Systemtittel>{props.fullName} ({props.age}) - {props.personID}</Systemtittel>
                </div>
                <div className='col-12 d-flex'>
                    <div className='pr-5 mr-5'>
                        <Undertekst>Land: {props.country} </Undertekst>
                    </div>
                    <div>
                        <Undertekst className='pl-2'>Sivilstand: {props.maritalStatus}</Undertekst>
                    </div>
                </div>
            </div>
        </div>
    )
}