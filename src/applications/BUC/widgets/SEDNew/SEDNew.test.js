import React from 'react'
import SEDNew from './SEDNew'

describe('applications/BUC/widgets/SEDNew/SEDNew', () => {
  let wrapper

  it('renders successfully', () => {
    wrapper = mount(<SEDNew />)
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders', () => {
    wrapper = mount(<SEDNew />)
    expect(wrapper.exists('.a-buc-sednew')).toEqual(true)
    expect(wrapper.exists('SEDStart')).toEqual(true)
  })
})
