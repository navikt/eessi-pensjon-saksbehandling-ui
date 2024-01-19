import { SavingAttachmentsJob } from 'declarations/buc'
import { render, screen } from '@testing-library/react'
import { stageSelector } from 'setupTests'
import SEDAttachmentSender, { SEDAttachmentSenderProps } from './SEDAttachmentSender'
import joarkBrowserItems from 'mocks/joark/items'
import ProgressBar from "components/ProgressBar/ProgressBar";

const defaultSelector = {
  savingAttachmentsJob: {
    total: joarkBrowserItems,
    saved: [],
    saving: undefined,
    remaining: joarkBrowserItems
  }
}

describe('applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender', () => {
  let wrapper: any
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

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    const { container } = render(<SEDAttachmentSender {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: Has proper HTML structure', () => {
    expect(screen.getByTestId('a_buc_c_sedAttachmentSender--div-id')).toBeTruthy()
    expect(screen.getByTestId('a_buc_c_sedAttachmentSender--progress-bar-id')).toBeTruthy()
    expect(wrapper.find(ProgressBar).props().status).toEqual(initialMockProps.initialStatus)
  })

  it('Handling: cancel button pressed', () => {
    (initialMockProps.onCancel as jest.Mock).mockReset()
    wrapper.find('[data-testid=\'a_buc_c_sedAttachmentSender--cancel-button-id').hostNodes().simulate('click')
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
    wrapper = render(<SEDAttachmentSender {...initialMockProps} />)
    expect(wrapper.find(ProgressBar).props().status).toEqual('done')
    expect(initialMockProps.onSaved).toHaveBeenCalledWith(mockSavingAttachmentJob)
    expect(initialMockProps.onFinished).toHaveBeenCalled()
  })
})
