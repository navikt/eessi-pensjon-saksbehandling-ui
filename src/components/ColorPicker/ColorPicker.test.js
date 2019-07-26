import React from 'react'
import ColorPicker from './ColorPicker'

describe('components/Colorpicker', () => {
  const initialMockProps = {
    color: { r: 255, g: 255, b: 255, a: 1 },
    onChangeComplete: jest.fn()
  }

  it('Renders', () => {
    let wrapper = mount(<ColorPicker {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Toggles open/close', () => {
    let wrapper = mount(<ColorPicker {...initialMockProps} />)
    expect(wrapper.exists('.c-colorPicker__popover')).toBeFalsy()

    wrapper.find('.c-colorPicker__container').hostNodes().simulate('click')
    expect(wrapper.exists('.c-colorPicker__popover')).toBeTruthy()

    wrapper.find('.c-colorPicker__container').hostNodes().simulate('click')
    expect(wrapper.exists('.c-colorPicker__popover')).toBeFalsy()

    wrapper.find('.c-colorPicker__container').hostNodes().simulate('click')
    expect(wrapper.exists('.c-colorPicker__cover')).toBeTruthy()

    wrapper.find('div.c-colorPicker__cover').hostNodes().simulate('click')
    expect(wrapper.exists('div.c-colorPicker__popover')).toBeFalsy()
    expect(wrapper.exists('div.c-colorPicker__cover')).toBeFalsy()
  })
})
