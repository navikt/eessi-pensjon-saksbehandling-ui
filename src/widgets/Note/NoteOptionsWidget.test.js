import React from 'react'
import _ from 'lodash'
import NoteWidget from './NoteWidget'
import NoteOptionsWidget from './NoteOptionsWidget'
import availableWidgets from 'components/dashboard/Config/AvailableWidgets'
import layout from 'components/dashboard/Config/DefaultLayout'

describe('widgets/Note/NoteOptionsWidget', () => {

  let wrapper
  const initialMockProps = {
    availableWidgets: availableWidgets,
    layout: layout,
    onWidgetUpdate: jest.fn(),
    widget: _.cloneDeep(NoteWidget.properties)
  }

  beforeEach(() => {
    wrapper = mount(<NoteOptionsWidget {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-NoteOptionsWidget')).toBeTruthy()
    expect(wrapper.exists('#w-NoteOptionsWidget__color-select-id')).toBeTruthy()
  })

  it('Saves color when changed', () => {
    const mockColor = 'mockColor'
    const select = wrapper.find('#w-NoteOptionsWidget__color-select-id select').hostNodes()
    select.simulate('change', {target: {value: mockColor}})
    expect(initialMockProps.onWidgetUpdate).toHaveBeenCalledWith({
      ...initialMockProps.widget,
      options: {
        ...initialMockProps.widget.options,
        backgroundColor: mockColor
      }
    },
    initialMockProps.layout)
  })
})
