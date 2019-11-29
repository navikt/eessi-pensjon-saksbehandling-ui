import * as routes from 'constants/routes'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import Header, { HeaderProps } from './Header'

describe('components/Header', () => {
  let wrapper: ReactWrapper
  const initialMockProps: HeaderProps = {
    t: jest.fn(t => t),
    username: 'testUser',
    actions: {
      clearData: jest.fn(),
      logout: jest.fn()
    },
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
    (initialMockProps.actions.clearData as jest.Mock).mockReset()
    wrapper.find('#c-topHeader__logo-link').hostNodes().simulate('click')
    expect(initialMockProps.actions.clearData).toHaveBeenCalled()
    expect(initialMockProps.history.push).toHaveBeenCalledWith({
      pathname: routes.ROOT,
      search: window.location.search
    })
  })

  it('Clicking logout', () => {
    (initialMockProps.actions.clearData as jest.Mock).mockReset();
    (initialMockProps.actions.logout as jest.Mock).mockReset()
    const select = wrapper.find('select#username-select-id')
    select.simulate('change', { target: { value: 'logout' } })
    expect(initialMockProps.actions.clearData).toHaveBeenCalled()
    expect(initialMockProps.actions.logout).toHaveBeenCalled()
  })
})
