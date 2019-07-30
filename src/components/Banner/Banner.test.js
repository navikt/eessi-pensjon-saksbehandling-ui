import React from 'react'
import Banner from './Banner'

describe('components/Banner', () => {
  const initialMockProps = {
    header: 'BANNER',
    t: jest.fn((translationString) => { return translationString }),
    toggleHighContrast: jest.fn()
  }

  it('Renders', () => {
    const wrapper = mount(<Banner {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    const wrapper = mount(<Banner {...initialMockProps} />)
    expect(wrapper.exists('.c-banner')).toBeTruthy()
    expect(wrapper.find('.c-banner__title').hostNodes().render().text()).toEqual('BANNER')
    expect(wrapper.exists('#c-banner__highcontrast-link-id')).toBeTruthy()
  })

  it('Handles highContrast request', () => {
    const wrapper = mount(<Banner {...initialMockProps} />)
    wrapper.find('#c-banner__highcontrast-link-id').hostNodes().simulate('click')
    expect(initialMockProps.toggleHighContrast).toBeCalled()
  })
})
