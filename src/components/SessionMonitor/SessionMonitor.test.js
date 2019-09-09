import React from 'react'
import { SessionMonitor } from './SessionMonitor'

jest.mock('i18next', function () {
  const use = jest.fn()
  const init = jest.fn()
  const loadLanguages = jest.fn()
  const result = {
    use: use,
    init: init,
    loadLanguages: loadLanguages
  }
  use.mockImplementation(() => result)
  return result
})

describe('components/SessionMonitor', () => {
  const initialMockProps = {
    t: jest.fn((translationString) => { return translationString }),
    actions: {
      openModal: jest.fn()
    }
  }

  it('Renders', () => {
    const aDate = new Date('2020-12-17T03:24:00')
    const expirationTime = new Date('2020-12-17T03:24:10')
    const wrapper = mount(
      <SessionMonitor
        now={aDate}
        expirationTime={expirationTime}
        checkInterval={500}
        millisecondsForWarning={9900}
        sessionExpiredReload={1000}
        {...initialMockProps}
      />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('SessionMonitor will trigger a openModal when session is almost expiring', async (done) => {
    // expires in 5 seconds - will check every 0.5s - warnings start at 9.9s - reload only happens under 1s
    const aDate = new Date('2020-12-17T03:24:00')
    const expirationTime = new Date('2020-12-17T03:24:05')
    mount(
      <SessionMonitor
        now={aDate}
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
    const aDate = new Date('2020-12-17T03:24:00')
    const expirationTime = new Date('2020-12-17T03:23:59')
    mount(
      <SessionMonitor
        now={aDate}
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
