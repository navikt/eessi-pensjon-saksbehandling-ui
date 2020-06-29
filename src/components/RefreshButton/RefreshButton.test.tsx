import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import RefreshButton, { RefreshButtonProps } from './RefreshButton'

describe('components/RefreshButton', () => {
  let wrapper: ReactWrapper
  const initialMockProps: RefreshButtonProps = {
    onRefreshClicked: jest.fn(),
    rotating: false,
    labelRefresh: 'mockLabelRefresh'
  }

  it('Renders', () => {
    wrapper = mount(<RefreshButton {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    wrapper = mount(<RefreshButton {...initialMockProps} />)
    expect(wrapper.exists('.c-refreshbutton')).toBeTruthy()
    expect(wrapper.find('.c-refreshbutton .lenke').props().title).toEqual(initialMockProps.labelRefresh)
    wrapper.find('.c-refreshbutton .lenke').hostNodes().simulate('click')
    expect(initialMockProps.onRefreshClicked).toHaveBeenCalled()
  })
})
