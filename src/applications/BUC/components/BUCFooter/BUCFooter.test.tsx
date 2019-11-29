import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import BUCFooter, { BUCFooterProps } from './BUCFooter'

describe('applications/BUC/components/BUCFooter/BUCFooter', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BUCFooterProps = {
    rinaUrl: 'http://mockurl/rinaUrl',
    t: jest.fn(t => t)
  }

  beforeEach(() => {
    wrapper = mount(<BUCFooter {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-footer')).toBeTruthy()
  })
})
