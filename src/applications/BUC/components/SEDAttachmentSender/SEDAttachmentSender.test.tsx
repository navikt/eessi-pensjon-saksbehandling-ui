import { JoarkFiles } from 'declarations/joark'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import mockJoarkReduced from 'mocks/joark/joarkReduced'
import SEDAttachmentSender, { SEDAttachmentSenderProps } from './SEDAttachmentSender'

describe('applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender', () => {
  let wrapper: ReactWrapper
  const initialMockProps: SEDAttachmentSenderProps = {
    allAttachments: mockJoarkReduced as JoarkFiles,
    attachmentsError: false,
    className: 'mock-sedAttachmentSender',
    initialStatus: 'inprogress',
    onFinished: jest.fn(),
    payload: {
      aktoerId: '123',
      rinaId: '456',
      rinaDokumentId: '789'
    },
    savedAttachments: [],
    sendAttachmentToSed: jest.fn()
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
