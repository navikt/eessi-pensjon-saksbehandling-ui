import { BUCHeaderDiv } from 'applications/BUC/components/BUCHeader/BUCHeader'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import BUCLoading from './BUCLoading'

describe('applications/BUC/components/BUCLoading/BUCLoading', () => {
  let wrapper: ReactWrapper

  beforeEach(() => {
    wrapper = mount(<BUCLoading />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists(BUCHeaderDiv)).toBeTruthy()
  })
})
