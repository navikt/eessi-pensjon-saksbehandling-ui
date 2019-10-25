import React from 'react'
import PersonTitle from './PersonTitle'
import samplePerson from 'resources/tests/samplePerson'

describe('widgets/Overview/PersonTitle', () => {
  let wrapper
  const initialMockProps = {
    aktoerId: '10293847565',
    gettingPersonInfo: false,
    person: samplePerson.person,
    t: jest.fn(t => t)
  }

  beforeEach(() => {
    wrapper = mount(<PersonTitle {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Does not render if no person is given', () => {
    wrapper = mount(<PersonTitle {...initialMockProps} person={undefined} />)
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-overview-personPanel__title')).toBeTruthy()
    expect(wrapper.find('.w-overview-personPanel__title img').props().kind).toEqual('nav-woman-icon')
    expect(wrapper.find('.w-overview-personPanel__title h2').render().text()).toEqual('HØYSÆTHER NAZAKMIR-MASK (89) - 27072942618')
  })

  it('Shows waiting panel when fetching person', () => {
    wrapper = mount(<PersonTitle {...initialMockProps} gettingPersonInfo />)
    expect(wrapper.exists('.w-overview-personPanel__waiting')).toBeTruthy()
    expect(wrapper.find('.w-overview-personPanel__waiting').hostNodes().render().text()).toEqual('Venter...ui:loading')
  })

  it('Renders different person icons', () => {
    samplePerson.person.kjoenn.kjoenn.value = 'M'
    wrapper.setProps({ person: samplePerson.person })
    expect(wrapper.find('Icons').props().kind).toEqual('nav-man-icon')

    samplePerson.person.kjoenn.kjoenn.value = 'X'
    wrapper.setProps({ person: samplePerson.person })
    expect(wrapper.find('Icons').props().kind).toEqual('nav-unknown-icon')

    samplePerson.person.kjoenn.kjoenn.value = 'K'
    wrapper.setProps({ person: samplePerson.person })
    expect(wrapper.find('Icons').props().kind).toEqual('nav-woman-icon')
  })
})
