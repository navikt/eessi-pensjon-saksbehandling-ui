import React from 'react'
import OverviewWidget from './OverviewWidget'
jest.mock('widgets/Overview/Overview', () => {
  return () => { return <div className='mock-w-overview' /> }
})

describe('widgets/OverviewWidget', () => {
  let wrapper
  const initialMockProps = {
    onResize: jest.fn(),
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(() => {
    wrapper = mount(<OverviewWidget {...initialMockProps} />)
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
    expect(wrapper.exists('.c-d-OverviewWidget')).toBeTruthy()
    expect(wrapper.find('.mock-w-overview')).toBeTruthy()
  })

  it('Has properties', () => {
    expect(OverviewWidget.properties).toHaveProperty('type')
    expect(OverviewWidget.properties).toHaveProperty('title')
    expect(OverviewWidget.properties).toHaveProperty('description')
    expect(OverviewWidget.properties).toHaveProperty('layout')
    expect(OverviewWidget.properties).toHaveProperty('options')
  })
})
