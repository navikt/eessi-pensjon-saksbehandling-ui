import React from 'react'
import SEDHeader from './SEDHeader'

// Not much to test in this component really.
describe('Renders without crashing', () => {
  it('Is non-empty and matches snapshot', () => {
    let wrapper = shallow(<SEDHeader />)

    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })
})
