import React from 'react'
import { InternalTopHeader } from './InternalTopHeader'
import * as routes from 'constants/routes'

describe('components/InternalTopHeader', () => {
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
    let wrapper = mount(<InternalTopHeader {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Clicking logo is handled', () => {
    let wrapper = mount(<InternalTopHeader {...initialMockProps} />)
    wrapper.find('#c-topHeader__logo-link').hostNodes().simulate('click')
    expect(initialMockProps.actions.clearData).toHaveBeenCalled()
    expect(initialMockProps.history.push).toHaveBeenCalledWith({
      pathname: routes.INDEX,
      search: window.location.search
    })
  })
})
