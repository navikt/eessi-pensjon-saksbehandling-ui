import React from 'react'
import { DashboardGrid } from './DashboardGrid'

jest.mock('react-dnd', () => {
  return {
    DropTarget: (name, opts, conn) => WrappedComponent => {
      return (props) => {
        return (
          <WrappedComponent
            {...props}
            connectDropTarget={WC => { return WC }}
          />
        )
      }
    }
  }
})

describe('components/Dashboard/DashboardGrid', () => {
  let wrapper
  const initialMockProps = {
    availableWidgets: [],
    canDrop: jest.fn(),
    connectDropTarget: WC => { return WC },
    currentBreakpoint: 'lg',
    dragApi: {},
    editMode: false,
    layouts: { lg: [] },
    mounted: true,
    onBreakpointChange: jest.fn(),
    onLayoutChange: jest.fn(),
    onWidgetUpdate: jest.fn(),
    onWidgetResize: jest.fn(),
    onWidgetDelete: jest.fn(),
    rowHeight: 30,
    t: jest.fn((translationString) => { return translationString }),
    widgets: []
  }

  beforeEach(() => {
    wrapper = mount(<DashboardGrid {...initialMockProps} />)
  })

  it('Renders', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('div.c-dashboard__grid')).toBeTruthy()
  })
})
