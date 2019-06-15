import React from 'react'
import { Systemtittel, Undertekst } from 'nav-frontend-typografi'
import _ from 'lodash'
import { ReactComponent as MannIcon } from '../../resources/images/mann.svg'
import { AlertStripe, NavFrontendSpinner } from 'components/ui/Nav'

function PersonHeader (props) {
  const { t, person, aktoerId, gettingPersonInfo } = props
  return <div className='d-flex w-100'>
    <div>
      <MannIcon data-qa='PersonHeader-Mann' />
    </div>
    {!aktoerId ? <AlertStripe type='advarsel'>{t('buc:validation-noAktoerId')}</AlertStripe> : null }
    {gettingPersonInfo ? <div className='d-flex align-items-center'>
       <NavFrontendSpinner className='ml-3 mr-3' type='M' />
       <span>{t('ui:loading')}</span>
     </div> : null}
    { !_.isEmpty(person) ? <div className='w-100'>
      <div className='col-12'>
        <Systemtittel data-qa='PersonHeader-nameAgeID'>{props.fullName} ({props.age}) - {props.personID}</Systemtittel>
      </div>
      <div className='col-12 d-flex'>
        <div className='pr-5 mr-5'>
          <Undertekst data-qa='PersonHeader-country'>{t('ui:country')}: {props.country}</Undertekst>
        </div>
        <div>
          <Undertekst data-qa='PersonHeader-maritalStatus' className='pl-2'>{t('ui:marital-status')}: {props.maritalStatus}</Undertekst>
        </div>
      </div>
    </div> : null}
  </div>
}

PersonHeader.defaultProps = {
  fullName: '',
  age: '',
  personID: '',
  country: '',
  maritalStatus: '',
  t: arg => arg
}

export default PersonHeader
