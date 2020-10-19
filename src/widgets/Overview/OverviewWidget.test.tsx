import { WidgetProps } from 'nav-dashboard'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import OverviewWidget from './OverviewWidget'

jest.mock('widgets/Overview/Overview', () => () => (<div className='mock-w-overview' />))

describe('widgets/OverviewWidget', () => {
  let wrapper: ReactWrapper
  const initialMockProps: WidgetProps = {
    highContrast: false,
    labels: {},
    myWidgets: [],
    onDelete: jest.fn(),
    onResize: jest.fn(),
    onFullFocus: jest.fn(),
    onRestoreFocus: jest.fn(),
    onUpdate: jest.fn(),
    setMode: jest.fn(),
    widget: {
      i: 'i',
      type: 'overview',
      visible: true,
      title: 'Overview',
      options: {
        collapsed: false
      }
    }
  }

  beforeEach(() => {
    wrapper = mount(<OverviewWidget {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: Has proper HTML structure', () => {
    expect(wrapper.exists('[data-test-id=\'w-OverviewWidget\']')).toBeTruthy()
    expect(wrapper.find('.mock-w-overview')).toBeTruthy()
  })

  it('Render: Has properties', () => {
    expect(OverviewWidget.properties).toHaveProperty('type')
    expect(OverviewWidget.properties).toHaveProperty('title')
    expect(OverviewWidget.properties).toHaveProperty('description')
    expect(OverviewWidget.properties).toHaveProperty('layout')
    expect(OverviewWidget.properties).toHaveProperty('options')
  })

  it('UseEffect: it tries to resize', () => {
    expect(initialMockProps.onResize).toHaveBeenCalled()
  })
})
