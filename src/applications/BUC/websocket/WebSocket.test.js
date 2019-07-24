import React from 'react'
import BucWebSocket from './WebSocket'
import { WEBSOCKET_URL } from 'constants/urls'

describe('applications/BUC/widgets/BucWebSocket', () => {
  let wrapper

  const initialMockProps = {
    onUpdate: jest.fn(),
    url: WEBSOCKET_URL
  }

  beforeEach(() => {
    wrapper = mount(<BucWebSocket {...initialMockProps} />)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-websocket')).toBeTruthy()
    expect(wrapper.exists('.a-buc-websocket__status')).toBeTruthy()
    expect(wrapper.exists('.a-buc-websocket__number')).toBeTruthy()
    expect(wrapper.exists('#a-buc-websocket__button-id')).toBeTruthy()
  })
})
