import React from 'react'
import SEDBody from './SEDBody'
jest.mock('components/JoarkBrowser/JoarkBrowser', () => {
  return () => <div className='mock-joarkbrowser' />
})

describe('applications/BUC/components/SEDBody/SEDBody', () => {
  let wrapper
  const initialMockProps = {
    actions: {
      resetSedAttachments: jest.fn(),
      sendAttachmentToSed: jest.fn()
    },
    aktoerId: '123',
    attachments: [],
    attachmentsError: false,
    buc: {
      caseId: 'mockCaseId'
    },
    onAttachmentsSubmit: jest.fn(),
    onAttachmentsPanelOpen: jest.fn(),
    t: jest.fn(t => t),
    sed: {
      id: 'mockId',
      attachments: []
    }
  }

  beforeEach(() => {
    wrapper = mount(<SEDBody {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-sedbody')).toBeTruthy()
  })

  it('UseEffect: cleanup after attachments sent', () => {
    wrapper = mount(<SEDBody {...initialMockProps} initialAttachmentsSent initialSendingAttachments />)
    wrapper.update()
    expect(initialMockProps.actions.resetSedAttachments).toHaveBeenCalled()
  })

  it('Shows the SEDAttachmentSender', () => {
    wrapper = mount(<SEDBody {...initialMockProps} />)
    expect(wrapper.exists('SEDAttachmentSender')).toBeFalsy()
    wrapper = mount(<SEDBody {...initialMockProps} initialSendingAttachments />)
    expect(wrapper.exists('SEDAttachmentSender')).toBeTruthy()
  })

  it('SEDAttachment onAttachmentsPanelOpened is called', () => {
    initialMockProps.onAttachmentsPanelOpen.mockReset()
    act(() => {
      wrapper.find('SEDAttachments').props().onOpen()
    })
    expect(initialMockProps.onAttachmentsPanelOpen).toHaveBeenCalled()
  })

  it('SEDAttachment onAttachmentsPanelSubmitted is called', () => {
    initialMockProps.onAttachmentsSubmit.mockReset()
    act(() => {
      wrapper.find('SEDAttachments').props().onSubmit({ joark: [] })
    })
    expect(initialMockProps.onAttachmentsSubmit).toHaveBeenCalled()
  })
})
