import { getUserInfo, setStatusParam } from 'src/actions/app'
import { render } from '@testing-library/react'
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom'
import { stageSelector } from 'src/setupTests'
import RequireAuth, { RequireAuthSelector } from './RequireAuth'
import mockFeatureToggles from "src/mocks/app/featureToggles";

jest.mock('src/actions/app', () => ({
  getUserInfo: jest.fn(),
  setStatusParam: jest.fn(),
  getCountryCodeLists: jest.fn
}))

const defaultSelector: RequireAuthSelector = {
  loggedIn: undefined,
  userRole: undefined,
  countryCodes: undefined,
  gettingUserInfo: false,
  isLoggingIn: false,
  gettingCountryCodes: false,
  featureToggles: mockFeatureToggles
}

describe('src/components/RequireAuth/RequireAuth', () => {
  const initialMockProps = {}
  beforeEach(() => {
    stageSelector(defaultSelector, {})
  })

  afterEach(() => {

  })

  it('UseEffect: read status params', () => {
    render(
      <MemoryRouter initialEntries={['/?a=b&sakId=123&aktoerId=456']}>
        <Routes>
          <Route path="/" element={
            <RequireAuth {...initialMockProps} />
          }/>
        </Routes>
      </MemoryRouter>
    )

    expect(setStatusParam).toHaveBeenCalledWith('a', 'b')
    expect(setStatusParam).toHaveBeenCalledWith('sakId', '123')
    expect(setStatusParam).toHaveBeenCalledWith('aktoerId', '456')
  })

  it('UseEffect: ask for userInfo', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <RequireAuth {...initialMockProps} />
          }/>
        </Routes>
      </BrowserRouter>
    )
    expect(getUserInfo).toHaveBeenCalledWith()
  })

/*  it('Render: Has proper HTML structure: forbidden', () => {
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
  })*/
})
