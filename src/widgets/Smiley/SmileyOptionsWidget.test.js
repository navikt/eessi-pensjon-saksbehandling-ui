import React from 'react'
import _ from 'lodash'
import SmileyWidget from './SmileyWidget'
import SmileyOptionsWidget from './SmileyOptionsWidget'
import availableWidgets from 'components/Dashboard/Config/AvailableWidgets'
import layout from 'components/Dashboard/Config/DefaultLayout'

describe('widgets/Smiley/SmileyOptionsWidget', () => {
  let wrapper
  const initialMockProps = {
    availableWidgets: availableWidgets,
    layout: layout,
    onWidgetUpdate: jest.fn(),
    widget: _.cloneDeep(SmileyWidget.properties)
  }

  beforeEach(() => {
    wrapper = mount(<SmileyOptionsWidget {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-SmileyOptionsWidget')).toBeTruthy()
    expect(wrapper.exists('#w-SmileyOptionsWidget__mood-select-id')).toBeTruthy()
  })

  it('Saves mood when changed', () => {
    const mockMood = 'mockMood'
    const select = wrapper.find('#w-SmileyOptionsWidget__mood-select-id select').hostNodes()
    select.simulate('change', { target: { value: mockMood } })
    expect(initialMockProps.onWidgetUpdate).toHaveBeenCalledWith({
      ...initialMockProps.widget,
      options: {
        ...initialMockProps.widget.options,
        mood: mockMood
      }
    },
    initialMockProps.layout)
  })
})
