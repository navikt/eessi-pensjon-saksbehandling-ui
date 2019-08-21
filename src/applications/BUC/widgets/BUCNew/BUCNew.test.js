import React from 'react'
import BUCNew from './BUCNew'
jest.mock('applications/BUC/components/BUCStart/BUCStart', () => {
  return () => { return <div className='mock-c-bucstart' /> }
})

describe('applications/BUC/widgets/BUCNew/BUCNew', () => {
  let wrapper
  const t = jest.fn((translationString) => { return translationString })
  const initialMockProps = {
    t: t,
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
    expect(wrapper.exists('.a-buc-bucnew')).toBeTruthy()
    expect(wrapper.exists('.mock-c-bucstart')).toBeTruthy()
    expect(wrapper.find('BUCStart').props().mode).toEqual('widget')
  })
})
