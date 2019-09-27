import React from 'react'
import PT from 'prop-types'
import { Icons, Nav } from 'eessi-pensjon-ui'

const PersonTitle = (props) => {
  const { aktoerId, gettingPersonInfo, person, t } = props
  let age = '-'

  if (person && person.foedselsdato) {
    const birthDate = new Date(Date.parse(person.foedselsdato.foedselsdato))
    age = new Date().getFullYear() - birthDate.getFullYear()
  }

  if (!aktoerId) {
    return (
      <Nav.AlertStripe type='advarsel' className='w-100'>
        {t('buc:validation-noAktoerId')}
      </Nav.AlertStripe>
    )
  }

  if (gettingPersonInfo) {
    return (
      <div className='w-overview-personPanel__waiting'>
        <Nav.Spinner className='ml-3 mr-3' type='M' />
        <span className='pl-2'>{t('ui:loading')}</span>
      </div>
    )
  }

  if (!person) {
    return null
  }

  return (
    <div className='w-overview-personPanel__title'>
      <Icons kind={person.kjoenn.kjoenn.value === 'K' ? 'nav-woman-icon' : 'nav-man-icon'} />
      <Nav.Systemtittel className='ml-2'>
        {person.personnavn.sammensattNavn} ({age}) - {person.aktoer.ident.ident}
      </Nav.Systemtittel>
    </div>
  )
}

PersonTitle.propTypes = {
  aktoerId: PT.string,
  gettingPersonInfo: PT.bool,
  person: PT.object,
  t: PT.func.isRequired
}

export default PersonTitle
