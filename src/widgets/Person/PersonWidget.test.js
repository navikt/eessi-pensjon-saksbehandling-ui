import React from 'react'
import PersonWidget from './PersonWidget'
jest.mock('widgets/Person/Person', () => {
  return () => { return <div className='mock-w-person' /> }
})

describe('widgets/PersonWidget', () => {

  let wrapper
  const initialMockProps = {
    onResize: jest.fn(),
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(() => {
    wrapper = mount(<PersonWidget {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('UseEffect: it tries to resize', () => {
    expect(initialMockProps.onResize).toHaveBeenCalled()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.c-d-PersonWidget')).toBeTruthy()
    expect(wrapper.find('.mock-w-person')).toBeTruthy()
  })

  it('Has properties', () => {
    expect(PersonWidget.properties).toHaveProperty('type')
    expect(PersonWidget.properties).toHaveProperty('title')
    expect(PersonWidget.properties).toHaveProperty('description')
    expect(PersonWidget.properties).toHaveProperty('layout')
    expect(PersonWidget.properties).toHaveProperty('options')
  })
})
