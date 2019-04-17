import React from 'react'

import Flag from './Flag'

function FlagList(props) {
    return (
        <div className = 'd-flex'>
            {props.countries.map((country, index)=>(
                (index > props.overflowLimit-1)
                ? null
                : <Flag className='m-1' key={index} flagPath={props.flagPath} country={country} extention={props.extention} />
            ))}
            {props.countries.length > props.overflowLimit
            ?   <span className='ml-1 pt-2'>+{props.countries.length-2}</span>
            :   null
            }
        </div>
    )
}

FlagList.defaultProps = {
    countries: [],
    overflowLimit: 0,
    flagPath: '',
    extention: ''
}

export default FlagList