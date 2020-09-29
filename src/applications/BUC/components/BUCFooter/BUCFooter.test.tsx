import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { stageSelector } from 'setupTests'
import BUCFooter, { BUCFooterDiv, BUCFooterProps, BUCFooterSelector } from './BUCFooter'

const defaultSelector: BUCFooterSelector = {
  highContrast: false,
  rinaUrl: 'http://mockurl/rinaUrl'
}

describe('applications/BUC/components/BUCFooter/BUCFooter', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BUCFooterProps = {}

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

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
    expect(wrapper.exists(BUCFooterDiv)).toBeTruthy()
  })

  it('Renders empty if no RinaUrl given', () => {
    stageSelector(defaultSelector, { rinaUrl: undefined })
    wrapper = mount(<BUCFooter {...initialMockProps} />)
    expect(wrapper.exists(WaitingPanel)).toBeTruthy()
  })
})
