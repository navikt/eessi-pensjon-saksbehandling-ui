import React from 'react'
import WidgetAddArea from './WidgetAddArea'

describe('components/Dashboard/Widget/WidgetAddArea', () => {
  let wrapper

  const initialMockProps = {
    availableWidsets: [],
    currentBreakpoint: 'lg',
    dragApi: {},
    setWidgets: jest.fn(),
    t: jest.fn((translationString) => { return translationString }),
    widgets: {}
  }

  beforeEach(() => {
    wrapper = mount(<WidgetAddArea {...initialMockProps} />)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.c-d-widgetAddArea')).toBeTruthy()
  })
})
