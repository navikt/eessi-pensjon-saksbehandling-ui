import React from 'react'
import DashboardRender from './DashboardRender'

jest.mock('react-dnd', () => {
  return {
    DndProvider: (props) => {
      return (
        <div className='mock-dndprovider'>
          {props.children}
        </div>
      )
    },
    DragSource: (name, opts, conn) => WrappedComponent => {
      return (props) => {
        return <WrappedComponent {...props} />
      }
    },
    DropTarget: (name, opts, conn) => WrappedComponent => {
      return (props) => {
        return (
          <WrappedComponent
            {...props}
            connectDropTarget={WC => { return WC }}
          />
        )
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
  return () => { return undefined }
})

jest.mock('components/Dashboard/Widget/Widget', () => {
  return () => { return <div className='mock-c-d-widget' /> }
})

describe('components/Dashboard/Dashboard', () => {
  const initialMockProps = {
    t: jest.fn((translationString) => { return translationString }),
    addMode: false,
    editMode: false,
    onEditModeOn: jest.fn(),
    onCancelEdit: jest.fn(),
    onSaveEdit: jest.fn(),
    onAddChange: jest.fn(),
    mounted: false,
    layouts: {},
    onLayoutChange: jest.fn(),
    onBreakpointChange: jest.fn(),
    currentBreakpoint: 'lg',
    widgets: [],
    availableWidgets: [],
    setWidgets: jest.fn(),
    onWidgetUpdate: jest.fn(),
    onWidgetResize: jest.fn(),
    onWidgetDelete: jest.fn()
  }

  it('Renders', () => {
    const wrapper = shallow(<DashboardRender {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
    wrapper.unmount()
  })

  it('Has proper HTML structure: loading', () => {
    const wrapper = shallow(<DashboardRender {...initialMockProps} />)
    expect(wrapper.exists('div.c-dashboard__loading')).toBeTruthy()
    wrapper.unmount()
  })

  it('Has proper HTML structure: loaded', () => {
    const wrapper = mount(<DashboardRender {...initialMockProps} mounted />)
    expect(wrapper.exists('div.c-dashboard')).toBeTruthy()
    expect(wrapper.exists('DashboardControlPanel')).toBeTruthy()
    expect(wrapper.exists('DashboardGrid')).toBeTruthy()
    wrapper.unmount()
  })

  it('Has Add mode', () => {
    const wrapper = mount(<DashboardRender {...initialMockProps} />)
    expect(wrapper.exists('WidgetAddArea')).toBeFalsy()
    wrapper.setProps({ ...initialMockProps, mounted: true })
    expect(wrapper.exists('.c-dashboard__controlPanel-buttons')).toBeTruthy()
    expect(wrapper.exists('#c-dashboard__controlPanel-edit-button-id')).toBeTruthy()
    wrapper.setProps({ ...initialMockProps, mounted: true, editMode: true })
    expect(wrapper.exists('#c-dashboard__controlPanel-add-button-id')).toBeTruthy()
    wrapper.setProps({ ...initialMockProps, mounted: true, addMode: true })
    expect(wrapper.exists('WidgetAddArea')).toBeTruthy()
    wrapper.unmount()
  })
})
