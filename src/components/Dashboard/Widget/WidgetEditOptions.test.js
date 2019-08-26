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
    }
  }

  beforeEach(() => {
    wrapper = mount(<WidgetEditOptions {...initialMockProps}/>)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('Widgets.NoteOptionsWidget')).toBeTruthy()
  })
})
