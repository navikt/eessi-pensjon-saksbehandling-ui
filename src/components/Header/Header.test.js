import React from 'react'
import Header from './Header'
import * as routes from 'constants/routes'

describe('components/Header', () => {
  const initialMockProps = {
    t: jest.fn((translationString) => { return translationString }),
    username: 'testUser',
    actions: {
      clearData: jest.fn()
    },
    history: {
      push: jest.fn()
    }
  }

  it('Renders', () => {
    const wrapper = mount(<Header {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Clicking logo is handled', () => {
    const wrapper = mount(<Header {...initialMockProps} />)
    wrapper.find('#c-topHeader__logo-link').hostNodes().simulate('click')
    expect(initialMockProps.actions.clearData).toHaveBeenCalled()
    expect(initialMockProps.history.push).toHaveBeenCalledWith({
      pathname: routes.INDEX,
      search: window.location.search
    })
  })
})
