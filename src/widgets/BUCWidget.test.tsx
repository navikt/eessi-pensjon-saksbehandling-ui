import { WidgetProps } from 'nav-dashboard'
import React from 'react'
import BUCWidget from './BUCWidget'
import { mount, ReactWrapper } from 'enzyme'

jest.mock('applications/BUC/', () => () => (<div className='mock-a-buc' />))

describe('widgets/BUCWidget', () => {
  let wrapper: ReactWrapper
  const initialMockProps: WidgetProps = {
    onFullFocus: jest.fn(),
    onResize: jest.fn(),
    onRestoreFocus: jest.fn(),
    onUpdate: jest.fn(),
    widget: {
      i: 'i',
      type: 'buc',
      title: 'Buc',
      visible: true,
      options: {}
    }
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
