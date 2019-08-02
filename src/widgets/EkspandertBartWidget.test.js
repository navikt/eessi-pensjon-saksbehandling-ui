import React from 'react'
import EkspandertBartWidget from './EkspandertBartWidget'

describe('widgets/EkspandertBartWidget', () => {
  let wrapper
  const initialMockProps = {
    onResize: jest.fn(),
    onUpdate: jest.fn(),
    t: jest.fn((translationString) => { return translationString }),
    widget: {
      title: 'mockTitle',
      options: {
        content: 'mockContent',
        collapsed: false
      }
    }
  }

  beforeEach(() => {
    wrapper = mount(<EkspandertBartWidget {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('It tries to save state when collapse changes', () => {
    wrapper.find('Ekspanderbartpanel button').simulate('click')
    expect(initialMockProps.onUpdate).toHaveBeenCalledWith({
      options: {
        content: 'mockContent',
        collapsed: true
      },
      title: 'mockTitle'
    })
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-EkspandertbartWidget')).toBeTruthy()
    expect(wrapper.find('.w-EkspandertbartWidget .content').render().text()).toEqual('mockContent')
  })

  it('Has properties', () => {
    expect(EkspandertBartWidget.properties).toHaveProperty('type')
    expect(EkspandertBartWidget.properties).toHaveProperty('title')
    expect(EkspandertBartWidget.properties).toHaveProperty('description')
    expect(EkspandertBartWidget.properties).toHaveProperty('layout')
    expect(EkspandertBartWidget.properties).toHaveProperty('options')
  })
})
