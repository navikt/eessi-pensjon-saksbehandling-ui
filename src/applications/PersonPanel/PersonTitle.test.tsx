import {render, screen} from '@testing-library/react'
import PersonTitle, { PersonTitleProps } from './PersonTitle'

import mockPerson from 'src/mocks/person/personPdl'
import mockPersonKvinne from 'src/mocks/person/personPdlKvinne'
import mockPersonUkjent from 'src/mocks/person/personPdlUkjent'

describe('src/applications/PersonPanel/PersonTitle', () => {
  const initialMockProps: PersonTitleProps = {
    gettingPersonInfo: false,
    person: mockPerson
  }

  const kvinneMockProps: PersonTitleProps = {
    gettingPersonInfo: false,
    person: mockPersonKvinne
  }

  const ukjentMockProps: PersonTitleProps = {
    gettingPersonInfo: false,
    person: mockPersonUkjent
  }

  it('Render: has proper HTML structure', () => {
    render(<PersonTitle {...initialMockProps} />)
    expect(screen.getByAltText('nav-man-icon')).toBeInTheDocument()
    expect(screen.getByText('LEALAUS SAKS', { exact: false })).toBeInTheDocument()
  })

  it('Render: different person icons', () => {
    render(<PersonTitle {...kvinneMockProps} />)
    expect(screen.getByAltText('nav-woman-icon')).toBeInTheDocument()

    render(<PersonTitle {...ukjentMockProps} />)
    expect(screen.getByAltText('nav-unknown-icon')).toBeInTheDocument()
  })
})
