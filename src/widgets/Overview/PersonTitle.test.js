import React from 'react'
import PersonTitle from './PersonTitle'
import samplePerson from 'resources/tests/samplePerson'

describe('widgets/Overview/PersonTitle', () => {
  let wrapper
  const initialMockProps = {
    aktoerId: '10293847565',
    gettingPersonInfo: false,
    person: samplePerson.person,
    t: jest.fn((translationString) => { return translationString })
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

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-overview-personPanel__title')).toBeTruthy()
    expect(wrapper.find('.w-overview-personPanel__title img').props().kind).toEqual('nav-woman-icon')
    expect(wrapper.find('.w-overview-personPanel__title h2').render().text()).toEqual('HØYSÆTHER NAZAKMIR-MASK (90) - 27072942618')
  })
})
