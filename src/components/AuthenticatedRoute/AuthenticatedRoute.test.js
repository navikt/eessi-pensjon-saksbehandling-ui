import React from 'react'
import { Router } from 'react-router'
import { createBrowserHistory } from 'history'
import * as routes from 'constants/routes'
import { AuthenticatedRoute } from './AuthenticatedRoute'
jest.mock('eessi-pensjon-ui', () => {
  const Ui = jest.requireActual('eessi-pensjon-ui')
  return {
    ...Ui,
    WaitingPanel: () => <div className='mock-waitingPanel' />
  }
})

describe('components/AuthenticatedRoute', () => {
  const initialMockProps = {
    actions: {
      setStatusParam: jest.fn(),
      login: jest.fn(),
      getUserInfo: jest.fn()
    },
    location: {
      search: '?a=b&sakId=123&aktoerId=456'
    },
    t: jest.fn(t => t)
  }

  it('UseEffect: read status params', () => {
    mount(
      <Router history={createBrowserHistory()}>
        <AuthenticatedRoute {...initialMockProps} />
      </Router>)
    expect(initialMockProps.actions.setStatusParam).toBeCalledWith('a', 'b')
    expect(initialMockProps.actions.setStatusParam).toBeCalledWith('sakId', '123')
    expect(initialMockProps.actions.setStatusParam).toBeCalledWith('aktoerId', '456')
  })

  it('UseEffect: ask for userInfo', () => {
    mount(
      <Router history={createBrowserHistory()}>
        <AuthenticatedRoute {...initialMockProps} />
      </Router>)
    expect(initialMockProps.actions.getUserInfo).toBeCalled()
  })

  it('UseEffect: redirect for login', () => {
    mount(<AuthenticatedRoute {...initialMockProps} loggedIn={false} />)
    expect(initialMockProps.actions.login).toBeCalled()
    initialMockProps.actions.login.mockRestore()
  })

  it('UseEffect: no need for login redirect', () => {
    mount(
      <Router history={createBrowserHistory()}>
        <AuthenticatedRoute {...initialMockProps} loggedIn />
      </Router>)
    expect(initialMockProps.actions.login).not.toBeCalled()
  })

  it('Has proper HTML structure: not mounted', () => {
    const wrapper = mount(
      <Router history={createBrowserHistory()}>
        <AuthenticatedRoute {...initialMockProps} />
      </Router>)
    expect(wrapper.exists('WaitingPanel')).toBeTruthy()
  })

  it('Has proper HTML structure: forbidden', () => {
    const wrapper = mount(
      <Router history={createBrowserHistory()}>
        <AuthenticatedRoute {...initialMockProps} loggedIn userRole='UNKNOWN' />
      </Router>)
    expect(wrapper.exists('Redirect')).toBeTruthy()
    expect(wrapper.find('Redirect').props().to.pathname).toEqual(routes.FORBIDDEN)
  })

  it('Has proper HTML structure: not allowed', () => {
    const wrapper = mount(
      <Router history={createBrowserHistory()}>
        <AuthenticatedRoute {...initialMockProps} loggedIn userRole='SAKSBEHANDLER' allowed={false} />
      </Router>)
    expect(wrapper.exists('Redirect')).toBeTruthy()
    expect(wrapper.find('Redirect').props().to.pathname).toEqual(routes.NOT_INVITED)
  })

  it('Has proper HTML structure: route', () => {
    const wrapper = mount(
      <Router history={createBrowserHistory()}>
        <AuthenticatedRoute {...initialMockProps} loggedIn userRole='SAKSBEHANDLER' allowed />
      </Router>)
    expect(wrapper.exists('Route')).toBeTruthy()
  })
})
