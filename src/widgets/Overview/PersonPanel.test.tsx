import { mount, ReactWrapper } from 'enzyme'
import personAvdod from 'mocks/person/personAvdod'
import mockPerson from 'mocks/person/personPdl'
import PersonPanel, { PersonPanelDiv, PersonPanelProps } from './PersonPanel'

describe('widgets/Overview/PersonPanel', () => {
  let wrapper: ReactWrapper
  const initialMockProps: PersonPanelProps = {
    locale: 'nb',
    person: mockPerson,
    personAvdods: personAvdod(1)
  }

  beforeEach(() => {
    wrapper = mount(<PersonPanel {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: returns empty with no person', () => {
    wrapper.setProps({ person: undefined })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists(PersonPanelDiv)).toBeTruthy()
    expect(wrapper.find('svg[kind="nav-home"]')).toBeTruthy()
    expect(wrapper.find('#w-overview-personPanel__element-bostedsadresse').hostNodes().render().text()).toEqual(
      'ui:bostedsadresse:' + '01.01.2020 - 01.01.2021' + 'Adressenavn' + '00' + 'A' + '0768' + 'OSLO')

    expect(wrapper.find('svg[kind="calendar"]')).toBeTruthy()
    expect(wrapper.find('#w-overview-personPanel__element-birthdate').hostNodes().render().text()).toEqual(
      'ui:birthdate:' + '09.02.1980')

    expect(wrapper.find('svg[kind="nav-work"]')).toBeTruthy()
    expect(wrapper.find('#w-overview-personPanel__element-nationality').hostNodes().render().text()).toEqual(
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
    expect(wrapper.find('#w-overview-personPanel__element-bostedsadresse').hostNodes().render().text()).toEqual(
      'ui:bostedsadresse:' + 'ui:notRegistered')
    expect(wrapper.find('#w-overview-personPanel__element-birthdate').hostNodes().render().text()).toEqual(
      'ui:birthdate:' + 'ui:notRegistered')
  })

  it('Render: gets dates converted properly', () => {
    expect(wrapper.find('#w-overview-personPanel__element-marital-status').hostNodes().render().text()).toEqual(
      'ui:marital-status:ui:widget-overview-maritalstatus-Gift (10.10.2007)')
  })
})
