import React from 'react'
import WaitingPanel from './WaitingPanel'

describe('components/WaitingPanel', () => {
  it('Renders', () => {
    const wrapper = shallow(<WaitingPanel message='' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    const wrapper = mount(<WaitingPanel message='testmessage' />)
    expect(wrapper.exists('.c-waitingPanel')).toBeTruthy()
    expect(wrapper.find('.c-waitingPanel__message').text()).toEqual('testmessage')
  })
})
