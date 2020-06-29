import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import Icons, { availableIcons } from './Icons'

describe('components/Icons/Icons', () => {
  let wrapper: ReactWrapper

  it('Renders icons', () => {
    wrapper = mount(<Icons kind='non-existing-icon' />)
    expect(wrapper.isEmptyRender()).toBeTruthy()

    availableIcons.forEach(icon => {
      wrapper = mount(<Icons kind={icon} />)
      expect(wrapper.isEmptyRender()).toBeFalsy()
    })
  })
})
