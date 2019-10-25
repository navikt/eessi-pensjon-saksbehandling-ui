import React from 'react'
import BucWebSocket from './WebSocket'
import _ from 'lodash'
import { Server } from 'mock-socket'
jest.mock('constants/urls', () => {
  return {
    WEBSOCKET_LOCALHOST_URL: 'ws://localhost:8888'
  }
})
describe('applications/BUC/websocket/WebSocket', () => {
  const initialMockProps = {
    actions: {
      fetchSingleBuc: jest.fn()
    },
    aktoerId: '123',
    avdodfnr: '456'
  }
  const mockServer = new Server('ws://localhost:8888')
  let mockSocket
  mockServer.on('connection', socket => {
    socket.on('message', data => {
      if (data.subscriptions) {
        socket.send(JSON.stringify({ subscriptions: true }))
      }
    })
    mockSocket = socket
  })
  let wrapper

  beforeAll(() => {
    wrapper = mount(<BucWebSocket {...initialMockProps} />)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-websocket')).toBeTruthy()
    expect(wrapper.exists('HjelpetekstAuto')).toBeTruthy()
  })

  it('Starts by trying to connect', () => {
    wrapper.find('HjelpetekstAuto button').simulate('click')
    const logs = wrapper.find('HjelpetekstAuto span.log').hostNodes().render().html()
    expect(_(logs).endsWith('Connecting to ws://localhost:8888...')).toBeTruthy()
  })

  it('Connects in a while', async (done) => {
    await act(async () => {
      await new Promise(resolve => {
        setTimeout(() => {
          wrapper.update()
          const logs = wrapper.find('HjelpetekstAuto span.log')
          expect(logs.length).toBe(3)
          expect(_(logs.at(0).render().html()).endsWith('Connecting to ws://localhost:8888...')).toBeTruthy()
          expect(_(logs.at(1).render().html()).endsWith('Connected')).toBeTruthy()
          expect(_(logs.at(2).render().html()).endsWith('Request subscribing to aktoerId 123 and avdodfnr 456')).toBeTruthy()
          done()
        }, 200)
      })
    })
  })

  it('Replies to messages', async (done) => {
    await new Promise(resolve => {
      setTimeout(() => {
        mockSocket.send(JSON.stringify({ bucUpdated: { caseId: '123' } }))
        setTimeout(() => {
          wrapper.update()
          const logs = wrapper.find('HjelpetekstAuto span.log')
          expect(logs.length).toBe(4)
          expect(_(logs.at(3).render().html()).endsWith('Updating buc 123')).toBeTruthy()
          expect(initialMockProps.actions.fetchSingleBuc).toHaveBeenCalledWith('123')
          done()
        }, 300)
      }, 300)
    })
  })

  it('error connection', async (done) => {
    expect(wrapper.find('.a-buc-websocket').props().title).toEqual('websocket: CONNECTED')
    act(() => {
      mockServer.simulate('error')
    })
    await new Promise(resolve => {
      setTimeout(() => {
        wrapper.update()
        expect(wrapper.find('.a-buc-websocket').props().title).toEqual('websocket: ERROR')
        done()
      }, 500)
    })
  })

  it('close connection', async (done) => {
    expect(wrapper.find('.a-buc-websocket').props().title).toEqual('websocket: ERROR')
    act(() => {
      mockSocket.close()
    })
    await new Promise(resolve => {
      setTimeout(() => {
        wrapper.update()
        expect(wrapper.find('.a-buc-websocket').props().title).toEqual('websocket: NOTCONNECTED')
        done()
      }, 500)
    })
  })
})
