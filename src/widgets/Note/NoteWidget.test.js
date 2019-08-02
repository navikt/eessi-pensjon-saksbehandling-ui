import React from 'react'
import NoteWidget from './NoteWidget'
import _ from 'lodash'
import layout from 'components/dashboard/Config/DefaultLayout'

describe('widgets/Note/NoteWidget', () => {
  let wrapper
  const initialMockProps = {
    id: 'mock-id',
    layout: layout,
    onResize: jest.fn(),
    onWidgetUpdate: jest.fn(),
    widget: _.cloneDeep(NoteWidget.properties)
  }

  document.getElementById = jest.fn((id) => {
    return {
      offsetWidth: 999,
      offsetHeight: 999
    }
  })

  beforeEach(() => {
    wrapper = mount(<NoteWidget {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-NoteWidget')).toBeTruthy()
    expect(wrapper.exists('.w-NoteWidget__content')).toBeTruthy()
  })

  it('Saves content when blurred', () => {
    const div = wrapper.find('.w-NoteWidget__content').hostNodes()
    div.simulate('blur')
    expect(initialMockProps.onResize).toHaveBeenCalledWith(999, 999)
    expect(initialMockProps.onWidgetUpdate).toHaveBeenCalledWith({
      ...initialMockProps.widget,
      options: {
        ...initialMockProps.widget.options,
        content: ''
      }
    },
    initialMockProps.layout)
  })

  it('Has properties', () => {
    expect(NoteWidget.properties).toHaveProperty('type')
    expect(NoteWidget.properties).toHaveProperty('title')
    expect(NoteWidget.properties).toHaveProperty('description')
    expect(NoteWidget.properties).toHaveProperty('layout')
    expect(NoteWidget.properties).toHaveProperty('options')
  })
})
