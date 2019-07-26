import React from 'react'
import { SessionMonitor } from './SessionMonitor'

describe('components/SessionMonitor', () => {
  let initialMockProps = {
    t: jest.fn((translationString) => { return translationString }),
    actions: {
      openModal: jest.fn()
    }
  }

  it('Renders', () => {
    const now = new Date()
    const expirationTime = new Date(new Date().setSeconds(now.getSeconds() + 10))
    const wrapper = mount(<SessionMonitor
      expirationTime={expirationTime}
      checkInterval={500}
      millisecondsForWarning={9900}
      sessionExpiredReload={1000}
      {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('SessionMonitor will trigger a openModal when session is almost expiring', async (done) => {
    // expires in 10 seconds - will check every 0.5s - warnings start at 9.9s - reload only happens under 1s
    const now = new Date()
    const expirationTime = new Date(new Date().setSeconds(now.getSeconds() + 10))
    mount(<SessionMonitor
      expirationTime={expirationTime}
      checkInterval={500}
      millisecondsForWarning={9900}
      sessionExpiredReload={1000}
      {...initialMockProps}
    />)
    expect(initialMockProps.actions.openModal).not.toHaveBeenCalled()
    await new Promise(resolve => {
      setTimeout(() => {
        expect(initialMockProps.actions.openModal).toHaveBeenCalled()
        done()
        resolve()
      }, 1000)
    })
  })

  it('SessionMonitor will trigger a openModal when session expired', async (done) => {
    // expires in 1 seconds - will check every 0.5s - warnings start at 0.9s - reload happens under 10s
    const now = new Date()
    const expirationTime = new Date(new Date().setSeconds(now.getSeconds() + 1))
    mount(<SessionMonitor
      expirationTime={expirationTime}
      checkInterval={500}
      millisecondsForWarning={900}
      sessionExpiredReload={10000}
      {...initialMockProps}
    />)

    expect(window.location.reload).not.toHaveBeenCalled()
    await new Promise(resolve => {
      setTimeout(() => {
        expect(window.location.reload).toHaveBeenCalled()
        window.location.reload.mockRestore()
        done()
        resolve()
      }, 1000)
    })
  })
})
