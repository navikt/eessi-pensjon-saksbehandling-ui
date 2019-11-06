import React from 'react'
import BUCFooter from './BUCFooter'

describe('applications/BUC/components/BUCFooter/BUCFooter', () => {
  let wrapper
  const initialMockProps = {
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
