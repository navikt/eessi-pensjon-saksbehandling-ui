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

  it('Render: something', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    // can't do it, markup is always different
    // expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists(BUCHeaderDiv)).toBeTruthy()
  })
})
