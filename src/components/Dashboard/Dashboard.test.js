import React from 'react'
import { Dashboard } from './Dashboard'

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
  let wrapper
  const initialMockProps = {
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(async () => {
    await act(async () => {
      wrapper = mount(<Dashboard {...initialMockProps} />)
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure: loading', () => {
    expect(wrapper.exists('div.c-dashboard__loading')).toBeTruthy()
  })

  it('Has proper HTML structure: loaded', async (done) => {
    await act(async () => {
      await new Promise(resolve => {
        setTimeout(() => {
          wrapper.update()
          expect(wrapper.exists('div.c-dashboard')).toBeTruthy()
          expect(wrapper.exists('DashboardControlPanel')).toBeTruthy()
          expect(wrapper.exists('DashboardGrid')).toBeTruthy()
          done()
        }, 500)
      })
    })
  })

  it('Has Add mode', () => {
    expect(wrapper.exists('WidgetAddArea')).toBeFalsy()
    wrapper.update()
    expect(wrapper.exists('.c-dashboard__controlPanel-buttons')).toBeTruthy()
    wrapper.find('#c-dashboard__controlPanel-edit-button-id').simulate('click')
    wrapper.find('#c-dashboard__controlPanel-add-button-id').hostNodes().simulate('click')
    wrapper.update()
    expect(wrapper.exists('WidgetAddArea')).toBeTruthy()
  })
})
