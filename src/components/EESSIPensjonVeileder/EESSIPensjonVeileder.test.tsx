import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import EESSIPensjonVeileder from './EESSIPensjonVeileder'

describe('components/EESSIPensjonVeileder', () => {
  let wrapper: ReactWrapper
  it('Renders', () => {
    wrapper = mount(<EESSIPensjonVeileder />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Chooses veileder correctly', () => {
    wrapper = mount(<EESSIPensjonVeileder mood='smilende' />)
    expect(wrapper.exists('.c-EESSIPensjonVeileder')).toBeTruthy()
    expect(wrapper.find('img').props().alt).toEqual('nav-smilende-veileder')
    wrapper.setProps({ mood: 'trist' })
    expect(wrapper.find('img').props().alt).toEqual('nav-trist-veileder')
  })
})
