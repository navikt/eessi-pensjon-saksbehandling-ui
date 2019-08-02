import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { AlertStripe, NavFrontendSpinner, Systemtittel } from 'components/Nav'
import Icons from 'components/Icons'

const PersonHeader = (props) => {
  const { t, person, aktoerId, gettingPersonInfo } = props
  let age = '-'

  if (person) {
    if (person.foedselsdato) {
      const birthDate = new Date(Date.parse(person.foedselsdato.foedselsdato))
      age = new Date().getFullYear() - birthDate.getFullYear()
    }
  }

  return <div className='w-person-header'>
    {!aktoerId
      ? <AlertStripe type='advarsel' className='w-100'>
        {t('buc:validation-noAktoerId')}
      </AlertStripe>
      : null }
    {gettingPersonInfo
      ? <div className='w-person-header__waiting'>
        <NavFrontendSpinner className='ml-3 mr-3' type='M' />
        <span className='pl-2'>{t('ui:loading')}</span>
      </div>
      : null}
    { !_.isEmpty(person)
      ? <div className='w-person-header__content'>
        <Icons kind={person.kjoenn.kjoenn.value === 'K' ? 'nav-woman-icon' : 'nav-man-icon'} />
        <Systemtittel className='ml-2'>
          {person.personnavn.sammensattNavn} ({age}) - {person.aktoer.ident.ident}
        </Systemtittel>
      </div> : null}
  </div>
}

PersonHeader.propTypes = {
  t: PT.func.isRequired,
  person: PT.object,
  aktoerId: PT.string,
  gettingPersonInfo: PT.bool
}

export default PersonHeader
