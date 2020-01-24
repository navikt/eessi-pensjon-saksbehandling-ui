import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { useSelector } from 'react-redux'
import BUCFooter, { BUCFooterProps } from './BUCFooter'

jest.mock('react-redux')
const defaultSelector = 'http://mockurl/rinaUrl';
(useSelector as jest.Mock).mockImplementation(() => defaultSelector)

describe('applications/BUC/components/BUCFooter/BUCFooter', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BUCFooterProps = {
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
