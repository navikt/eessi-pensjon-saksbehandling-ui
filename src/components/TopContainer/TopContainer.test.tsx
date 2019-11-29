import React from 'react'
import { TopContainer, TopContainerProps } from './TopContainer'
import { mount, ReactWrapper } from 'enzyme'
import { act } from 'react-dom/test-utils'

describe('components/TopContainer', () => {
  let wrapper: ReactWrapper
  const initialMockProps: TopContainerProps = {
    actions: {
      toggleHighContrast: jest.fn(),
      clientClear: jest.fn(),
      closeModal: jest.fn()
    },
    clientErrorMessage: 'mockErrorMessage',
    gettingUserInfo: false,
    footerOpen: false,
    header: 'mockHeader',
    highContrast: false,
    history: {},
    isLoggingOut: false,
    params: {},
    snow: false,
    t: jest.fn(t => t),
    username: 'mockUsername'
  }

  beforeEach(() => {
    wrapper = mount(
      <TopContainer {...initialMockProps}>
        <div id='TEST_CHILD' />
      </TopContainer>
    )
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('Header')).toBeTruthy()
    expect(wrapper.exists('Banner')).toBeTruthy()
    expect(wrapper.exists('Alert')).toBeTruthy()
    expect(wrapper.exists('Modal')).toBeTruthy()
    expect(wrapper.exists('SessionMonitor')).toBeTruthy()
    expect(wrapper.exists('Footer')).toBeTruthy()
  })

  it('Compute the client error message', () => {
    initialMockProps.actions.clientClear.mockReset()
    wrapper.setProps({
      clientErrorMessage: 'mockMessage|mockParams'
    })
    const clientAlert = wrapper.find('Alert[type="client"]')
    expect(clientAlert.render().text()).toEqual('mockMessage: mockParams')

    clientAlert.find('Icons').simulate('click')
    expect(initialMockProps.actions.clientClear).toHaveBeenCalled()
  })

  it('Toggles high contrast', () => {
    (initialMockProps.actions.toggleHighContrast as jest.Mock).mockReset()
    wrapper.find('Banner #c-banner__highcontrast-link-id').hostNodes().simulate('click')
    expect(initialMockProps.actions.toggleHighContrast).toHaveBeenCalledWith()
  })

  it('Opens and closes modal', () => {
    const mockModal = {
      modalTitle: 'mockTitle',
      modalText: 'mockText',
      modalButtons: [{
        text: 'ok'
      }]
    }
    act(() => {
      wrapper.setProps({
        modal: mockModal
      })
    })
    act(() => {
      wrapper.update()
    })
    const modal = wrapper.find('.c-topContainer > Modal')
    expect(modal.props().modal).toEqual(expect.objectContaining(mockModal))

    modal.find('button').hostNodes().last().simulate('click')
    expect(initialMockProps.actions.closeModal).toHaveBeenCalled()
  })
})
