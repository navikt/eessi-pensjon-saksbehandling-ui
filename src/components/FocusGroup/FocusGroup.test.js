import React from 'react'
import FocusGroup from './Focusgroup'

describe('components/FocusGroup', () => {
  it('Renders', () => {
    const wrapper = mount(<FocusGroup />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    const wrapper = mount(
      <FocusGroup>
        <div id='1' />
        <div id='2' />
        <div id='3' />
        <div id='4' />
      </FocusGroup>)
    expect(wrapper.exists('div[id="1"]')).toBeTruthy()
    expect(wrapper.exists('div[id="2"]')).toBeTruthy()
    expect(wrapper.exists('div[id="3"]')).toBeTruthy()
    expect(wrapper.exists('div[id="4"]')).toBeTruthy()
    expect(wrapper.exists('div[id="5"]')).toBeFalsy()
  })
})

describe('components/FocusGroup Event bubbling', () => {
  it('Focus event bubbles to parent', (done) => {
    const eventHandler = (event) => {
      expect(event.testFlag).toBeTruthy()
      done()
    }

    const wrapper = mount(
      <FocusGroup onFocus={eventHandler} >
        <input type='text' />
      </FocusGroup>
    )
    const child = wrapper.childAt(0)
    child.simulate('focus', { testFlag: true })
  })

  it('Blur event bubbles to parent', (done) => {
    const eventHandler = (event) => {
      expect(event.testFlag).toBeTruthy()
      done()
    }

    const wrapper = mount(
      <FocusGroup onBlur={eventHandler} >
        <input type='text' />
      </FocusGroup>
    )
    const child = wrapper.childAt(0)
    child.simulate('blur', { testFlag: true })
  })
})

describe('components/FocusGroup Event Grouping', () => {
  it('Sends a single focus and blur event', (done) => {
    let focusCounter = 0
    let blurCounter = 0

    const focusHandler = (event) => {
      focusCounter++
    }
    const blurHandler = (event) => {
      blurCounter++
      expect(focusCounter === 1 && blurCounter === 1).toBeTruthy()
      done()
    }

    const wrapper = mount(<FocusGroup onFocus={focusHandler} onBlur={blurHandler} />)
    wrapper.simulate('focus')
    wrapper.simulate('blur')
    wrapper.simulate('focus')
    wrapper.simulate('blur')
    wrapper.simulate('focus')
    wrapper.simulate('blur')
  })
})
