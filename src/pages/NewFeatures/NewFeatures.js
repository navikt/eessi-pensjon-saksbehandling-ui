import React, {useState, Component, Fragment } from 'react'
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel'
import { ToggleGruppe, ToggleKnapp } from 'nav-frontend-toggle'
import Tekstomrade from 'nav-frontend-tekstomrade'
import * as Typografi from 'nav-frontend-typografi';

import { withTranslation } from 'react-i18next'

import PersonHeader from '../../components/newFeatures/PersonHeader'
import BucHeader from '../../components/newFeatures/BucHeader'
import SedHeader from '../../components/newFeatures/SedHeader'
import SedLabel from '../../components/newFeatures/SedLabel'
import { ReactComponent as MannIcon } from '../../resources/images/mann.svg'
import './NewFeatures.css'

const person = {
    fullName: 'Ola Normann',
    age: '68',
    personID: '12345678901',
    country: 'Norge',
    maritalStatus: 'Smashing',
    someOtherParam0 : 'someOtherValue0',
    someOtherParam1 : 'someOtherValue1',
    someOtherParam2 : 'someOtherValue2',
    someOtherParam3 : 'someOtherValue3',
    someOtherParam4 : 'someOtherValue4',
    someOtherParam5 : 'someOtherValue5',
    someOtherParam6 : 'someOtherValue6',
    someOtherParam7 : 'someOtherValue7',
    someOtherParam8 : 'someOtherValue8',
    someOtherParam9 : 'someOtherValue9'
}

const BUCLIST = [
    {
        type: 'P_BUC_01',
        name: 'AldersPensjon',
        dateCreated: 'dd.mm.åå',
        countries: ['ZW', 'KR', 'SE', 'DK', 'CZ'],
    },
    {
        type: 'P_BUC_02',
        name: 'UførePensjon',
        dateCreated: 'dd.mm.åå',
        countries: ['SE', 'DK', 'CZ'],
        merknader: ['foo', 'bar', 'baz']
    },
    {
        type: 'P_BUC_01',
        name: 'AldersPensjon',
        dateCreated: 'dd.mm.åå',
        countries: ['ZW', 'KR', 'SE', 'DK', 'CZ'],
        comments: ['foo', 'bar', 'baz']
    },
    {
        type: 'P_BUC_01',
        name: 'AldersPensjon',
        dateCreated: 'dd.mm.åå',
        countries: ['ZW', 'KR', 'SE', 'DK', 'CZ'],
        merknader: ['foo', 'bar', 'baz'],
        comments: ['foo', 'bar', 'baz']
    },
]

const ANDRELIST = [
    {
        type: 'P_BUC_01',
        name: 'FIFOFA',
        dateCreated: 'dd.mm.åå',
        countries: ['RU', 'GB', 'CH'],
    },
    {
        type: 'P_BUC_02',
        name: 'GRÅTASS',
        dateCreated: 'dd.mm.åå',
        countries: ['DE', 'TR', 'CA'],
    }
]

let SEDS = [
    {
        name: 'P2000',
        status: 'sendt',
        date: 'dd.mm.åå',
        country: 'Sverige',
        institution: 'Försäkringskassan'
    },
    {
        name: 'P3000SE',
        status: 'draft',
        date: 'dd.mm.åå',
        country: 'Sverige',
        institution: 'Försäkringskassan'
    },
    {
        name: 'P4000',
        status: 'received',
        date: 'dd.mm.åå',
        country: 'Sverige',
        institution: 'Försäkringskassan'
    },
    {
        name: 'P5000',
        status: 'foo',
        date: 'dd.mm.åå',
        country: 'Sverige',
        institution: 'Försäkringskassan'
    }
]

export function NewFeatures(props){

    const [tab, setTab] = useState('ONGOING')
    const { t } = props

    return(
        <div className='newFeatureBackground'>
            <div className='newFeatureContainer pr-5 pl-5'>
                <EkspanderbartpanelBase className='mb-5' ariaTittel='foo' heading={<PersonHeader t={t} {...person}/>}>
                    {[0,1,2,3,4,5,6,7,8,9].map(i=><div key={i}><span><b>{'someOtherParam'+i}</b>{person['someOtherParam'+i]}</span><br /></div>)}
                </EkspanderbartpanelBase>
                
                <div className= 'mb-3'>
                    <ToggleGruppe
                        defaultToggles={[
                            {children: t('ongoing'), pressed: true , onClick: ()=>setTab('ONGOING')},
                            {children: t('other'), onClick: ()=>setTab('OTHER')}
                        ]}
                    />
                </div>
                {
                    tab === 'ONGOING'
                    ? BUCLIST.map((buc, index) => (
                        <EkspanderbartpanelBase key={index} className='mb-3' ariaTittel='foo' heading={<BucHeader t={t} {...buc} />}>
                            <SedHeader t={t} />
                            {SEDS.map((sed, index )=> (
                                <SedLabel t={t} key={index} sed={sed} />
                            ))}
                        </EkspanderbartpanelBase>
                    ))
                    : null }
                {
                    tab === 'OTHER'
                    ? ANDRELIST.map((buc, index) => (
                        <EkspanderbartpanelBase key={index} className='mb-3' ariaTittel='foo' heading={<BucHeader t={t} {...buc} />}>
                            <SedHeader t={t} />
                            {SEDS.map((sed, index )=> (
                                <SedLabel t={t} key={index} sed={sed} />
                            ))}
                        </EkspanderbartpanelBase>
                    ))
                    : null }
            </div>
        </div>
    )
}

export default withTranslation('newFeatures')(NewFeatures)