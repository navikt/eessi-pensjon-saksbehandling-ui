import React from 'react'
import FocusGroup from './FocusGroup'

describe('components/FocusGroup', () => {
  it('Renders', () => {
    let wrapper
    act(() => {
      wrapper = mount(<FocusGroup />)
    })
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    let wrapper
    act(() => {
      wrapper = mount(
        <FocusGroup>
          <div id='1' />
          <div id='2' />
          <div id='3' />
          <div id='4' />
        </FocusGroup>)
    })
    expect(wrapper.exists('div[id="1"]')).toBeTruthy()
    expect(wrapper.exists('div[id="2"]')).toBeTruthy()
    expect(wrapper.exists('div[id="3"]')).toBeTruthy()
    expect(wrapper.exists('div[id="4"]')).toBeTruthy()
    expect(wrapper.exists('div[id="5"]')).toBeFalsy()
  })
})

describe('components/FocusGroup Event bubbling', () => {
  it('Focus event bubbles to parent', async (done) => {
    const eventHandler = (event) => {
      expect(event.testFlag).toBeTruthy()
      done()
    }

    let wrapper

    act(() => {
      wrapper = mount(
        <FocusGroup onFocus={eventHandler}>
          <input type='text' />
        </FocusGroup>
      )
    })

    const child = wrapper.childAt(0)
    act(() => {
      child.simulate('focus', { testFlag: true })
    })
  })

  it('Blur event bubbles to parent', (done) => {
    jest.useFakeTimers()
    const eventHandler = (event) => {
      expect(event.testFlag).toBeTruthy()
      done()
    }

    let wrapper
    act(() => {
      wrapper = mount(
        <FocusGroup onBlur={eventHandler}>
          <input type='text' />
        </FocusGroup>
      )
    })

    const child = wrapper.childAt(0)

    act(() => {
      child.simulate('blur', { testFlag: true })
    })

    act(() => {
      jest.runAllTimers()
    })
  })
})
