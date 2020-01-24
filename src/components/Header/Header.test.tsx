import { clearData, logout } from 'actions/app'
import * as routes from 'constants/routes'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { useDispatch } from 'react-redux'
import Header, { HeaderProps } from './Header'
jest.mock('react-redux');
(useDispatch as jest.Mock).mockImplementation(() => jest.fn())

jest.mock('actions/app', () => ({
  clearData: jest.fn(),
  logout: jest.fn()
}))
jest.mock('actions/ui', () => ({
  toggleHighContrast: jest.fn(),
  toggleSnow: jest.fn()
}))

describe('components/Header', () => {
  let wrapper: ReactWrapper
  const initialMockProps: HeaderProps = {
    t: jest.fn(t => t),
    username: 'testUser',
    history: {
      push: jest.fn()
    }
  }

  beforeEach(() => {
    wrapper = mount(<Header {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Clicking logo is handled', () => {
    (clearData as jest.Mock).mockReset()
    wrapper.find('#c-topHeader__logo-link').hostNodes().simulate('click')
    expect(clearData).toHaveBeenCalled()
    expect(initialMockProps.history.push).toHaveBeenCalledWith({
      pathname: routes.ROOT,
      search: window.location.search
    })
  })

  it('Clicking logout', () => {
    (clearData as jest.Mock).mockReset();
    (logout as jest.Mock).mockReset()
    const select = wrapper.find('select#username-select-id')
    select.simulate('change', { target: { value: 'logout' } })
    expect(clearData).toHaveBeenCalled()
    expect(logout).toHaveBeenCalled()
  })
})
