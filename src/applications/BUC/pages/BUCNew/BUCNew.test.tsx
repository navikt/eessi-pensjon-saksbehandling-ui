import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import BUCNew, { BUCNewProps } from './BUCNew'

jest.mock('applications/BUC/components/BUCStart/BUCStart', () => {
  return (props: any) => (<div className='mock-bucstart' title={props.mode} />)
})

describe('applications/BUC/widgets/BUCNew/BUCNew', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BUCNewProps = {
    actions: {},
    t: jest.fn(t => t),
    loading: {},
    locale: 'nb',
    setMode: jest.fn(),
    onTagsChanged: jest.fn()
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
  })
})
