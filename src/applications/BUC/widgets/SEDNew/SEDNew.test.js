import React from 'react'
import SEDNew from './SEDNew'

describe('applications/BUC/widgets/SEDNew/SEDNew', () => {
  let wrapper

  it('Renders', () => {
    wrapper = mount(<SEDNew />)
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    wrapper = mount(<SEDNew />)
    expect(wrapper.exists('.a-buc-sednew')).toBeTruthy()
    expect(wrapper.exists('SEDStart')).toBeTruthy()
  })
})
