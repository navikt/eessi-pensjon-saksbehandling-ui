import React from 'react'
import { Alert } from './Alert'

describe('components/Alert/Alert', () => {
  let wrapper
  const initialMockProps = {
    actions: {
      clientClear: jest.fn()
    },
    clientErrorStatus: 'OK',
    clientErrorMessage: 'mockClientErrorMessage|param',
    error: undefined,
    serverErrorMessage: 'mockServerErrorMessage',
    t: jest.fn((translationString) => { return translationString })
  }

  it('Renders', () => {
    wrapper = mount(<Alert {...initialMockProps} type='server' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure as server', () => {
    wrapper = mount(<Alert {...initialMockProps} type='server' />)
    expect(wrapper.exists('.c-alert.server')).toBeTruthy()
    expect(wrapper.render().text()).toEqual('mockServerErrorMessage')
  })

  it('Has proper HTML structure as client', () => {
    wrapper = mount(<Alert {...initialMockProps} type='client' />)
    expect(wrapper.exists('.c-alert.client')).toBeTruthy()
    expect(wrapper.render().text()).toEqual('mockClientErrorMessage: param')
  })

  it('Has proper HTML structure as client in OK type', () => {
    wrapper = mount(<Alert {...initialMockProps} type='client' />)
    expect(wrapper.render().hasClass('alertstripe--suksess')).toBeTruthy()
  })

  it('Has proper HTML structure as client in ERROR type', () => {
    wrapper = mount(<Alert {...initialMockProps} type='client' clientErrorStatus='WARNING' />)
    expect(wrapper.render().hasClass('alertstripe--advarsel')).toBeTruthy()
  })

  it('Has proper HTML structure as client in ERROR type', () => {
    wrapper = mount(<Alert {...initialMockProps} type='client' clientErrorStatus='ERROR' />)
    expect(wrapper.render().hasClass('alertstripe--feil')).toBeTruthy()
  })

  it('Close button clears alert', () => {
    wrapper = mount(<Alert {...initialMockProps} type='client' clientErrorStatus='ERROR' />)
    wrapper.find('.closeIcon').hostNodes().simulate('click')
    expect(initialMockProps.actions.clientClear).toHaveBeenCalled()
  })

  it('Pretty prints a error message', () => {
    const error = {
      status: '500',
      message: 'message',
      error: 'error',
      uuid: 'uuid'
    }
    wrapper = mount(<Alert {...initialMockProps} type='server' error={error} />)
    expect(wrapper.render().text()).toEqual('mockServerErrorMessage: 500 - message - error - uuid')
  })
})
