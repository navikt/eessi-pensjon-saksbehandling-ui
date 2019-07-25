import React from 'react'
import BUCNew from './BUCNew'

describe('applications/BUC/widgets/BUCNew/BUCNew', () => {
  let wrapper
  const t = jest.fn((translationString) => { return translationString })
  const initialMockProps = {
    t: t
  }

  it('Renders', () => {
    wrapper = mount(<BUCNew {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    wrapper = mount(<BUCNew {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-bucnew')).toBeTruthy()
    expect(wrapper.exists('BUCStart')).toBeTruthy()
    expect(wrapper.find('BUCStart').hostNodes().props().mode).toEqual('widget')
  })
})
