import React from 'react'
import Banner from './Banner'

describe('components/Banner', () => {

  let initialMockProps = {
    header: 'BANNER',
    t: jest.fn((translationString) => { return translationString }),
    toggleHighContrast: jest.fn()
  }

  it('Renders', () => {
    let wrapper = mount(<Banner {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    let wrapper = mount(<Banner {...initialMockProps} />)
    expect(wrapper.exists('.c-banner')).toBeTruthy()
    expect(wrapper.find('.c-banner__title').hostNodes().render().text()).toEqual('BANNER')
    expect(wrapper.exists('#c-banner__highcontrast-link-id')).toBeTruthy()
  })

  it('Handles highContrast request', () => {
    let wrapper = mount(<Banner {...initialMockProps} />)
    wrapper.find('#c-banner__highcontrast-link-id').hostNodes().simulate('click')
    expect(initialMockProps.toggleHighContrast).toBeCalled()
  })
})
