import React from 'react'
import SEDAttachments from './SEDAttachments'
jest.mock('./AttachmentStep1', () => {
  return () => { return <div className='mock-step1' /> }
})
jest.mock('./AttachmentStep2', () => {
  return () => { return <div className='mock-step2' /> }
})

describe('applications/BUC/components/SEDAttachments/SEDAttachments', () => {
  let wrapper
  const initialMockProps = {
    t: jest.fn(t => t),
    files: {},
    setFiles: jest.fn()
  }

  beforeEach(() => {
    wrapper = mount(<SEDAttachments {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-sedattachments')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedattachments__enable-button-id')).toBeTruthy()
  })

  it('Pressing button for attachments leads to step 1', () => {
    expect(wrapper.exists('.mock-step1')).toBeFalsy()
    wrapper.find('#a-buc-c-sedattachments__enable-button-id').hostNodes().simulate('click')
    expect(wrapper.exists('.mock-step1')).toBeTruthy()
  })

  it('Step 2 can be seen', () => {
    wrapper = mount(<SEDAttachments {...initialMockProps} initialStep={2} />)
    expect(wrapper.exists('.mock-step2')).toBeFalsy()
    wrapper.find('#a-buc-c-sedattachments__enable-button-id').hostNodes().simulate('click')
    expect(wrapper.exists('.mock-step2')).toBeTruthy()
  })
})
