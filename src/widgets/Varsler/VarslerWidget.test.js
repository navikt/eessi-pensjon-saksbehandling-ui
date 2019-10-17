import React from 'react'
import VarslerWidget from './VarslerWidget'
jest.mock('widgets/Varsler/VarslerPanel', () => {
  return () => { return <div className='mock-varslerPanel' /> }
})

describe('widgets/Varsler/VarslerWidget', () => {
  let wrapper
  const initialMockProps = {
    onResize: jest.fn(),
    widget: {
      options: {
        collapsed: false
      }
    }
  }

  beforeEach(() => {
    wrapper = mount(<VarslerWidget {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-varslerWidget')).toBeTruthy()
    expect(wrapper.exists('.mock-varslerPanel')).toBeTruthy()
  })
})
