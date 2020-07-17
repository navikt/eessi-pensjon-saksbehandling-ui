import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import SEDAttachmentSender, { SEDAttachmentSenderProps } from './SEDAttachmentSender'

describe('applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender', () => {
  let wrapper: ReactWrapper
  const initialMockProps: SEDAttachmentSenderProps = {
    attachmentsError: false,
    className: 'mock-sedAttachmentSender',
    initialStatus: 'inprogress',
    onSaved: jest.fn(),
    onFinished: jest.fn(),
    payload: {
      aktoerId: '123',
      rinaId: '456',
      rinaDokumentId: '789'
    },
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
