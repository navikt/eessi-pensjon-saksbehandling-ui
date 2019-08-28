import React from 'react'
import WidgetAddArea from './WidgetAddArea'
jest.mock('react-dnd', () => {
  return {
    DragSource: (name, opts, conn) => WrappedComponent => {
      return (props) => {
        return <WrappedComponent {...props} />
      }
    }
  }
})

jest.mock('react-dnd-html5-backend', () => {
  return {
    getEmptyImage: () => { return undefined }
  }
})

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
