import React from 'react'
import CatMidget from './CatMidget'

describe('widgets/Cat/CatMidget', () => {
  let wrapper
  const initialMockProps = {
    onResize: jest.fn()
  }

  beforeEach(() => {
    wrapper = mount(<CatMidget {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('UseEffect: it tries to resize', () => {
    expect(initialMockProps.onResize).toHaveBeenCalled()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-catMidget')).toBeTruthy()
    expect(wrapper.find('img')).toBeTruthy()
  })

  it('Has properties', () => {
    expect(CatMidget.properties).toHaveProperty('type')
    expect(CatMidget.properties).toHaveProperty('title')
    expect(CatMidget.properties).toHaveProperty('description')
    expect(CatMidget.properties).toHaveProperty('layout')
    expect(CatMidget.properties).toHaveProperty('options')
  })
})
