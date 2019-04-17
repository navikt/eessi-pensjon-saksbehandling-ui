import React from 'react'

import * as Typografi from 'nav-frontend-typografi'
import Tekstomrade from 'nav-frontend-tekstomrade'
import { Knapp } from 'nav-frontend-knapper'

import FlagList from './FlagList'

import { ReactComponent as ProblemCircle } from '../../resources/images/report-problem-circle.svg'
import { ReactComponent as BubbleChat } from '../../resources/images/bubble-chat-2.svg'

import './BucHeader.css'

function preventDefault(onClick){
    return function onClickHandler(e){
        e.preventDefault()
        e.stopPropagation()
        onClick(e)
    }
}

function BucHeader(props){
    return (
    <div className='p-0 w-100 d-flex justify-content-between'>
        <div className='col-3'>
            <Typografi.Ingress className='font-weight-bold'>{props.type + ' - ' + props.name}</Typografi.Ingress>
            <Typografi.Normaltekst>{'Opprettet: '+ props.dateCreated}</Typografi.Normaltekst>
        </div>
        <div className='col-3 mr-auto d-flex align-items-center pl-0 pr-0'>
            <FlagList countries={props.countries} overflowLimit={2} flagPath='../../../../flags/' extention='.png' />
        </div>
        <div className='col-3 d-flex justify-content-end align-items-center pl-0 pr-0'>
            <Knapp onClick={preventDefault(props.behandlingOnClick)} className='c-ui-behandling-knapp' mini={true}>GÅ TIL BEHANDLING</Knapp>
        </div>
        <div className='col-2 d-flex justify-content-end align-items-center'>
            {props.merknader.length > 0
            ? <ProblemCircle className='c-ui-bucheader-svg mr-2 ml-2'/>
            : null
            }
            {props.comments.length > 0
            ? <BubbleChat className='c-ui-bucheader-svg mr-2 ml-2'/>
            : null
            }
        </div>
    </div>
    )
}

BucHeader.defaultProps = {
    type: '',
    name: '',
    dateCreated: '',
    countries: [],
    merknader: ['merknad'],
    comments: ['kommentar'],
    behandlingOnClick: ()=>{}
}

export default BucHeader

