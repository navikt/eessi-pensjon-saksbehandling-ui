import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import Banner, { BannerProps } from './Banner'

describe('components/Banner', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BannerProps = {
    header: <h1>BANNER</h1>,
    labelHighContrast: 'mockLabel',
    onHighContrastClicked: jest.fn()
  }

  it('Renders', () => {
    wrapper = mount(<Banner {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    wrapper = mount(<Banner {...initialMockProps} />)
    expect(wrapper.exists('.c-banner')).toBeTruthy()
    expect(wrapper.find('.c-banner__title').hostNodes().render().text()).toEqual('BANNER')
    expect(wrapper.exists('#c-banner__highcontrast-link-id')).toBeTruthy()
  })

  it('Handles highContrast request', () => {
    wrapper = mount(<Banner {...initialMockProps} />)
    wrapper.find('#c-banner__highcontrast-link-id').hostNodes().simulate('click')
    expect(initialMockProps.onHighContrastClicked).toBeCalled()
  })
})
