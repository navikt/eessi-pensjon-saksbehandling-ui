import { getUserInfo, login, setStatusParam } from 'actions/app'
import * as routes from 'constants/routes'
import { mount, ReactWrapper } from 'enzyme'
import { createBrowserHistory, Location } from 'history'
import React from 'react'
import { RouteProps, Router } from 'react-router-dom'
import { stageSelector } from 'setupTests'
import { AuthenticatedRoute, AuthenticatedRouteSelector } from './AuthenticatedRoute'

jest.mock('actions/app', () => ({
  getUserInfo: jest.fn(),
  login: jest.fn(),
  setStatusParam: jest.fn()
}))


const defaultSelector: AuthenticatedRouteSelector = {
  userRole: undefined,
  loggedIn: undefined,
  allowed: undefined
}

describe('components/AuthenticatedRoute', () => {
  let wrapper: ReactWrapper
  const initialMockProps: RouteProps = {
    location: {
      search: '?a=b&sakId=123&aktoerId=456'
    } as Location
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('UseEffect: read status params', () => {
    wrapper = mount(
      <Router history={createBrowserHistory()}>
        <AuthenticatedRoute {...initialMockProps} />
      </Router>)
    expect(setStatusParam).toBeCalledWith('a', 'b')
    expect(setStatusParam).toBeCalledWith('sakId', '123')
    expect(setStatusParam).toBeCalledWith('aktoerId', '456')
  })

  it('UseEffect: ask for userInfo', () => {
    wrapper = mount(
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
    stageSelector(defaultSelector, { loggedIn: false })
    wrapper = mount(<AuthenticatedRoute {...initialMockProps} />)
    expect(login).toBeCalled();
    (login as jest.Mock).mockRestore()
  })

  it('UseEffect: no need for login redirect', () => {
    stageSelector(defaultSelector, { loggedIn: true })
    wrapper = mount(
      <Router history={createBrowserHistory()}>
        <AuthenticatedRoute {...initialMockProps} />
      </Router>)
    expect(login).not.toBeCalled()
  })

  it('Has proper HTML structure: forbidden', () => {
    stageSelector(defaultSelector, {
      loggedIn: true,
      userRole: 'UNKNOWN'
    })
    wrapper = mount(
      <Router history={createBrowserHistory()}>
        <AuthenticatedRoute {...initialMockProps} />
      </Router>)
    expect(wrapper.exists('Redirect')).toBeTruthy()
    expect((wrapper.find('Redirect').props().to as any)!.pathname).toEqual(routes.FORBIDDEN)
  })

  it('Has proper HTML structure: not allowed', () => {
    stageSelector(defaultSelector, {
      loggedIn: true,
      userRole: 'SAKSBEHANDLER',
      allowed: false
    })
    wrapper = mount(
      <Router history={createBrowserHistory()}>
        <AuthenticatedRoute {...initialMockProps} />
      </Router>)
    expect(wrapper.exists('Redirect')).toBeTruthy()
    expect((wrapper.find('Redirect').props().to as any)!.pathname).toEqual(routes.NOT_INVITED)
  })

  it('Has proper HTML structure: route', () => {
    stageSelector(defaultSelector, {
      loggedIn: true,
      userRole: 'SAKSBEHANDLER',
      allowed: true
    })
    wrapper = mount(
      <Router history={createBrowserHistory()}>
        <AuthenticatedRoute {...initialMockProps} />
      </Router>)
    expect(wrapper.exists('Route')).toBeTruthy()
  })
})
