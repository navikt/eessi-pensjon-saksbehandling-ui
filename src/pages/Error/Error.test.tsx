import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { Error as PageError, ErrorProps } from './Error'

jest.mock('components/TopContainer/TopContainer', () => {
  return ({ children }: { children: JSX.Element }) => {
    return (
      <div className='mock-c-topcontainer'>
        {children}
      </div>
    )
  }
})

describe('pages/Error', () => {
  let wrapper: ReactWrapper
  const initialMockProps: ErrorProps = {
    history: {},
    type: 'mockType'
  }

  it('Renders', () => {
    wrapper = mount(<PageError {...initialMockProps} type='something' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Page forbidden: Has proper HTML structure', () => {
    wrapper = mount(<PageError {...initialMockProps} type='forbidden' />)
    expect(wrapper.exists('.p-error')).toBeTruthy()
    expect(wrapper.find('.p-error .title').hostNodes().render().text()).toEqual('ui:error-forbidden-title')
    expect(wrapper.find('.p-error .description').hostNodes().render().text()).toEqual('ui:error-forbidden-description')
    expect(wrapper.find('.p-error .footer').hostNodes().render().text()).toEqual('ui:error-forbidden-footer')
  })

  it('Page notLogged: Has proper HTML structure', () => {
    wrapper = mount(<PageError {...initialMockProps} type='notLogged' />)
    expect(wrapper.exists('.p-error')).toBeTruthy()
    expect(wrapper.find('.p-error .title').hostNodes().render().text()).toEqual('ui:error-notLogged-title')
    expect(wrapper.find('.p-error .description').hostNodes().render().text()).toEqual('ui:error-notLogged-description')
    expect(wrapper.find('.p-error .footer').hostNodes().render().text()).toEqual('ui:error-notLogged-footer')
  })

  it('Page notInvited: Has proper HTML structure', () => {
    wrapper = mount(<PageError {...initialMockProps} type='notInvited' />)
    expect(wrapper.exists('.p-error')).toBeTruthy()
    expect(wrapper.find('.p-error .title').hostNodes().render().text()).toEqual('ui:error-notInvited-title')
    expect(wrapper.find('.p-error .description').hostNodes().render().text()).toEqual('ui:error-notInvited-description')
    expect(wrapper.find('.p-error .footer').hostNodes().render().text()).toEqual('ui:error-notInvited-footer')
  })

  it('Page internalError: Has proper HTML structure', () => {
    const mockError = new Error('Mock error')
    wrapper = mount(<PageError {...initialMockProps} type='internalError' error={mockError} />)
    expect(wrapper.exists('.p-error')).toBeTruthy()
    expect(wrapper.find('.p-error .title').hostNodes().render().text()).toEqual('ui:error-internalError-title')
    expect(wrapper.find('.p-error .description').hostNodes().render().text()).toEqual('ui:error-internalError-description')
    expect(wrapper.exists('.p-error .p-error__content-error')).toBeTruthy()
    expect(wrapper.find('.p-error .footer').hostNodes().render().text()).toEqual('ui:error-internalError-footer')
  })

  it('Page default: Has proper HTML structure', () => {
    wrapper = mount(<PageError {...initialMockProps} type='default' />)
    expect(wrapper.exists('.p-error')).toBeTruthy()
    expect(wrapper.find('.p-error .title').hostNodes().render().text()).toEqual('ui:error-404-title')
    expect(wrapper.find('.p-error .description').hostNodes().render().text()).toEqual('ui:error-404-description')
  })
})
