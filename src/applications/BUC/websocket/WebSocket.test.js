import React, { Suspense } from 'react'
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

  it('renders successfully', () => {
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders BucWebSocket', () => {
    expect(wrapper.exists('.a-buc-websocket')).toEqual(true)
    expect(wrapper.exists('.a-buc-websocket__status')).toEqual(true)
    expect(wrapper.exists('.a-buc-websocket__number')).toEqual(true)
    expect(wrapper.exists('#a-buc-websocket__button-id')).toEqual(true)
  })
})
