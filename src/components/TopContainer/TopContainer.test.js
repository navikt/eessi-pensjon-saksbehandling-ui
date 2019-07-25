import React from 'react'

import { TopContainer } from './TopContainer'

describe('renders', () => {
  it('renders without crashing', () => {
    let wrapper = shallow(
      <TopContainer history={{}}>
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
