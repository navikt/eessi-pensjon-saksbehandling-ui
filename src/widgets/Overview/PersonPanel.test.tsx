
import { render } from '@testing-library/react'
import personAvdod from 'mocks/person/personAvdod'
import mockPerson from 'mocks/person/personPdl'
import PersonPanel, { PersonPanelDiv, PersonPanelProps } from './PersonPanel'

describe('widgets/Overview/PersonPanel', () => {
  let wrapper: any

  const initialMockProps: PersonPanelProps = {
    locale: 'nb',
    person: mockPerson,
    personAvdods: personAvdod(1)
  }

  beforeEach(() => {
    wrapper = render(<PersonPanel {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    const { container } = render(<PersonPanel {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: returns empty with no person', () => {
    const { container } = render(<PersonPanel {...initialMockProps} person={undefined} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists(PersonPanelDiv)).toBeTruthy()
    expect(wrapper.find('svg[kind="nav-home"]')).toBeTruthy()
    expect(wrapper.find('#w-overview-personPanel--element-bostedsadresse').hostNodes().render().text()).toEqual(
      'ui:bostedsadresse:' + '01.01.2020 - 01.01.2021' + 'Adressenavn' + '00' + 'A' + '0768' + 'OSLO')

    expect(wrapper.find('svg[kind="calendar"]')).toBeTruthy()
    expect(wrapper.find('#w-overview-personPanel--element-birthdate').hostNodes().render().text()).toEqual(
      'ui:birthdate:' + '09.02.1980')

    expect(wrapper.find('svg[kind="nav-work"]')).toBeTruthy()
    expect(wrapper.find('#w-overview-personPanel--element-nationality').hostNodes().render().text()).toEqual(
      'ui:nationality:' + 'Norge (09.02.1980)')
  })

  it('Render: Empty value renders not registered', () => {
    wrapper.setProps({
      person: {
        ...mockPerson,
        bostedsadresse: null,
        foedsel: {}
      }
    })
    expect(wrapper.exists(PersonPanelDiv)).toBeTruthy()
    expect(wrapper.find('svg[kind="nav-home"]')).toBeTruthy()
    expect(wrapper.find('#w-overview-personPanel--element-bostedsadresse').hostNodes().render().text()).toEqual(
      'ui:bostedsadresse:' + 'ui:notRegistered')
    expect(wrapper.find('#w-overview-personPanel--element-birthdate').hostNodes().render().text()).toEqual(
      'ui:birthdate:' + 'ui:notRegistered')
  })

  it('Render: gets dates converted properly', () => {
    expect(wrapper.find('#w-overview-personPanel--element-marital-status').hostNodes().render().text()).toEqual(
      'ui:marital-status:ui:widget-overview-maritalstatus-Gift (10.10.2007)')
  })
})
