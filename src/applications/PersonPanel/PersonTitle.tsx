import kvinne from 'src/assets/icons/icon-kvinne.png'
import mann from 'src/assets/icons/icon-mann.png'
import ukjent from 'src/assets/icons/icon-ukjent.png'
import classNames from 'classnames'
import { PersonPDL } from 'src/declarations/person'
import { PersonPropType } from 'src/declarations/person.pt'
import _ from 'lodash'
import moment from 'moment'
import {Heading, HStack} from '@navikt/ds-react'
import PT from 'prop-types'
import styled from 'styled-components'
import {getFnr, getNPID} from 'src/applications/BUC/components/BUCUtils/BUCUtils'
import LoadingImage from "src/components/Loading/LoadingImage";

export const Title = styled(HStack)`
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
  let birthDate: Date | undefined
  let deathDate: Date | undefined

  let age: number = 0

  if (!person || gettingPersonInfo) {
    return (
      <LoadingImage />
    )
  }

  if (_.get(person, 'foedselsdato.foedselsdato')) {
    birthDate = moment(person.foedselsdato.foedselsdato)?.toDate()
  }
  if (_.get(person, 'doedsfall.doedsdato')) {
    deathDate = moment(person.doedsfall?.doedsdato)?.toDate()
  }

  const endDate: Date = deathDate || new Date()
  if (birthDate && endDate) {
    age = moment(endDate).diff(moment(birthDate), 'years')
  }

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
    <Title gap="4">
      <img
        alt={kind}
        className={classNames({ dead: !_.isNil(deathDate) })}
        data-testid='w-persontitle--img'
        src={src}
        width={40}
      />
      <Heading size='medium'>
        {person.navn?.sammensattNavn} ({age}) - {getFnr(person) ? getFnr(person) : getNPID(person)}
      </Heading>
    </Title>
  )
}

PersonTitle.propTypes = {
  gettingPersonInfo: PT.bool.isRequired,
  person: PersonPropType
}

export default PersonTitle
