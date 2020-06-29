import classNames from 'classnames'
import Icons from 'components/Icons/Icons'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { PersonPropType } from 'declarations/types.pt'
import { Person } from 'declarations/types'
import _ from 'lodash'
import moment, { Moment } from 'moment'
import PT from 'prop-types'
import React from 'react'
import './PersonTitle.css'
import { useTranslation } from 'react-i18next'
import { Systemtittel } from 'nav-frontend-typografi'

export interface PersonTitleProps {
  gettingPersonInfo: boolean;
  person?: Person;
}

const PersonTitle: React.FC<PersonTitleProps> = ({ gettingPersonInfo, person }: PersonTitleProps): JSX.Element => {
  let birthDate: Date | Moment | undefined
  let deathDate: Date | Moment | undefined
  const { t } = useTranslation()
  if (!person || gettingPersonInfo) {
    return <WaitingPanel className='w-overview-personPanel__waiting' message={t('ui:loading')} />
  }

  if (_.get(person, 'foedselsdato.foedselsdato')) {
    birthDate = moment(person.foedselsdato.foedselsdato)
    if (birthDate) {
      birthDate = birthDate.toDate()
    }
  }
  if (_.get(person, 'doedsdato.doedsdato')) {
    deathDate = moment(person.doedsdato.doedsdato)
    if (deathDate) {
      deathDate = deathDate.toDate()
    }
  }

  const age: number = (deathDate ? (deathDate as Date).getFullYear() : new Date().getFullYear()) - (birthDate as Date).getFullYear()

  let kind: string = 'nav-unknown-icon'
  if (person.kjoenn.kjoenn.value === 'K') {
    kind = 'nav-woman-icon'
  } else if (person.kjoenn.kjoenn.value === 'M') {
    kind = 'nav-man-icon'
  }

  return (
    <div className='w-overview-personPanel__title'>
      <Icons
        size={40}
        kind={kind}
        className={classNames('w-overview-personPanel__icon', { dead: !_.isNil(deathDate) })}
      />
      <Systemtittel className='ml-2'>
        {person.personnavn.sammensattNavn} ({age}) - {person.aktoer.ident.ident}
      </Systemtittel>
    </div>
  )
}

PersonTitle.propTypes = {
  gettingPersonInfo: PT.bool.isRequired,
  person: PersonPropType
}

export default PersonTitle
