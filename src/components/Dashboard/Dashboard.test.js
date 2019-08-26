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
        return <WrappedComponent {...props}/>
      }
    },
    DropTarget: (name, opts, conn) => WrappedComponent => {
      return (props) => {
        return <WrappedComponent {...props}
          connectDropTarget={WC => {return WC}}/>
      }
    },
    DragLayer: (opts) => WrappedComponent => {
      return (props) => {
        return <WrappedComponent {...props}/>
      }
    }
  }
})

jest.mock('react-dnd-html5-backend', () => {
  return () => {return undefined}
})

jest.mock('components/Dashboard/Widget/Widget', () => {
  return () => {return <div className='mock-c-d-widget'/>}
})

describe('components/Dashboard/Dashboard', () => {

  let wrapper
  const initialMockProps = {
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(() => {
    wrapper = mount(<Dashboard {...initialMockProps} />)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure: loading', () => {
    expect(wrapper.exists('div.c-dashboard__loading')).toBeTruthy()
  })


  it('Has proper HTML structure: loaded', async (done) => {
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
