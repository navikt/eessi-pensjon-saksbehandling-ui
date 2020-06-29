import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import MultipleValueRemove from './MultipleValueRemove'

describe('components/MultipleSelect/MultipleValueRemove', () => {
  let wrapper: ReactWrapper
  const initialMockProps = {}

  beforeEach(() => {
    // @ts-ignore
    wrapper = mount(<MultipleValueRemove {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.find('c-multipleSelect-multipleValueRemove')).toBeTruthy()
  })
})
