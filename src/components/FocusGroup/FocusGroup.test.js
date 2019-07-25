import React from 'react'
import FocusGroup from './Focusgroup'

describe('Focusgroup Rendering', () => {
  it('Renders without crashing', () => {
    let wrapper = shallow(<FocusGroup />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Render child components', () => {
    let wrapper = shallow(
      <FocusGroup>
        <div id='1' />
        <div id='2' />
        <div id='3' />
        <div id='4' />
      </FocusGroup>)
    expect(wrapper.children().length).toEqual(4)
    expect(wrapper.exists('div[id="1"]')).toBeTruthy()
    expect(wrapper.exists('div[id="2"]')).toBeTruthy()
    expect(wrapper.exists('div[id="3"]')).toBeTruthy()
    expect(wrapper.exists('div[id="4"]')).toBeTruthy()
    expect(wrapper.exists('div[id="5"]')).toBeFalsy()
  })
})

describe('Focusgroup Event bubbling', () => {
  it('Focus event bubbles to parent', (done) => {
    function eventHandler (event) {
      expect(event.testFlag).toBeTruthy()
      done()
    }

    let wrapper = mount(
      <FocusGroup onFocus={eventHandler} >
        <input type='text' />
      </FocusGroup>
    )
    let child = wrapper.childAt(0)
    child.simulate('focus', { 'testFlag': true })
    wrapper.unmount()
  })

  it('Blur event bubbles to parent', (done) => {
    function eventHandler (event) {
      expect(event.testFlag).toBeTruthy()
      done()
    }

    let wrapper = mount(
      <FocusGroup onBlur={eventHandler} >
        <input type='text' />
      </FocusGroup>
    )
    let child = wrapper.childAt(0)
    child.simulate('blur', { 'testFlag': true })
    wrapper.unmount()
  })
})

describe('Focusgroup Event Grouping', () => {
  it('Sends a single focus and blur event', (done) => {
    let focusCounter = 0
    let blurCounter = 0

    function focusHandler (event) {
      focusCounter++
    }
    function blurHandler (event) {
      blurCounter++
      expect(focusCounter === 1 && blurCounter === 1).toBeTruthy()
      done()
    }

    let wrapper = mount(<FocusGroup onFocus={focusHandler} onBlur={blurHandler} />)
    wrapper.simulate('focus')
    wrapper.simulate('blur')
    wrapper.simulate('focus')
    wrapper.simulate('blur')
    wrapper.simulate('focus')
    wrapper.simulate('blur')

    wrapper.unmount()
  })
})
