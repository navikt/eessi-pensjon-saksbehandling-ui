import { mount, ReactWrapper } from 'enzyme'
import personAvdod from 'mocks/app/personAvdod'
import React from 'react'
import mockPerson from 'mocks/app/person'
import PersonPanel, { PersonPanelDiv, PersonPanelProps } from './PersonPanel'

describe('widgets/Overview/PersonPanel', () => {
  let wrapper: ReactWrapper
  const initialMockProps: PersonPanelProps = {
    highContrast: false,
    locale: 'nb',
    person: mockPerson.person,
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
      'ui:bostedsadresse:' + 'KJEMPEBAKKENVEIEN' + '12' + '5036' + 'BERGEN')

    expect(wrapper.find('svg[kind="calendar"]')).toBeTruthy()
    expect(wrapper.find('#w-overview-personPanel__element-birthdate').hostNodes().render().text()).toEqual(
      'ui:birthdate:' + '26.07.1929')

    expect(wrapper.find('svg[kind="nav-work"]')).toBeTruthy()
    expect(wrapper.find('#w-overview-personPanel__element-nationality').hostNodes().render().text()).toEqual(
      'ui:nationality:' + 'Danmark')
  })

  it('Render: Empty value renders not registered', () => {
    wrapper.setProps({
      person: {
        ...mockPerson.person,
        bostedsadresse: null,
        foedselsdato: null
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
    wrapper.setProps({
      person: {
        ...mockPerson.person,
        sivilstand: {
          sivilstand: {
            value: 'MOCK',
            kodeRef: null,
            kodeverksRef: 'http://nav.no/kodeverk/Kodeverk/Sivilstander'
          },
          fomGyldighetsperiode: '1970-01-01T09:00:00.000+0000',
          tomGyldighetsperiode: '1980-12-31T09:00:00.000+0000',
          endringstidspunkt: null,
          endretAv: null,
          endringstype: null
        }
      }
    })
    expect(wrapper.find('#w-overview-personPanel__element-marital-status').hostNodes().render().text()).toEqual(
      'ui:marital-status:ui:widget-overview-maritalstatus-Mock (01.01.1970 - 31.12.1980)')
  })
})
