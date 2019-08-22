import React from 'react'

import { TopContainer } from './TopContainer'

describe('components/TopContainer', () => {
  let wrapper
  const initialMockProps = {
    actions: {
      toggleHighContrast: jest.fn()
    },
    highContrast: false,
    history: {},
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(() => {
    wrapper = shallow(
      <TopContainer {...initialMockProps}>
        <div id='TEST_CHILD' />
      </TopContainer>
    )
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('#TEST_CHILD')).toBeTruthy()
    expect(wrapper.exists({ header: 'TEST_HEADER' })).toBeFalsy()

    wrapper.setProps({ header: 'TEST_HEADER' })
    expect(wrapper.exists({ header: 'TEST_HEADER' })).toBeTruthy()
  })
})
