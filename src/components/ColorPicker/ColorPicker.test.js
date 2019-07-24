import React from 'react'
import ColorPicker from './ColorPicker'

const color = {
  r: 255,
  g: 255,
  b: 255,
  a: 1
}

describe('Render Colorpicker', () => {
  it('renders without crashing', () => {
    let wrapper = shallow(<ColorPicker color={color} />)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.isEmptyRender()).toEqual(false)
  })
  it('Toggles open/close', () => {
    let wrapper = shallow(<ColorPicker color={color} />)
    expect(wrapper.exists('div.c-colorPicker-popover')).toEqual(false)

    wrapper.find('div.c-colorPicker-container').simulate('click')
    expect(wrapper.exists('div.c-colorPicker-popover')).toBeTruthy()

    wrapper.find('div.c-colorPicker-container').simulate('click')
    expect(wrapper.exists('div.c-colorPicker-popover')).toEqual(false)

    wrapper.find('div.c-colorPicker-container').simulate('click')
    expect(wrapper.exists('div.c-colorPicker-cover')).toBeTruthy()

    wrapper.find('div.c-colorPicker-cover').simulate('click')
    expect(wrapper.exists('div.c-colorPicker-popover')).toEqual(false)
    expect(wrapper.exists('div.c-colorPicker-cover')).toEqual(false)
  })
})
