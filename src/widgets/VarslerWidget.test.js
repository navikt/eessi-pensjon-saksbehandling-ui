import React from 'react'
import VarslerWidget from './VarslerWidget'
import _ from 'lodash'

describe('widgets/VarslerWidget', () => {

  let wrapper
  const initialMockProps = {
    actions: {},
    onResize: jest.fn(),
    t: jest.fn((translationString) => { return translationString }),
    widget: _.cloneDeep(VarslerWidget.properties)
  }

  beforeEach(() => {
    wrapper = mount(<VarslerWidget {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-VarslerWidget')).toBeTruthy()
    expect(wrapper.exists('VarslerTable')).toBeFalsy()
    expect(wrapper.exists('VarslerPanel')).toBeTruthy()

    wrapper = mount(<VarslerWidget {...initialMockProps} initialTab='list' />)
    expect(wrapper.exists('VarslerTable')).toBeTruthy()
    expect(wrapper.exists('VarslerPanel')).toBeFalsy()
  })

  it('Has properties', () => {
    expect(VarslerWidget.properties).toHaveProperty('type')
    expect(VarslerWidget.properties).toHaveProperty('title')
    expect(VarslerWidget.properties).toHaveProperty('description')
    expect(VarslerWidget.properties).toHaveProperty('layout')
    expect(VarslerWidget.properties).toHaveProperty('options')
  })
})
