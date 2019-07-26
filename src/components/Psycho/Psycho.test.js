import React from 'react'
import Psycho from './Psycho'

describe('components/Psycho', () => {
  it('Renders', () => {
    let wrapper = mount(<Psycho />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Chooses veileder correctly', () => {
    let wrapper = mount(<Psycho type='smilende' />)
    expect(wrapper.exists('.c-psycho')).toBeTruthy()
    expect(wrapper.find('img').props().alt).toEqual('nav-smilende-veileder')
    wrapper.setProps({ type: 'trist' })
    expect(wrapper.find('img').props().alt).toEqual('nav-trist-veileder')
  })
})
