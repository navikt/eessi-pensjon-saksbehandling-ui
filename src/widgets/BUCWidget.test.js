import React from 'react'
import BUCWidget from './BUCWidget'
jest.mock('applications/BUC/', () => {
  return () => { return <div className='mock-a-buc' /> }
})

describe('widgets/BUCWidget', () => {
  let wrapper
  const initialMockProps = {
    onResize: jest.fn()
  }

  beforeEach(() => {
    wrapper = mount(<BUCWidget {...initialMockProps} />)
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
    expect(wrapper.exists('.w-BucWidget')).toBeTruthy()
    expect(wrapper.find('.mock-a-buc')).toBeTruthy()
  })

  it('Has properties', () => {
    expect(BUCWidget.properties).toHaveProperty('type')
    expect(BUCWidget.properties).toHaveProperty('title')
    expect(BUCWidget.properties).toHaveProperty('description')
    expect(BUCWidget.properties).toHaveProperty('layout')
    expect(BUCWidget.properties).toHaveProperty('options')
  })
})
