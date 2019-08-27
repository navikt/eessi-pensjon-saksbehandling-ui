import React from 'react'
import WidgetEdit from './WidgetEdit'

describe('components/Dashboard/Widget/WidgetEdit', () => {
  let wrapper

  const initialMockProps = {
    setMode: jest.fn(),
    t: jest.fn((translationString) => { return translationString }),
    widget: {
      type: 'foo'
    }
  }

  beforeEach(() => {
    wrapper = mount(<WidgetEdit {...initialMockProps} />)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.c-d-WidgetEdit')).toBeTruthy()
  })
})
