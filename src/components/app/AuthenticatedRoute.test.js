import React from 'react'
import { AuthenticatedRoute } from './AuthenticatedRoute'
import * as constants from '../../constants/constants'
import { MemoryRouter } from 'react-router'

describe('components/app/AuthenticatedRoute', () => {

  let initialMockProps = {
    path: '/_/mock',
    exact: true,
    loggedIn: true,
    location : {
      search: ''
    },
    t: jest.fn((translationString) => { return translationString}),
    actions: {
       setStatusParam: jest.fn(),
       login: jest.fn(),
       getUserInfo: jest.fn()
    },
    roles: [constants.SAKSBEHANDLER]
  }

  beforeEach(() => {
    initialMockProps.actions.setStatusParam.mockClear()
    initialMockProps.actions.login.mockClear()
    initialMockProps.actions.getUserInfo.mockClear()
  })

  it('AuthenticationRoute renders without crashing', async () => {
    const wrapper = shallow(<AuthenticatedRoute {...initialMockProps}/>)
    expect(wrapper).toMatchSnapshot()
  })

  it('When AuthenticatedRoute mounts without login triggers a login call', () => {
    const mockProps  = Object.assign({}, initialMockProps)
    mockProps.loggedIn = undefined
    const wrapper = shallow(<AuthenticatedRoute {...mockProps}/>)
    expect(wrapper.instance().props.actions.login.mock.calls.length).toBe(0)
    expect(wrapper.instance().props.actions.getUserInfo.mock.calls.length).toBe(1)
    wrapper.setProps({ loggedIn: false })
    expect(wrapper.instance().props.actions.login.mock.calls.length).toBe(1)

  })

  it('When AuthenticatedRoute mounts with login it does not trigger a login call', () => {
    const wrapper = shallow(<AuthenticatedRoute {...initialMockProps}/>)
    expect(wrapper.instance().props.actions.login.mock.calls.length).toBe(0)
  })

  it('When AuthenticatedRoute mounts with login it parses GET params', async () => {
    const mockProps  = Object.assign({}, initialMockProps)
    mockProps.location.search = '?a=b&sakId=123&fnr=456'
    const wrapper = shallow(<AuthenticatedRoute {...mockProps}/>)
    expect(wrapper.instance().props.actions.setStatusParam.mock.calls.length).toBe(3)
    expect(wrapper.instance().state).toEqual({
      a : 'b',
      sakId: '123',
      aktoerId: '456'
    })
  })

  it('AuthenticatedRoute hasApprovedRole as SAKSBEHANDLER user and SAKSBEHANDLER route', () => {
    const mockProps  = Object.assign({}, initialMockProps, {
      userRole: 'SAKSBEHANDLER'
    })
    const wrapper = shallow(<AuthenticatedRoute {...mockProps}  />)
    expect(wrapper.instance().hasApprovedRole()).toBe(true)
  })

  it('AuthenticatedRoute hasApprovedRole as BRUKER user and SAKSBEHANDLER route', () => {
    const mockProps  = Object.assign({}, initialMockProps, {
      userRole: 'BRUKER'
    })
    const wrapper = shallow(<AuthenticatedRoute {...mockProps}  />)
    expect(wrapper.instance().hasApprovedRole()).toBe(false)
  })

  it('AuthenticatedRoute with not approved role redirects to Forbidden page', () => {
    const mockProps  = Object.assign({}, initialMockProps, {
      userRole: 'BRUKER'
    })
    const wrapper = mount(<MemoryRouter>
      <AuthenticatedRoute {...mockProps}/>
    </MemoryRouter>)

    expect(wrapper.instance().history.length).toBe(1)
    expect(wrapper.instance().history.action).toBe('REPLACE')
    expect(wrapper.instance().history.location.pathname).toBe('/_/forbidden')
    expect(wrapper.instance().history.location.state.role).toBe('BRUKER')
  })

  it('AuthenticatedRoute with approved, unauthorized role redirects to NotInvited page', () => {
    const mockProps  = Object.assign({}, initialMockProps, {
      userRole: 'SAKSBEHANDLER'
    })
    const wrapper = mount(<MemoryRouter>
      <AuthenticatedRoute {...mockProps}/>
    </MemoryRouter>)

    expect(wrapper.instance().history.length).toBe(1)
    expect(wrapper.instance().history.action).toBe('REPLACE')
    expect(wrapper.instance().history.location.pathname).toBe('/_/notinvited')
    expect(wrapper.instance().history.location.state.role).toBe('SAKSBEHANDLER')
  })

  it('AuthenticatedRoute with approved, authorized role redirects to a Route page', () => {
    const mockProps  = Object.assign({}, initialMockProps, {
      userRole: 'SAKSBEHANDLER',
      allowed: true
    })
    const wrapper = mount(<MemoryRouter>
      <AuthenticatedRoute {...mockProps}/>
    </MemoryRouter>)

    expect(wrapper.instance().history.length).toBe(1)
    expect(wrapper.instance().history.action).toBe('POP')
    expect(wrapper.instance().history.location.pathname).toBe('/')
  })
})
