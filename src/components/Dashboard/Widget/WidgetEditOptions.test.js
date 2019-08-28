import React from 'react'
import WidgetEditOptions from './WidgetEditOptions'

describe('components/Dashboard/Widget/WidgetEditOptions', () => {
  let wrapper

  const initialMockProps = {
    widget: {
      type: 'note',
      options: {
        backgroundColor: 'mockColor'
      }
    },
    availableWidgets: [{
      type: 'note',
      options: {
        availableColors: ['mockColor']
      }
    }],
    layout: {},
    onWidgetUpdate: jest.fn()
  }

  beforeEach(() => {
    wrapper = mount(<WidgetEditOptions {...initialMockProps} />)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-NoteOptionsWidget')).toBeTruthy()
  })
})
