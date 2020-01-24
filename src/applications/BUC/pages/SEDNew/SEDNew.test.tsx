import React from 'react'
import SEDNew from './SEDNew'
import { mount, ReactWrapper } from 'enzyme'
jest.mock('applications/BUC/components/SEDStart/SEDStart', () => {
  return () => { return <div className='mock-sedstart' /> }
})

describe('applications/BUC/widgets/SEDNew/SEDNew', () => {
  let wrapper: ReactWrapper
  const initialMockProps = {
    bucs: {},
    setMode: jest.fn(),
    t: jest.fn(t => t)
  }
  it('Renders', () => {
    wrapper = mount(<SEDNew {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    wrapper = mount(<SEDNew {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-p-sednew')).toBeTruthy()
    expect(wrapper.exists('.mock-sedstart')).toBeTruthy()
  })
})
