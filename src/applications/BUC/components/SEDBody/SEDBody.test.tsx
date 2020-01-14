import { SEDAttachmentsProps } from 'applications/BUC/components/SEDAttachments/SEDAttachments'
import { Buc } from 'applications/BUC/declarations/buc.d'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import sampleBucs from 'resources/tests/sampleBucs'
import SEDBody, { SEDBodyProps } from './SEDBody'

jest.mock('components/JoarkBrowser/JoarkBrowser', () => {
  return () => <div className='mock-joarkbrowser' />
})

describe('applications/BUC/components/SEDBody/SEDBody', () => {
  let wrapper: ReactWrapper
  const buc: Buc = sampleBucs[0]
  const initialMockProps: SEDBodyProps = {
    actions: {
      resetSedAttachments: jest.fn(),
      sendAttachmentToSed: jest.fn()
    },
    aktoerId: '123',
    attachments: {},
    attachmentsError: false,
    buc: buc,
    initialAttachmentsSent: false,
    initialSeeAttachmentPanel: false,
    initialSendingAttachments: false,
    onAttachmentsSubmit: jest.fn(),
    onAttachmentsPanelOpen: jest.fn(),
    t: jest.fn(t => t),
    sed: buc.seds![0]
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
    (initialMockProps.onAttachmentsPanelOpen as jest.Mock).mockReset()
    act(() => {
      const props = (wrapper.find('SEDAttachments').props() as SEDAttachmentsProps | undefined)
      if (props && props.onOpen) props.onOpen()
    })
    expect(initialMockProps.onAttachmentsPanelOpen).toHaveBeenCalled()
  })

  it('SEDAttachment onAttachmentsPanelSubmitted is called', () => {
    (initialMockProps.onAttachmentsSubmit as jest.Mock).mockReset()
    act(() => {
      const props = (wrapper.find('SEDAttachments').props() as SEDAttachmentsProps | undefined)
      if (props && props.onSubmit) props.onSubmit({ joark: [] })
    })
    expect(initialMockProps.onAttachmentsSubmit).toHaveBeenCalled()
  })
})
