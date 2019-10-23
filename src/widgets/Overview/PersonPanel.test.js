import React from 'react'
import PersonPanel from './PersonPanel'
import samplePerson from 'resources/tests/samplePerson'

describe('widgets/Overview/PersonPanel', () => {
  let wrapper
  const initialMockProps = {
    person: samplePerson.person,
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(() => {
    wrapper = mount(<PersonPanel {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Renders empty with no person', () => {
    wrapper.setProps({ person: undefined })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-overview-personPanel__content')).toBeTruthy()
    expect(wrapper.find('svg[kind="nav-home"]')).toBeTruthy()
    expect(wrapper.find('#w-overview-personPanel__element-bostedsadresse').render().text()).toEqual(
      'ui:bostedsadresse:KJEMPEBAKKENVEIEN1212015036')

    expect(wrapper.find('svg[kind="calendar"]')).toBeTruthy()
    expect(wrapper.find('#w-overview-personPanel__element-birthdate').render().text()).toEqual(
      'ui:birthdate:27.07.1929')

    expect(wrapper.find('svg[kind="nav-work"]')).toBeTruthy()
    expect(wrapper.find('#w-overview-personPanel__element-nationality').render().text()).toEqual(
      'ui:nationality:Danmark')
  })

  it('Empty value renders not registered', () => {
    wrapper.setProps({
      person: {
        ...samplePerson.person,
        bostedsadresse: null
      }
    })
    expect(wrapper.exists('.w-overview-personPanel__content')).toBeTruthy()
    expect(wrapper.find('svg[kind="nav-home"]')).toBeTruthy()
    expect(wrapper.find('#w-overview-personPanel__element-bostedsadresse').render().text()).toEqual(
      'ui:bostedsadresse:ui:notRegistered')
  })

  it('gets dates converted properly', () => {
    wrapper.setProps({
      person: {
        ...samplePerson.person,
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
    expect(wrapper.find('#w-overview-personPanel__element-marital-status').render().text()).toEqual('ui:marital-status:Mock, 01.01.1970 - 31.12.1980')
  })
})
