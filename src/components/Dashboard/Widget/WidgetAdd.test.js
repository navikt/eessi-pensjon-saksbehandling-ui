import React from 'react'
import { WidgetAdd } from './WidgetAdd'
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

describe('components/Dashboard/Widget/WidgetAdd', () => {
  let wrapper
  const initialMockProps = {
    connectDragPreview: jest.fn(),
    connectDragSource: jest.fn(),
    isDragging: false,
    widget: {
      title: 'mockTitle',
      description: 'mockDescription',
      type: 'foo'
    }
  }

  beforeEach(() => {
    wrapper = mount(<WidgetAdd {...initialMockProps} />)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.c-d-widgetAdd')).toBeTruthy()
    expect(wrapper.find('.c-d-widgetAdd__title').render().text()).toEqual('mockTitle')
    expect(wrapper.find('.c-d-widgetAdd__description').render().text()).toEqual('mockDescription')
  })
})
