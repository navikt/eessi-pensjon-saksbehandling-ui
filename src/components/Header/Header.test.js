import React from 'react'
import Header from './Header'
import * as routes from 'constants/routes'

describe('components/Header', () => {
  let wrapper
  const initialMockProps = {
    t: jest.fn((translationString) => { return translationString }),
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
    wrapper.find('#c-topHeader__logo-link').hostNodes().simulate('click')
    expect(initialMockProps.actions.clearData).toHaveBeenCalled()
    expect(initialMockProps.history.push).toHaveBeenCalledWith({
      pathname: routes.ROOT,
      search: window.location.search
    })
    initialMockProps.actions.clearData.mockReset()
  })

  it('Clicking logout', () => {
    const select = wrapper.find('select#username-select-id')
    select.simulate('change', { target: { value: 'logout' } })
    expect(initialMockProps.actions.clearData).toHaveBeenCalled()
    expect(initialMockProps.actions.logout).toHaveBeenCalled()
  })
})
