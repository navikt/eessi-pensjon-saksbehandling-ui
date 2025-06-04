import { SavingAttachmentsJob } from 'src/declarations/buc'
import {fireEvent, render, screen} from '@testing-library/react'
import { stageSelector } from 'src/setupTests'
import SEDAttachmentSender, { SEDAttachmentSenderProps } from './SEDAttachmentSender'
import joarkBrowserItems from 'src/mocks/joark/items'

jest.mock('src/constants/environment.ts', () => {
  return {
    IS_DEVELOPMENT: 'development',
    IS_PRODUCTION: 'production',
    IS_TEST: 'test'
  };
})

const defaultSelector = {
  savingAttachmentsJob: {
    total: joarkBrowserItems,
    saved: [],
    saving: undefined,
    remaining: joarkBrowserItems
  }
}

describe('src/applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender', () => {
  //let wrapper: any
  const initialMockProps: SEDAttachmentSenderProps = {
    attachmentsError: false,
    className: 'mock-sedAttachmentSender',
    initialStatus: 'inprogress',
    onCancel: jest.fn(),
    onFinished: jest.fn(),
    onSaved: jest.fn(),
    payload: {
      aktoerId: '123',
      rinaId: '456',
      rinaDokumentId: '789'
    },
    sendAttachmentToSed: jest.fn()
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
  })

  it('Render: Has proper HTML structure', () => {
    render(<SEDAttachmentSender {...initialMockProps} />)
    expect(screen.getByTestId('a_buc_c_sedAttachmentSender--div-id')).toBeTruthy()
    expect(screen.getByText('message:loading-sendingXofY')).toBeTruthy()
  })

  it('Handling: cancel button pressed', () => {
    (initialMockProps.onCancel as jest.Mock).mockReset()
    render(<SEDAttachmentSender {...initialMockProps} />)
    fireEvent.click(screen.getByTestId('a_buc_c_sedAttachmentSender--cancel-button-id'))
    expect(initialMockProps.onCancel).toHaveBeenCalled()
  })

  it('Handling: finished when no more items', () => {
    const mockSavingAttachmentJob: SavingAttachmentsJob = {
      total: joarkBrowserItems,
      saved: joarkBrowserItems,
      saving: undefined,
      remaining: []
    }
    stageSelector(defaultSelector, {
      savingAttachmentsJob: mockSavingAttachmentJob
    })
    render(<SEDAttachmentSender {...initialMockProps} />)
    expect(screen.getByText('buc:form-attachmentsSent')).toBeTruthy()
    expect(initialMockProps.onSaved).toHaveBeenCalledWith(mockSavingAttachmentJob)
    expect(initialMockProps.onFinished).toHaveBeenCalled()
    screen.debug()
  })
})
