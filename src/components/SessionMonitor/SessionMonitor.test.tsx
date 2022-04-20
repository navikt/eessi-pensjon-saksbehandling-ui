import { render } from '@testing-library/react'
import { openModal } from 'actions/ui'

import { stageSelector } from 'setupTests'
import SessionMonitor, { SessionMonitorProps } from './SessionMonitor'

jest.mock('actions/ui', () => ({
  openModal: jest.fn(),
  closeModal: jest.fn()
}))

Object.defineProperty(window, 'location', {
  value: {
    ...window.location,
    reload: jest.fn()
  }
})

describe('components/SessionMonitor', () => {
  beforeEach(() => {
    stageSelector({}, {})
  })
  const initialMockProps: SessionMonitorProps = {
    expirationTime: new Date(2020, 1, 1)
  }

  it('Render: match snapshot', () => {
    const aDate = new Date('2020-12-17T03:24:00')
    const expirationTime = new Date('2020-12-17T03:24:10')
    const { container } = render(
      <SessionMonitor
        now={aDate}
        expirationTime={expirationTime}
        checkInterval={500}
        millisecondsForWarning={9900}
        sessionExpiredReload={1000}
        {...initialMockProps}
      />)

    expect(container.firstChild).toMatchSnapshot()
  })

  it('Handling: trigger openModal when session is almost expiring', async () => {
    // expires in 5 seconds - will check every 0.5s - warnings start at 9.9s - reload only happens under 1s
    const aDate = new Date('2020-12-17T03:24:00')
    const expirationTime = new Date('2020-12-17T03:24:05')
    render(
      <SessionMonitor
        now={aDate}
        expirationTime={expirationTime}
        checkInterval={500}
        millisecondsForWarning={9900}
        sessionExpiredReload={1000}
        {...initialMockProps}
      />)
    expect(openModal).not.toHaveBeenCalled()
    return new Promise(resolve => {
      setTimeout(() => {
        expect(openModal).toHaveBeenCalled()
        resolve(true)
      }, 1000)
    })
  })

  it('Handling: trigger a openModal when session expires', async () => {
    // expires in 1 seconds - will check every 0.5s - warnings start at 0.9s - reload happens under 10s
    (window.location.reload as jest.Mock).mockReset()
    const aDate = new Date('2020-12-17T03:24:00')
    const expirationTime = new Date('2020-12-17T03:23:59')
    render(
      <SessionMonitor
        now={aDate}
        expirationTime={expirationTime}
        checkInterval={500}
        millisecondsForWarning={900}
        sessionExpiredReload={10000}
        {...initialMockProps}
      />)
    return new Promise(resolve => {
      setTimeout(() => {
        expect(window.location.reload).toHaveBeenCalled();
        (window.location.reload as jest.Mock).mockRestore()
        resolve(true)
      }, 1000)
    })
  })
})
