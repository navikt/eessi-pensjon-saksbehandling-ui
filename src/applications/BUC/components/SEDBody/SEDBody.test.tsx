import { resetSedAttachments } from 'actions/buc'
import { Buc } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import mockBucs from 'mocks/buc/bucs'
import { stageSelector } from 'setupTests'
import SEDBody, { SEDBodyProps } from './SEDBody'

jest.mock('actions/buc', () => ({
  resetSedAttachments: jest.fn(),
  sendAttachmentToSed: jest.fn()
}))

const defaultSelector = {
  attachments: { sed: [], joark: [] },
  attachmentsError: false
}

jest.mock('components/JoarkBrowser/JoarkBrowser', () => {
  return () => <div className='mock-joarkbrowser' />
})

describe('applications/BUC/components/SEDBody/SEDBody', () => {
  let wrapper: ReactWrapper
  const buc: Buc = mockBucs()[0]
  const initialMockProps: SEDBodyProps = {
    aktoerId: '123',
    buc: buc,
    canHaveAttachments: true,
    canShowProperties: false,
    highContrast: false,
    initialAttachmentsSent: false,
    initialSeeAttachmentPanel: false,
    initialSendingAttachments: false,
    onAttachmentsSubmit: jest.fn(),
    onAttachmentsPanelOpen: jest.fn(),
    sed: buc.seds![0]
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

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
    expect(resetSedAttachments).toHaveBeenCalled()
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
      // TODO
    })
    expect(initialMockProps.onAttachmentsPanelOpen).toHaveBeenCalled()
  })

  it('SEDAttachment onAttachmentsPanelSubmitted is called', () => {
    (initialMockProps.onAttachmentsSubmit as jest.Mock).mockReset()
    act(() => {
      // TODO
    })
    expect(initialMockProps.onAttachmentsSubmit).toHaveBeenCalled()
  })
})
