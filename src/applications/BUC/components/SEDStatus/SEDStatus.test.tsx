import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import SEDStatus, { SEDStatusProps } from './SEDStatus'

describe('applications/BUC/components/SEDStatus/SEDStatus', () => {
  let wrapper : ReactWrapper
  const initialMockProps: SEDStatusProps = {
    status: 'new',
    t: jest.fn(t => t)
  }

  it('Renders', () => {
    wrapper = mount(<SEDStatus {...initialMockProps} status='new' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure for sent status', () => {
    wrapper = mount(<SEDStatus {...initialMockProps} status='sent' />)
    expect(wrapper.exists('EtikettBase')).toBeTruthy()
    expect(wrapper.find('EtikettBase').props().type).toEqual('suksess')
  })
})
