import { setStatusParam, unsetStatusParam } from 'actions/app'
import { toggleFooterOpen } from 'actions/ui'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import Footer, { FooterProps } from './Footer'

jest.mock('actions/ui', () => ({
  toggleFooterOpen: jest.fn()
}))
jest.mock('actions/app', () => ({
  setStatusParam: jest.fn(),
  unsetStatusParam: jest.fn()
}))
describe('components/Footer', () => {
  let wrapper: ReactWrapper
  const initialMockProps: FooterProps = {
    footerOpen: true,
    params: {}
  }

  it('Renders', () => {
    wrapper = mount(<Footer {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Toggles open/closed with props', () => {
    wrapper = mount(<Footer {...initialMockProps} footerOpen={false} />)
    expect(wrapper.exists('div.footerButtonClosed')).toBeTruthy()
    wrapper.setProps({ footerOpen: true })
    expect(wrapper.exists('div.footerButtonOpen')).toBeTruthy()
  })

  it('Toggles open/closed with click', () => {
    wrapper = mount(<Footer {...initialMockProps} footerOpen={false} />)
    wrapper.find('.footerButtonClosed').hostNodes().simulate('click')
    expect(toggleFooterOpen).toHaveBeenCalled()
  })

  it('Adds a param', () => {
    wrapper = mount(<Footer {...initialMockProps} />)
    wrapper.find('#c-footer__select-id').hostNodes().simulate('change', { target: { value: 'aktoerId' } })
    wrapper.find('#c-footer__input-id').hostNodes().simulate('change', { target: { value: '123' } })
    wrapper.find('#c-footer__add-button-id').hostNodes().simulate('click')
    expect(setStatusParam).toHaveBeenCalled()
  })

  it('Remove a param', () => {
    wrapper = mount(<Footer {...initialMockProps} params={{ sakId: '123' }} />)
    expect(wrapper.find('.c-footer__param-string').hostNodes().render().text()).toEqual('sakId 123')
    wrapper.find('.c-footer__remove-button').hostNodes().simulate('click')
    expect(unsetStatusParam).toHaveBeenCalled()
  })
})
