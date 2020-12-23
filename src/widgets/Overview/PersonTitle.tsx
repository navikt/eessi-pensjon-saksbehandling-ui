import kvinne from 'assets/icons/icon-kvinne.png'
import mann from 'assets/icons/icon-mann.png'
import ukjent from 'assets/icons/icon-ukjent.png'
import classNames from 'classnames'
import { HorizontalSeparatorDiv } from 'nav-hoykontrast'
import { Person } from 'declarations/person'
import { PersonPropType } from 'declarations/person.pt'
import _ from 'lodash'
import moment, { Moment } from 'moment'
import { Systemtittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import PersonLoading from 'widgets/Overview/PersonLoading'

export const Title = styled.div`
  display: flex;
  align-items: center;
  .dead {
    filter: grayscale(100%)
  }
`

export interface PersonTitleProps {
  gettingPersonInfo: boolean
  person?: Person
}

const PersonTitle: React.FC<PersonTitleProps> = ({
  gettingPersonInfo, person
}: PersonTitleProps): JSX.Element => {
  let birthDate: Date | Moment | undefined
  let deathDate: Date | Moment | undefined

  if (!person || gettingPersonInfo) {
    return (
      <PersonLoading />
    )
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
  let src = ukjent
  if (person.kjoenn.kjoenn.value === 'K') {
    kind = 'nav-woman-icon'
    src = kvinne
  } else if (person.kjoenn.kjoenn.value === 'M') {
    kind = 'nav-man-icon'
    src = mann
  }

  return (
    <Title>
      <img
        alt={kind}
        className={classNames({ dead: !_.isNil(deathDate) })}
        data-test-id='w-persontitle__img'
        src={src}
        width={40}
      />
      <HorizontalSeparatorDiv />
      <Systemtittel>
        {person.personnavn.sammensattNavn} ({age}) - {person.aktoer.ident.ident}
      </Systemtittel>
    </Title>
  )
}

PersonTitle.propTypes = {
  gettingPersonInfo: PT.bool.isRequired,
  person: PersonPropType
}

export default PersonTitle
