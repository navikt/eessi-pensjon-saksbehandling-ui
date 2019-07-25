import React from 'react'
import { Footer } from './Footer'

describe('Render File', () => {
  it('Render without crashing', () => {
    let wrapper = shallow(<Footer />)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Toggles open/closed with props', () => {
    let wrapper = shallow(<Footer />)

    expect(wrapper.exists('div.footerButtonClosed'))

    wrapper.setProps({ footerOpen: true })
    expect(wrapper.exists('div.footerButtonOpen'))
  })

  it('Calls OnClick', () => {
    let wrapper = shallow(
      <Footer />
    )
    // expect(store.getState().ui.footerOpen).toEqual(undefined)
    wrapper.dive().find('div.footerButtonClosed').simulate('click')
    // expect(store.getState().ui.footerOpen).toBeTruthy()
  })
})
