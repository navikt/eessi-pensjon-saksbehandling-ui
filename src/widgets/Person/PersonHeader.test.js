import React from 'react'
import PersonHeader from './PersonHeader'
import samplePerson from 'resources/tests/samplePerson'

describe('widgets/Person/PersonHeader', () => {

  const initialMockProps = {
    aktoerId: '10293847565',
    gettingPersonInfo: false,
    t: jest.fn((translationString) => { return translationString }),
    person: samplePerson.person
  }

  it('Renders', () => {
    let wrapper = mount(<PersonHeader {...initialMockProps}/>)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HML structure', () => {
    let wrapper = mount(<PersonHeader {...initialMockProps} />)
    expect(wrapper.exists('.w-personheader')).toBeTruthy()
    expect(wrapper.exists('.w-personheader__content')).toBeTruthy()
    expect(wrapper.find('.w-personheader__content img').props().kind).toEqual('nav-woman-icon')
    expect(wrapper.find('.w-personheader__content h2').render().text()).toEqual('HØYSÆTHER NAZAKMIR-MASK (90) - 27072942618')
  })
})
