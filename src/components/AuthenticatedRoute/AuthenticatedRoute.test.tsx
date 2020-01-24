import { getUserInfo, login, setStatusParam } from 'actions/app'
import * as routes from 'constants/routes'
import { mount, ReactWrapper } from 'enzyme'
import { createBrowserHistory, Location } from 'history'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RouteProps, Router } from 'react-router'

import { AuthenticatedRoute, AuthenticatedRouteSelector } from './AuthenticatedRoute'

jest.mock('actions/app', () => ({
  getUserInfo: jest.fn(),
  login: jest.fn(),
  setStatusParam: jest.fn()
}))

jest.mock('react-redux');
(useDispatch as jest.Mock).mockImplementation(() => jest.fn())

const defaultSelector: AuthenticatedRouteSelector = {
  userRole: undefined,
  loggedIn: undefined,
  allowed: undefined
};

(useSelector as jest.Mock).mockImplementation(() => (defaultSelector))

describe('components/AuthenticatedRoute', () => {
  let wrapper: ReactWrapper
  const initialMockProps: RouteProps = {
    location: {
      search: '?a=b&sakId=123&aktoerId=456'
    } as Location
  }

  it('UseEffect: read status params', () => {
    mount(
      <Router history={createBrowserHistory()}>
        <AuthenticatedRoute {...initialMockProps} />
      </Router>)
    expect(setStatusParam).toBeCalledWith('a', 'b')
    expect(setStatusParam).toBeCalledWith('sakId', '123')
    expect(setStatusParam).toBeCalledWith('aktoerId', '456')
  })

  it('UseEffect: ask for userInfo', () => {
    mount(
      <Router history={createBrowserHistory()}>
        <AuthenticatedRoute {...initialMockProps} />
      </Router>)
    expect(getUserInfo).toBeCalled()
  })

  it('Has proper HTML structure: not mounted', () => {
    wrapper = mount(
      <Router history={createBrowserHistory()}>
        <AuthenticatedRoute {...initialMockProps} />
      </Router>)
    expect(wrapper.exists('WaitingPanel')).toBeTruthy()
  })

  it('UseEffect: redirect for login', () => {
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      loggedIn: false
    }))
    mount(<AuthenticatedRoute {...initialMockProps} />)
    expect(login).toBeCalled();
    (login as jest.Mock).mockRestore()
  })

  it('UseEffect: no need for login redirect', () => {
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      loggedIn: true
    }))
    mount(
      <Router history={createBrowserHistory()}>
        <AuthenticatedRoute {...initialMockProps} />
      </Router>)
    expect(login).not.toBeCalled()
  })

  it('Has proper HTML structure: forbidden', () => {
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      loggedIn: true,
      userRole: 'UNKNOWN'
    }))
    wrapper = mount(
      <Router history={createBrowserHistory()}>
        <AuthenticatedRoute {...initialMockProps} />
      </Router>)
    expect(wrapper.exists('Redirect')).toBeTruthy()
    expect((wrapper.find('Redirect').props().to as any)!.pathname).toEqual(routes.FORBIDDEN)
  })

  it('Has proper HTML structure: not allowed', () => {
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      loggedIn: true,
      userRole: 'SAKSBEHANDLER',
      allowed: false
    }))
    wrapper = mount(
      <Router history={createBrowserHistory()}>
        <AuthenticatedRoute {...initialMockProps} />
      </Router>)
    expect(wrapper.exists('Redirect')).toBeTruthy()
    expect((wrapper.find('Redirect').props().to as any)!.pathname).toEqual(routes.NOT_INVITED)
  })

  it('Has proper HTML structure: route', () => {
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      loggedIn: true,
      userRole: 'SAKSBEHANDLER',
      allowed: true
    }))
    wrapper = mount(
      <Router history={createBrowserHistory()}>
        <AuthenticatedRoute {...initialMockProps} />
      </Router>)
    expect(wrapper.exists('Route')).toBeTruthy()
  })
})
