import React from 'react'
import ColorPicker from './ColorPicker'

const color = {
  r: 255,
  g: 255,
  b: 255,
  a: 1
}

describe('Render Colorpicker', ()=>{
  it('renders without crashing', ()=>{
    let wrapper = shallow(<ColorPicker color={color}/>)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.isEmptyRender()).toEqual(false)
  })
  it('Toggles open/close', ()=>{
    let wrapper = shallow(<ColorPicker color={color}/>)
    expect(wrapper.exists('div.c-ui-colorPicker-popover')).toEqual(false)

    wrapper.find('div.c-ui-colorPicker-container').simulate('click')
    expect(wrapper.exists('div.c-ui-colorPicker-popover')).toEqual(true)

    wrapper.find('div.c-ui-colorPicker-container').simulate('click')
    expect(wrapper.exists('div.c-ui-colorPicker-popover')).toEqual(false)

    wrapper.find('div.c-ui-colorPicker-container').simulate('click')
    expect(wrapper.exists('div.c-ui-colorPicker-cover')).toEqual(true)
    
    wrapper.find('div.c-ui-colorPicker-cover').simulate('click')
    expect(wrapper.exists('div.c-ui-colorPicker-popover')).toEqual(false)
    expect(wrapper.exists('div.c-ui-colorPicker-cover')).toEqual(false)
  })
})
