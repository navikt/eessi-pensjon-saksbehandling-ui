import { JoarkFile } from 'applications/BUC/declarations/joark'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import sampleJoarkReduced from 'resources/tests/sampleJoarkReduced'
import SEDAttachmentSender, { SEDAttachmentSenderProps } from './SEDAttachmentSender'

describe('applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender', () => {
  let wrapper: ReactWrapper
  const initialMockProps: SEDAttachmentSenderProps = {
    allAttachments: sampleJoarkReduced as Array<JoarkFile>,
    attachmentsError: false,
    className: 'mock-sedAttachmentSender',
    initialStatus: 'inprogress',
    onFinished: jest.fn(),
    payload: {},
    savedAttachments: [],
    sendAttachmentToSed: jest.fn(),
    t: jest.fn(t => t)
  }

  beforeEach(() => {
    wrapper = mount(<SEDAttachmentSender {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-sedAttachmentSender')).toBeTruthy()
  })
})
