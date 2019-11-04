import React from 'react'
import SEDStatus from './SEDStatus'

describe('applications/BUC/components/SEDStatus/SEDStatus', () => {
  const initialMockProps = {
    t: jest.fn(t => t)
  }

  it('Renders', () => {
    const wrapper = shallow(<SEDStatus {...initialMockProps} status='new' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure for sent status', () => {
    const wrapper = mount(<SEDStatus {...initialMockProps} status='sent' />)
    expect(wrapper.exists('EtikettBase')).toBeTruthy()
    expect(wrapper.find('EtikettBase').props().type).toEqual('suksess')
  })
})
