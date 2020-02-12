import { WidgetProps } from 'eessi-pensjon-ui/dist/declarations/Dashboard'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import VarslerWidget from './VarslerWidget'

jest.mock('widgets/Varsler/VarslerPanel', () => () => (<div className='mock-varslerPanel' />))

describe('widgets/Varsler/VarslerWidget', () => {
  let wrapper: ReactWrapper
  const initialMockProps: WidgetProps = {
    onFullFocus: jest.fn(),
    onResize: jest.fn(),
    onRestoreFocus: jest.fn(),
    onUpdate: jest.fn(),
    widget: {
      i: 'i',
      type: 'varsler',
      title: 'Varsler',
      visible: true,
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
    expect(wrapper.exists('.w-VarslerWidget')).toBeTruthy()
    expect(wrapper.exists('.mock-varslerPanel')).toBeTruthy()
  })
})
