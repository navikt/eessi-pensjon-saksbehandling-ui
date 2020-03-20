import { clearData, logout } from 'actions/app'
import { toggleHighContrast, toggleSnow } from 'actions/ui'
import * as routes from 'constants/routes'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import Header, { HeaderProps } from './Header'

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

  it('Clicking highConstrast handled', () => {
    wrapper.find('a.c-topHeader__highcontrast-link').simulate('click')
    expect(toggleHighContrast).toHaveBeenCalled()
  })

  it('Clicking snow handled', () => {
    wrapper.find('a.c-topHeader__snow-link').simulate('click')
    expect(toggleSnow).toHaveBeenCalled()
  })
})
