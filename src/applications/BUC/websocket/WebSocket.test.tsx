import { fetchSingleBuc } from 'actions/buc'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import { Server, WebSocket } from 'mock-socket'
import Popover from 'nav-frontend-popover'
import React from 'react'
import { act } from 'react-dom/test-utils'
import BucWebSocket, { BUCWebsocketDiv, BucWebSocketProps } from './WebSocket'

jest.mock('nav-frontend-popover', () => ({
  __esModule: true, // this property makes it work
  default: ({ children }: any) => (
    <div className='mock-popover'>{children}</div>
  ),
  PopoverOrientering: {
    Under: 'Under'
  }
}))

jest.mock('constants/urls', () => ({
  WEBSOCKET_LOCALHOST_URL: 'ws://localhost:8888'
}))
jest.mock('actions/buc', () => ({
  fetchSingleBuc: jest.fn()
}))

describe('applications/BUC/websocket/WebSocket', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BucWebSocketProps = {
    fnr: '123',
    avdodfnr: '456'
  }
  const mockServer: Server = new Server('ws://localhost:8888')
  let mockSocket: WebSocket

  mockServer.on('connection', socket => {
    socket.on('message', data => {
      socket.send(JSON.stringify({ data: data, subscriptions: true }))
    })
    mockSocket = socket
  })

  beforeAll(() => {
    wrapper = mount(<BucWebSocket {...initialMockProps} />)
  })

  afterAll(() => {
    wrapper.unmount()
  })

  it('Render: not empty', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists(BUCWebsocketDiv)).toBeTruthy()
    expect(wrapper.exists(Popover)).toBeTruthy()
  })

  it('Handling: Connects in a while', async () => {
    await act(async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          wrapper.update()
          const logs = wrapper.find('.mock-popover span.log')
          expect(logs.length).toBe(5)
          expect(_(logs.at(0).render().html()).endsWith('Got fnr 123 avdodfnr 456, starting websocket connection')).toBeTruthy()
          expect(_(logs.at(1).render().html()).endsWith('Connecting to ws://localhost:8888...')).toBeTruthy()
          expect(_(logs.at(2).render().html()).endsWith('Connected')).toBeTruthy()
          expect(_(logs.at(3).render().html()).endsWith('Request subscribing to fnr 123 and avdodfnr 456')).toBeTruthy()
          expect(_(logs.at(4).render().html()).endsWith('Subscription status is true')).toBeTruthy()
          resolve()
        }, 200)
      })
    })
  })

  it('Handling: replies to messages', async () => {
    await act(async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          mockSocket.send(JSON.stringify({ bucUpdated: { caseId: '123' } }))
          setTimeout(() => {
            wrapper.update()
            const logs = wrapper.find('.mock-popover span.log')
            expect(logs.length).toBe(6)
            expect(_(logs.at(5).render().html()).endsWith('Updating buc 123')).toBeTruthy()
            expect(fetchSingleBuc).toHaveBeenCalledWith('123')
            resolve(true)
          }, 300)
        }, 300)
      })
    })
  })

  it('Handling: error connection', async () => {
    expect(wrapper.find(BUCWebsocketDiv).props().title).toEqual('websocket: CONNECTED')
    act(() => {
      mockServer.simulate('error')
    })
    await act(async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          wrapper.update()
          expect(wrapper.find(BUCWebsocketDiv).props().title).toEqual('websocket: ERROR')
          resolve()
        }, 500)
      })
    })
  })

  it('Handling: close connection', async () => {
    expect(wrapper.find(BUCWebsocketDiv).props().title).toEqual('websocket: ERROR')
    act(() => {
      mockSocket.close()
    })
    await act(async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          wrapper.update()
          expect(wrapper.find(BUCWebsocketDiv).props().title).toEqual('websocket: NOTCONNECTED')
          resolve()
        }, 500)
      })
    })
  })
})
