import React from 'react'
import WidgetAddArea from './WidgetAddArea'
jest.mock('react-dnd', () => {
  return {
    DragSource: (name, opts, conn) => WrappedComponent => {
      return (props) => {
        return <WrappedComponent {...props} />
      }
    },
    DragLayer: (opts) => WrappedComponent => {
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

jest.mock('./WidgetAdd', () => {
  return () => { return <div className='mock-widgetadd' /> }
})

describe('components/Dashboard/Widget/WidgetAddArea', () => {
  let wrapper

  const initialMockProps = {
    availableWidgets: [{
      foo: 'mockAvailableWidget'
    }],
    currentBreakpoint: 'lg',
    dragApi: {},
    setWidgets: jest.fn(),
    t: jest.fn((translationString) => { return translationString }),
    widgets: {}
  }

  beforeEach(() => {
    wrapper = mount(<WidgetAddArea {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.c-d-widgetAddArea')).toBeTruthy()
  })
})
