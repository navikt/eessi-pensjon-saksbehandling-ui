import React from 'react'
import { Footer } from './Footer'

describe('components/Footer', () => {

  const initialMockProps = {
    actions: {
      toggleFooterOpen: jest.fn(),
      setStatusParam: jest.fn(),
      unsetStatusParam: jest.fn()
    }
  }


  it('Renders', () => {
    let wrapper = mount(<Footer />)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Toggles open/closed with props', () => {
    let wrapper = mount(<Footer />)
    expect(wrapper.exists('div.footerButtonClosed'))
    wrapper.setProps({ footerOpen: true })
    expect(wrapper.exists('div.footerButtonOpen'))
  })

  it('Toggles open/closed with click', () => {
    let wrapper = mount(<Footer {...initialMockProps}/> )
    wrapper.find('.footerButtonClosed').simulate('click')
    expect(initialMockProps.actions.toggleFooterOpen).toHaveBeenCalled()
  })

  it('Toggles open/closed with click', () => {
    let wrapper = mount(<Footer {...initialMockProps}/> )
    wrapper.find('.footerButtonClosed').simulate('click')
    expect(initialMockProps.actions.toggleFooterOpen).toHaveBeenCalled()
  })
})
