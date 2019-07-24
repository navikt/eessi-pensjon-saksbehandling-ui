import React from 'react'
import WaitingPanel from './WaitingPanel'

describe('components/WaitingPanel', () => {
  it('WaitingPanel renders without crashing', () => {
    const wrapper = shallow(<WaitingPanel message='' />)
    expect(wrapper).toMatchSnapshot()
  })

  it('WaitingPanel renders with proper markup', () => {
    const wrapper = mount(<WaitingPanel message='testmessage' />)
    expect(wrapper.find('.c-waitingPanel')).toHaveLength(1)
    expect(wrapper.find('.c-waitingPanel-message').text()).toEqual('testmessage')
  })
})
