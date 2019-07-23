import React from 'react'
import BUCNew from './BUCNew'

describe('applications/BUC/widgets/BUCNew/BUCNew', () => {
  let wrapper
  const t = jest.fn((translationString) => { return translationString })
  const initialMockProps = {
    t: t
  }

  it('renders successfully', () => {
    wrapper = mount(<BUCNew {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders', () => {
    wrapper = mount(<BUCNew {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-bucnew')).toEqual(true)
    expect(wrapper.exists('BUCStart')).toEqual(true)
    expect(wrapper.find('BUCStart').hostNodes().props().mode).toEqual('widget')
  })
})
