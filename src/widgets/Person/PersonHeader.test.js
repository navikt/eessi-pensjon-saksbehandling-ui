import React from 'react'
import PersonHeader from './PersonHeader'

const mockDefaultProps = {
  fullName: 'TEST PERSON',
  age: '314',
  personID: '10293847565',
  country: 'UNITED STATES OF TEST',
  maritalStatus: 'FICTIONAL',
  t: arg => arg
}

describe('Rendering PersonHeader', () => {
  it('renders without crashing', () => {
    let wrapper = shallow(<PersonHeader />)

    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Renders props', () => {
    let wrapper = shallow(<PersonHeader {...mockDefaultProps} />)

    expect(wrapper.find({ 'data-qa': 'PersonHeader-nameAgeID' }).render().html()).toEqual('TEST PERSON (314) - 10293847565')
    expect(wrapper.find({ 'data-qa': 'PersonHeader-country' }).render().html()).toEqual('country: UNITED STATES OF TEST')
    expect(wrapper.find({ 'data-qa': 'PersonHeader-maritalStatus' }).render().html()).toEqual('marital-status: FICTIONAL')
  })
})
