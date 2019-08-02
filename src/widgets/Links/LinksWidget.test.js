import React from 'react'
import LinksWidget from './LinksWidget'
jest.mock('widgets/Links/Links', () => {
  return () => { return <div className='mock-w-links' /> }
})

describe('widgets/Links/LinksWidget', () => {
  let wrapper
  const initialMockProps = {
    onResize: jest.fn(),
    onUpdate: jest.fn(),
    t: jest.fn((translationString) => { return translationString }),
    widget: {
      title: 'mockTitle',
      options: {
        collapsed: false
      }
    }
  }

  beforeEach(() => {
    wrapper = mount(<LinksWidget {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-LinksWidget')).toBeTruthy()
    expect(wrapper.find('.mock-w-links')).toBeTruthy()
  })

  it('It tries to save state when collapse changes', () => {
    wrapper.find('Ekspanderbartpanel button').simulate('click')
    expect(initialMockProps.onUpdate).toHaveBeenCalledWith({
      options: {
        collapsed: true
      },
      title: 'mockTitle'
    })
  })

  it('Has properties', () => {
    expect(LinksWidget.properties).toHaveProperty('type')
    expect(LinksWidget.properties).toHaveProperty('title')
    expect(LinksWidget.properties).toHaveProperty('description')
    expect(LinksWidget.properties).toHaveProperty('layout')
    expect(LinksWidget.properties).toHaveProperty('options')
  })
})
