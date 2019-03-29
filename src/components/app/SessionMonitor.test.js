import React from 'react'
import { SessionMonitor } from './SessionMonitor'

describe('components/app/SessionMonitor', () => {
  let initialMockProps = {
    t: jest.fn((translationString) => { return translationString }),
    actions: {
      openModal: jest.fn()
    }
  }

  it('SessionMonitor renders without crashing', () => {
    const wrapper = shallow(<SessionMonitor />)
    expect(wrapper).toMatchSnapshot()
  })

  it('SessionMonitor will trigger a openModal when session is almost expiring', async (done) => {
    const wrapper = shallow(<SessionMonitor
      loggedTime={new Date()}
      sessionExpiringWarning={1}
      checkInterval={500}
      sessionExpiredReload={9999999}
      {...initialMockProps}
    />)
    expect(wrapper.instance().props.actions.openModal).not.toHaveBeenCalled()
    await new Promise(resolve => {
      setTimeout(() => {
        expect(wrapper.instance().props.actions.openModal).toHaveBeenCalled()
        done()
      }, 1000)
    })
  })

  it('SessionMonitor will trigger a openModal when session expired', async (done) => {
    const wrapper = shallow(<SessionMonitor
      loggedTime={new Date()}
      sessionExpiringWarning={1}
      checkInterval={500}
      sessionExpiredReload={499}
      {...initialMockProps}
    />)

    expect(window.location.reload).not.toHaveBeenCalled()
    await new Promise(resolve => {
      setTimeout(() => {
        expect(window.location.reload).toHaveBeenCalled()
        window.location.reload.mockRestore()
        done()
      }, 1000)
    })
  })
})
