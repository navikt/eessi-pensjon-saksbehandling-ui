import React from 'react'
import PersonHeader from './PersonHeader'
import samplePerson from 'resources/tests/samplePerson'

describe('widgets/Person/PersonHeader', () => {
  let wrapper
  const initialMockProps = {
    aktoerId: '10293847565',
    gettingPersonInfo: false,
    t: jest.fn((translationString) => { return translationString }),
    person: samplePerson.person
  }

  beforeEach(() => {
    wrapper = mount(<PersonHeader {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-person-header')).toBeTruthy()
    expect(wrapper.exists('.w-person-header__content')).toBeTruthy()
    expect(wrapper.find('.w-person-header__content img').props().kind).toEqual('nav-woman-icon')
    expect(wrapper.find('.w-person-header__content h2').render().text()).toEqual('HØYSÆTHER NAZAKMIR-MASK (90) - 27072942618')
  })
})
