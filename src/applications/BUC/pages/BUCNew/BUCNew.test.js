import React from 'react'
import BUCNew from './BUCNew'
jest.mock('applications/BUC/components/BUCStart/BUCStart', () => {
  return (props) => { return <div className='mock-bucstart' mode={props.mode} /> }
})

describe('applications/BUC/widgets/BUCNew/BUCNew', () => {
  let wrapper
  const initialMockProps = {
    t: jest.fn(t => t),
    loading: {},
    locale: 'nb'
  }

  it('Renders', () => {
    wrapper = mount(<BUCNew {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    wrapper = mount(<BUCNew {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-p-bucnew')).toBeTruthy()
    expect(wrapper.exists('.mock-bucstart')).toBeTruthy()
    expect(wrapper.find('.mock-bucstart').props().mode).toEqual('widget')
  })
})
