import React from 'react'
import { SessionMonitor} from './SessionMonitor'

describe('components/app/SessionMonitor', () => {

  let initialMockProps = {
    t: jest.fn((translationString) => { return translationString }),
    actions: {
      openModal: jest.fn()
    }
  }

  it('SessionMonitor renders without crashing', () => {
    const wrapper = shallow(<SessionMonitor/>)
    expect(wrapper).toMatchSnapshot()
  })

  it('SessionMonitor will trigger a openModal', async (done) => {

    const wrapper = shallow(<SessionMonitor
      loggedTime={new Date()}
      sessionLength={1}
      checkInterval={500}
      {...initialMockProps}
    />)
    expect(wrapper.instance().props.actions.openModal.mock.calls.length).toBe(0)
    await new Promise(resolve => {
      setTimeout(() => {
        expect(wrapper.instance().props.actions.openModal.mock.calls.length).toBe(1)
        done()
      }, 1000)
    })
  })
})
