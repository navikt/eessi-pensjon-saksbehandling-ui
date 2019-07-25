import React from 'react'

import { TopContainer } from './TopContainer'

describe('components/TopContainer', () => {

  const initialMockProps = {
    actions: {
      toggleHighConstrast: jest.fn()
    },
    highContrast: false
    history: {},
    t: jest.fn((translationString) => { return translationString })
  }

  it('Renders', () => {
    let wrapper = shallow(<TopContainer {...initialMockProps}>
      <div/>
    </TopContainer>)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    let wrapper = shallow(
      <TopContainer {...initialMockProps}>
        <div id='TEST_CHILD' />
      </TopContainer>
    )
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.exists('#TEST_CHILD')).toBeTruthy()
    expect(wrapper.exists({ header: 'TEST_HEADER' })).toBeFalsy()

    wrapper.setProps({ header: 'TEST_HEADER' })
    expect(wrapper.exists({ header: 'TEST_HEADER' })).toBeTruthy()
  })
})
