import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import { Icons, Nav, WaitingPanel } from 'eessi-pensjon-ui'
import './PersonTitle.css'

const PersonTitle = ({ gettingPersonInfo, person, t }) => {
  let age = '-'

  if (person && person.foedselsdato) {
    const birthDate = new Date(Date.parse(person.foedselsdato.foedselsdato))
    age = new Date().getFullYear() - birthDate.getFullYear()
  }

  if (gettingPersonInfo) {
    return <WaitingPanel className='w-overview-personPanel__waiting' message={t('ui:loading')} />
  }

  if (!person) {
    return null
  }

  const dead = !_.isNil(_.get(person, 'doedsdato.doedsdato'))
  let kind = 'nav-unknown-icon'
  if (person.kjoenn.kjoenn.value === 'K') {
    kind = 'nav-woman-icon'
  } else if (person.kjoenn.kjoenn.value === 'M') {
    kind = 'nav-man-icon'
  }
  return (
    <div className='w-overview-personPanel__title'>
      <Icons size={40} kind={kind} className={classNames('w-overview-personPanel__icon', { dead: dead })} />
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
