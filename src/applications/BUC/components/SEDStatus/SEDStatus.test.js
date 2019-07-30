import React from 'react'
import SEDStatus from './SEDStatus'

describe('applications/BUC/components/SEDStatus/SEDStatus', () => {
  let initialMockProps = {
    t: jest.fn((translationString) => { return translationString })
  }

  it('Renders', () => {
    const wrapper = shallow(<SEDStatus {...initialMockProps} status='draft' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure for sent status', () => {
    const wrapper = mount(<SEDstatus {...initialMockProps} status='sent' />)
    wrapper.exists('EtikettBase').toBeTruthy()
    expect(wrapper.find('EtikettBase').props().type).toEqual('suksess')
  })
})
