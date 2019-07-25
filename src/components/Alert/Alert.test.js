import React from 'react'
import { Alert } from './Alert'

describe('components/Alert/Alert', () => {
  let wrapper
  const t = jest.fn((translationString) => { return translationString })
  const initialMockProps = {
    actions: {
      clientClear: jest.fn()
    },
    clientErrorStatus: 'OK',
    clientErrorMessage: 'mockClientErrorMessage',
    error: undefined,
    serverErrorMessage: 'mockServerErrorMessage',
    t: t
  }

  it('Renders', () => {
    wrapper = mount(<Alert {...initialMockProps} type='server'/>)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure as server', () => {
    wrapper = mount(<Alert {...initialMockProps}  type='server' />)
    expect(wrapper.exists('.c-alert.server')).toBeTruthy()
    expect(wrapper.render().text()).toEqual('mockServerErrorMessage')
  })

  it('Has proper HTML structure as client', () => {
    wrapper = mount(<Alert {...initialMockProps}  type='client' />)
    expect(wrapper.exists('.c-alert.client')).toBeTruthy()
    expect(wrapper.render().text()).toEqual('mockClientErrorMessage')
  })

  it('Has proper HTML structure as client in OK type', () => {
     wrapper = mount(<Alert {...initialMockProps}  type='client' />)
     expect(wrapper.render().hasClass('alertstripe--suksess')).toBeTruthy()
  })

  it('Has proper HTML structure as client in ERROR type', () => {
     wrapper = mount(<Alert {...initialMockProps}  type='client' clientErrorStatus='WARNING'/>)
     expect(wrapper.render().hasClass('alertstripe--advarsel')).toBeTruthy()
  })

  it('Has proper HTML structure as client in ERROR type', () => {
     wrapper = mount(<Alert {...initialMockProps}  type='client' clientErrorStatus='ERROR'/>)
     expect(wrapper.render().hasClass('alertstripe--feil')).toBeTruthy()
  })
})
