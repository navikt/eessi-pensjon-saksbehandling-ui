import React from 'react'
import { Footer } from './Footer'

describe('components/Footer', () => {
  const initialMockProps = {
    actions: {
      toggleFooterOpen: jest.fn(),
      setStatusParam: jest.fn(),
      unsetStatusParam: jest.fn()
    },
    footerOpen: true
  }

  it('Renders', () => {
    const wrapper = mount(<Footer {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Toggles open/closed with props', () => {
    const wrapper = mount(<Footer {...initialMockProps} footerOpen={false} />)
    expect(wrapper.exists('div.footerButtonClosed'))
    wrapper.setProps({ footerOpen: true })
    expect(wrapper.exists('div.footerButtonOpen'))
  })

  it('Toggles open/closed with click', () => {
    const wrapper = mount(<Footer {...initialMockProps} footerOpen={false} />)
    wrapper.find('.footerButtonClosed').hostNodes().simulate('click')
    expect(initialMockProps.actions.toggleFooterOpen).toHaveBeenCalled()
  })

  it('Adds a param', () => {
    const wrapper = mount(<Footer {...initialMockProps} />)
    wrapper.find('#c-footer__select-id').hostNodes().simulate('change', { target: { value: 'aktoerId' } })
    wrapper.find('#c-footer__input-id').hostNodes().simulate('change', { target: { value: '123' } })
    wrapper.find('#c-footer__add-button-id').hostNodes().simulate('click')
    expect(initialMockProps.actions.setStatusParam).toHaveBeenCalled()
  })

  it('Remove a param', () => {
    const wrapper = mount(<Footer {...initialMockProps} sakId='123' />)
    expect(wrapper.find('.c-footer__param-string').hostNodes().render().text()).toEqual('sakId 123')
    wrapper.find('.c-footer__remove-button').hostNodes().simulate('click')
    expect(initialMockProps.actions.unsetStatusParam).toHaveBeenCalled()
  })
})
