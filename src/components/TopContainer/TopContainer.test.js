import React from 'react'

import { TopContainer } from './TopContainer'

describe('components/TopContainer', () => {
  let wrapper
  const initialMockProps = {
    actions: {
      toggleHighContrast: jest.fn()
    },
    clientErrorMessage: 'mockErrorMessage',
    header: 'mockHeader',
    highContrast: false,
    history: {},
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(() => {
    wrapper = shallow(
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
    wrapper.setProps({
      clientErrorMessage: 'mockMessage|mockParams'
    })
    expect(wrapper.find('Alert[type="client"]').render().text()).toEqual('mockMessage: mockParams')
  })

  it('Opens modal', () => {
    const mockModal = {
      modalTitle: 'mockTitle',
      modalText: 'mockText'
    }
    wrapper.setProps({
      modal: mockModal
    })
    expect(wrapper.find('Modal').props().modal).toEqual(expect.objectContaining(mockModal))
  })
})
