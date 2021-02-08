import kvinne from 'assets/icons/icon-kvinne.png'
import mann from 'assets/icons/icon-mann.png'
import ukjent from 'assets/icons/icon-ukjent.png'
import classNames from 'classnames'
import { HorizontalSeparatorDiv } from 'nav-hoykontrast'
import { PersonPDL } from 'declarations/person'
import { PersonPropType } from 'declarations/person.pt'
import _ from 'lodash'
import moment, { Moment } from 'moment'
import { Systemtittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import PersonLoading from 'widgets/Overview/PersonLoading'
import { getFnr } from 'applications/BUC/components/BUCUtils/BUCUtils'

export const Title = styled.div`
  display: flex;
  align-items: center;
  .dead {
    filter: grayscale(100%)
  }
`

export interface PersonTitleProps {
  gettingPersonInfo: boolean
  person?: PersonPDL
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

  if (_.get(person, 'foedsel.foedselsdato')) {
    birthDate = moment(person.foedsel.foedselsdato)
    if (birthDate) {
      birthDate = birthDate.toDate()
    }
  }
  if (_.get(person, 'doedsfall.doedsdato')) {
    deathDate = moment(person.doedsfall?.doedsdato)
    if (deathDate) {
      deathDate = deathDate.toDate()
    }
  }

  const age: number = (deathDate ? (deathDate as Date).getFullYear() : new Date().getFullYear()) - (birthDate as Date).getFullYear()

  let kind: string = 'nav-unknown-icon'
  let src = ukjent

  if (person.kjoenn?.kjoenn === 'KVINNE') {
    kind = 'nav-woman-icon'
    src = kvinne
  } else if (person.kjoenn?.kjoenn === 'MANN') {
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
        {person.navn?.sammensattNavn} ({age}) - {getFnr(person)}
      </Systemtittel>
    </Title>
  )
}

PersonTitle.propTypes = {
  gettingPersonInfo: PT.bool.isRequired,
  person: PersonPropType
}

export default PersonTitle
