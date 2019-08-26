import React from 'react'
import WidgetContainer from './WidgetContainer'

document.getElementById = (el) => {
  return {
    offsetWidth: 0,
    offsetHeight: 0
  }
}

describe('components/Dashboard/Widget/WidgetContainer', () => {

  let wrapper

  const initialMockProps = {
    currentBreakpoint: 'lg',
    editMode: false,
    layout: {foo: 'bar'},
    onWidgetUpdate: jest.fn(),
    onWidgetResize: jest.fn(),
    rowHeight: 0,
    t: jest.fn((translationString) => { return translationString }),
    widget: {
      options: {
        backgroundColor: 'mockColor'
      }
    }
  }

  beforeEach(() => {
    wrapper = mount(<WidgetContainer {...initialMockProps}/>)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.c-d-Widget')).toBeTruthy()
    expect(wrapper.exists('Widget')).toBeTruthy()
  })
})
