import React from 'react'
import SmileyWidget from './SmileyWidget'
import _ from 'lodash'

describe('widgets/Smiley/SmileyWidget', () => {

  let wrapper
  const initialMockProps = {
    onResize: jest.fn(),
    widget: _.cloneDeep(SmileyWidget.properties)
  }

  beforeEach(() => {
    wrapper = mount(<SmileyWidget {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-SmileyWidget')).toBeTruthy()
    expect(wrapper.exists('.w-SmileyWidget__smiley')).toBeTruthy()
  })

  it('Has properties', () => {
    expect(SmileyWidget.properties).toHaveProperty('type')
    expect(SmileyWidget.properties).toHaveProperty('title')
    expect(SmileyWidget.properties).toHaveProperty('description')
    expect(SmileyWidget.properties).toHaveProperty('layout')
    expect(SmileyWidget.properties).toHaveProperty('options')
  })
})
