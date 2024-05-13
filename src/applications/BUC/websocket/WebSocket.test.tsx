import { fetchBuc } from 'src/actions/buc'
import { render, screen } from '@testing-library/react'
import { Server, WebSocket } from 'mock-socket'
import { act } from 'react-dom/test-utils'
import BucWebSocket, { BucWebSocketProps } from './WebSocket'

jest.mock('constants/urls', () => ({
  WEBSOCKET_LOCALHOST_URL: 'ws://localhost:8888'
}))
jest.mock('actions/buc', () => ({
  fetchBuc: jest.fn()
}))

jest.mock('components/Tooltip/Tooltip', () => ({ children }: any) => (
  <div data-testid='mock-tooltip'>{children}</div>
))

describe('applications/BUC/websocket/WebSocket', () => {
  const initialMockProps: BucWebSocketProps = {
    fnr: '123',
    avdodFnr: '456'
  }
  const mockServer: Server = new Server('ws://localhost:8888')
  let mockSocket: WebSocket

  mockServer.on('connection', socket => {
    socket.on('message', data => {
      socket.send(JSON.stringify({ data, subscriptions: true }))
    })
    // @ts-ignore
    mockSocket = socket
  })

  it('Render: match snapshot', () => {
    const { container } = render(<BucWebSocket {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    render(<BucWebSocket {...initialMockProps} />)
    expect(screen.getByTestId('a_buc_websocket')).toBeInTheDocument()
  })

  it('Handling: Connects in a while', async () => {
    const { container } = render(<BucWebSocket {...initialMockProps} />)
    await act(async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const logs = container.querySelectorAll('div.logs span.log')
          expect(logs?.length).toBe(5)
          expect(logs[0]).toHaveTextContent('Got fnr 123 avdodFnr 456, starting websocket connection')
          expect(logs[1]).toHaveTextContent('Connecting to ws://localhost:8888...')
          expect(logs[2]).toHaveTextContent('Connected')
          expect(logs[3]).toHaveTextContent('Request subscribing to fnr 123 and avdodFnr 456')
          expect(logs[4]).toHaveTextContent('Subscription status is true')
          resolve()
        }, 200)
      })
    })
  })

  it('Handling: replies to messages', async () => {
    const { container } = render(<BucWebSocket {...initialMockProps} />)
    await act(async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          mockSocket.send(JSON.stringify({ bucUpdated: { caseId: '123' } }))
          setTimeout(() => {
            const logs = container.querySelectorAll('div.logs span.log')
            expect(logs.length).toBe(6)
            expect(logs[5]).toHaveTextContent('Updating buc 123')
            expect(fetchBuc).toHaveBeenCalledWith('123')
            resolve()
          }, 300)
        }, 300)
      })
    })
  })

  it('Handling: error connection', async () => {
    expect(screen.getByTestId('a_buc_websocket')).toHaveAttribute('title', 'websocket: CONNECTED')
    act(() => {
      mockServer.simulate('error')
    })
    await act(async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(screen.getByTestId('a_buc_websocket')).toHaveAttribute('title', 'websocket: ERROR')
          resolve()
        }, 500)
      })
    })
  })

  it('Handling: close connection', async () => {
    expect(screen.getByTestId('a_buc_websocket')).toHaveAttribute('title', 'websocket: ERROR')
    act(() => {
      mockSocket.close()
    })
    await act(async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(screen.getByTestId('a_buc_websocket')).toHaveAttribute('title', 'websocket: NOTCONNECTED')
          resolve()
        }, 500)
      })
    })
  })
})
