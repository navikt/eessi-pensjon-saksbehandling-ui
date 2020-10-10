import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import EESSIPensjonVeileder from './EESSIPensjonVeileder'

describe('components/EESSIPensjonVeileder/EESSIPensjonVeileder', () => {
  let wrapper: ReactWrapper
  it('Render: match snapshot', () => {
    wrapper = mount(<EESSIPensjonVeileder />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: chooses veileder correctly', () => {
    wrapper = mount(<EESSIPensjonVeileder mood='smilende' />)
    expect(wrapper.exists('[data-test-id=\'c-eessipensjonveileder\']')).toBeTruthy()
    expect(wrapper.find('img').props().alt).toEqual('nav-smilende-veileder')
    wrapper.setProps({ mood: 'trist' })
    expect(wrapper.find('img').props().alt).toEqual('nav-trist-veileder')
  })
})
