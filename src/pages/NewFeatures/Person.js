import React from 'react'
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel'
import PersonHeader from '../../components/newFeatures/PersonHeader'

const person = {
  fullName: 'Ola Normann',
  age: '68',
  personID: '12345678901',
  country: 'Norge',
  maritalStatus: 'Smashing',
  someOtherParam0: 'someOtherValue0',
  someOtherParam1: 'someOtherValue1',
  someOtherParam2: 'someOtherValue2',
  someOtherParam3: 'someOtherValue3',
  someOtherParam4: 'someOtherValue4',
  someOtherParam5: 'someOtherValue5',
  someOtherParam6: 'someOtherValue6',
  someOtherParam7: 'someOtherValue7',
  someOtherParam8: 'someOtherValue8',
  someOtherParam9: 'someOtherValue9'
}

const PersonWidget = (props) => {
  return <EkspanderbartpanelBase className='mb-5' ariaTittel='foo' heading={<PersonHeader t={props.t} {...person} />}>
     {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => <div key={i}><span><b>{'someOtherParam' + i}</b>{person['someOtherParam' + i]}</span><br /></div>)}
   </EkspanderbartpanelBase>
}

export default PersonWidget
