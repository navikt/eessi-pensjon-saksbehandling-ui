import React from 'react'

import * as Typografi from 'nav-frontend-typografi'
import Tekstomrade from 'nav-frontend-tekstomrade'
import { LenkepanelBase } from 'nav-frontend-lenkepanel';


import FlagList from './FlagList'

import { ReactComponent as ProblemCircle } from '../../resources/images/report-problem-circle.svg'
import { ReactComponent as BubbleChat } from '../../resources/images/bubble-chat-2.svg'

import './BucHeader.css'

function preventDefault(onClick){
    return function onClickHandler(e){
        e.stopPropagation()
        e.preventDefault()
        onClick(e)
    }
}

function BucHeader(props){
    const {t} = props
    return (
    <div className='p-0 w-100 d-flex justify-content-between'>
        <div className='col-3'>
            <Typografi.Ingress data-qa='BucHeader-type-name' className='font-weight-bold'>{props.type + ' - ' + props.name}</Typografi.Ingress>
            <Typografi.Normaltekst data-qa='BucHeader-dateCreated'>{t('created')}: {props.dateCreated}</Typografi.Normaltekst>
        </div>
        <div className='col-3 mr-auto d-flex align-items-center pl-0 pr-0'>
            <FlagList data-qa='BucHeader-FlagList' countries={props.countries} overflowLimit={2} flagPath='../../../../flags/' extention='.png' />
        </div>
        <div className='col-3 d-flex justify-content-end align-items-center pl-0 pr-0'>
            <LenkepanelBase data-qa='BucHeader-LinkButton' onClick={preventDefault(props.behandlingOnClick)} className='knapp knapp--mini pl-3 pr-3 pt-2 pb-2 m-0' href={props.href} border>
                <div>
                    {t('processing')}
                </div>
            </LenkepanelBase>
        </div>
        <div className='col-2 d-flex justify-content-end align-items-center'>
            {props.merknader.length > 0
            ? <ProblemCircle data-qa='BucHeader-ProblemCircle' className='c-ui-bucheader-svg mr-2 ml-2'/>
            : null
            }
            {props.comments.length > 0
            ? <BubbleChat data-qa='BucHeader-BubbleChat' className='c-ui-bucheader-svg mr-2 ml-2'/>
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
    href: '', 
    countries: [],
    merknader: [],
    comments: [],
    behandlingOnClick: ()=>{},
    t: arg=>arg
}

export default BucHeader

