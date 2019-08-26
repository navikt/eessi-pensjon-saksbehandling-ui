import React from 'react'
import WidgetDelete from './WidgetDelete'

describe('components/Dashboard/Widget/WidgetDelete', () => {

  let wrapper

  const initialMockProps = {
    layout: {foo: 'bar'},
    onResize: jest.fn(),
    onWidgetDelete: jest.fn(),
    setMode: jest.fn(),
    t: jest.fn((translationString) => { return translationString }),
  }

  beforeEach(() => {
    wrapper = mount(<WidgetDelete {...initialMockProps}/>)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.c-d-WidgetDelete')).toBeTruthy()
  })
})
