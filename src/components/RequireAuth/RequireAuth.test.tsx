import { getUserInfo, login, setStatusParam } from 'actions/app'
import * as routes from 'constants/routes'
import { render } from '@testing-library/react'
import { Routes } from 'react-router-dom'
import { stageSelector } from 'setupTests'
import RequireAuth, { RequireAuthSelector } from './RequireAuth'

jest.mock('actions/app', () => ({
  getUserInfo: jest.fn(),
  login: jest.fn(),
  setStatusParam: jest.fn()
}))

const defaultSelector: RequireAuthSelector = {
  userRole: undefined,
  loggedIn: undefined,
  gettingUserInfo: false,
  isLoggingIn: false
}

describe('components/RequireAuth/RequireAuth', () => {
  const initialMockProps = {}
  let wrapper: any

  beforeEach(() => {
    stageSelector(defaultSelector, {})
  })

  afterEach(() => {

  })

  it('UseEffect: read status params', () => {
    render(
      <Routes>
        <RequireAuth {...initialMockProps} />
      </Routes>)
    expect(setStatusParam).toBeCalledWith('a', 'b')
    expect(setStatusParam).toBeCalledWith('sakId', '123')
    expect(setStatusParam).toBeCalledWith('aktoerId', '456')
  })

  it('UseEffect: ask for userInfo', () => {
    wrapper = render(
      <Routes>
        <RequireAuth {...initialMockProps} />
      </Routes>)
    expect(getUserInfo).toBeCalled()
  })

  it('UseEffect: redirect for login', () => {
    stageSelector(defaultSelector, { loggedIn: false })
    wrapper = render(<RequireAuth {...initialMockProps} />)
    expect(login).toBeCalled();
    (login as jest.Mock).mockRestore()
  })

  it('UseEffect: no need for login redirect', () => {
    stageSelector(defaultSelector, { loggedIn: true })
    wrapper = render(
      <Routes>
        <RequireAuth {...initialMockProps} />
      </Routes>)
    expect(login).not.toBeCalled()
  })

  it('Render: Has proper HTML structure: forbidden', () => {
    stageSelector(defaultSelector, {
      loggedIn: true,
      userRole: 'UNKNOWN'
    })
    wrapper = render(
      <Routes>
        <RequireAuth {...initialMockProps} />
      </Routes>)
    expect(wrapper.exists('Redirect')).toBeTruthy()
    expect((wrapper.find('Redirect').props().to as any)!.pathname).toEqual(routes.FORBIDDEN)
  })

  it('Render: Has proper HTML structure: route', () => {
    stageSelector(defaultSelector, {
      loggedIn: true,
      userRole: 'SAKSBEHANDLER'
    })
    wrapper = render(
      <Routes>
        <RequireAuth {...initialMockProps} />
      </Routes>)
    expect(wrapper.exists('Route')).toBeTruthy()
  })
})
