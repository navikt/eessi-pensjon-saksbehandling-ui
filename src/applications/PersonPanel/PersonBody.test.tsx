import { screen, render } from '@testing-library/react'
import personAvdod from 'src/mocks/person/personAvdod'
import mockPerson from 'src/mocks/person/personPdl'
import PersonBody, { PersonBodyProps } from './PersonBody'

describe('applications/PersonPanel/PersonBody', () => {
  const initialMockProps: PersonBodyProps = {
    locale: 'nb',
    person: mockPerson,
    personAvdods: personAvdod(1)
  }

  const mockPropsEmptyValue: PersonBodyProps = {
    locale: 'nb',
    person: {
      ...mockPerson,
      bostedsadresse: null,
      foedselsdato: {}
    },
    personAvdods: personAvdod(1)
  }

  it('Render: has proper HTML structure', () => {
    render(<PersonBody {...initialMockProps} />)

    expect(screen.getByTestId("person-body-div")).toBeInTheDocument()
    expect(screen.getByTitle("ui:bostedsadresse")).toBeInTheDocument()
    expect(screen.getByTitle("ui:birthdate")).toBeInTheDocument()
    expect(screen.getByTitle("ui:nationality")).toBeInTheDocument()
    expect(screen.getByTitle("ui:oppholdsadresse")).toBeInTheDocument()
    expect(screen.getByTitle("ui:marital-status")).toBeInTheDocument()
    expect(screen.getByTestId("w-overview-PersonBody--element-bostedsadresse")).toHaveTextContent(/ui:bostedsadresse:ui:fram-og-til01.01.2020 - 01.01.2021ui:adressenavnAdressenavnui:husnummer00ui:husbokstavAui:poststed0768ui:cityOSLO/i)
    expect(screen.getByTestId("w-overview-PersonBody--element-birthdate")).toHaveTextContent(/ui:birthdate:09.02.1980/i)
    expect(screen.getByTestId("w-overview-PersonBody--element-nationality")).toHaveTextContent("ui:nationality:DanmarkNorge (09.02.1980 - 09.02.1981)Belgia")
  })

  it('Render: Empty value renders not registered', () => {
    render(<PersonBody {...mockPropsEmptyValue} />)
    expect(screen.getByTestId("person-body-div")).toBeInTheDocument()
    expect(screen.getByTitle("ui:bostedsadresse")).toBeInTheDocument()
    expect(screen.getByTestId("w-overview-PersonBody--element-bostedsadresse")).toHaveTextContent(/ui:bostedsadresse:ui:notRegistered/i)
    expect(screen.getByTestId("w-overview-PersonBody--element-birthdate")).toHaveTextContent(/ui:birthdate:ui:notRegistered/i)
  })

  it('Render: gets dates converted properly', () => {
    render(<PersonBody {...initialMockProps} />)
    expect(screen.getByTestId("w-overview-PersonBody--element-marital-status")).toHaveTextContent(/ui:marital-status:Gift \(10.10.2007\)/i)
  })
})
