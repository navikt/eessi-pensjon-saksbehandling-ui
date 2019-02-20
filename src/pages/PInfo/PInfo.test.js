import React from 'react'
import ReactDOM from 'react-dom'

import PInfo from './PInfo'

describe('PInfo', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<PInfo/>)
    expect(wrapper).toMatchSnapshot()
  })
})
