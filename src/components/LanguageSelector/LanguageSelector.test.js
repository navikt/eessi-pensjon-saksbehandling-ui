import React from 'react'
import LanguageSelector from './LanguageSelector'

describe('Render LanguageSelector', () => {
  it('Renders without crashing', () => {
    let wrapper = shallow(
      <LanguageSelector />
    )
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })
})
