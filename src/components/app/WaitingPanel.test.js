import React from 'react'
import WaitingPanel from './WaitingPanel'

describe('WaitingPanel', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<WaitingPanel message='' />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders with proper markup', () => {
    const wrapper = mount(<WaitingPanel message='testmessage' />)
    expect(wrapper.find('.c-waitingPanel')).toHaveLength(1)
    expect(wrapper.find('.c-waitingPanel-message').text()).toEqual('testmessage')
  })
})
