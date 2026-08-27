import { fireEvent, render, screen } from '@testing-library/react'
import SEDAttachmentsPanel, { SEDAttachmentsPanelProps } from './SEDAttachmentsPanel'
import { trackConsoleIssues, assertNoConsoleIssues } from 'src/utils/testConsoleUtils'
import { trackSelectorCalls, assertSelectorsAreMemoized } from 'src/utils/testSelectorUtils'
import { stageSelector } from 'src/setupTests'
import mockBucs from 'src/mocks/buc/bucs'
import { Buc, Sed } from 'src/declarations/buc'
import joarkBrowserItems from 'src/mocks/joark/items'
import _ from 'lodash'

jest.mock('src/actions/buc', () => ({
  createSavingAttachmentJob: jest.fn(),
  resetSavingAttachmentJob: jest.fn(),
  sendAttachmentToSed: jest.fn()
}))

jest.mock('src/applications/BUC/components/SEDAttachmentModal/SEDAttachmentModal', () => {
  return function SEDAttachmentModal({ onFinishedSelection, open }: any) {
    return open ? (
      <button onClick={() => onFinishedSelection(joarkBrowserItems)} data-testid="add-pending-attachment">
        Add pending attachment
      </button>
    ) : null
  }
})

jest.mock('src/applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender', () => {
  return function SEDAttachmentSender({ onCancel, onFinished, onSaved }: any) {
    return (
      <>
        <button data-testid="finish-attachment-upload" onClick={onFinished}>Finish attachment upload</button>
        <button data-testid="cancel-attachment-upload" onClick={onCancel}>Cancel attachment upload</button>
        <button data-testid="save-attachment" onClick={() => onSaved({ remaining: [] })}>Save attachment</button>
      </>
    )
  }
})

jest.mock('src/components/JoarkBrowser/JoarkBrowser', () => {
  return function JoarkBrowser({ existingItems, tableId }: any) {
    return <div data-testid={'joark-browser-' + tableId}>{existingItems.map((item: any) => item.type).join(',')}</div>
  }
})

describe('SEDAttachmentsPanel', () => {
  const bucs = _.keyBy(mockBucs(), 'caseId')
  const currentBuc = '999999'
  const buc = bucs[currentBuc] as Buc
  const sed: Sed = buc?.seds?.find((s: Sed) => s.type === 'P2000')!

  const defaultSelector = {
    buc: {
      attachmentsError: false
    }
  }

  const defaultProps: SEDAttachmentsPanelProps = {
    aktoerId: '123456789',
    buc: buc,
    canHaveAttachments: true,
    sed: sed
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    jest.clearAllMocks()
  })

  describe('console errors and warnings', () => {
    it('renders without console errors or warnings', () => {
      const tracker = trackConsoleIssues()

      render(<SEDAttachmentsPanel {...defaultProps} />)

      assertNoConsoleIssues(tracker)
    })

    it('renders without console errors on rerender', () => {
      const tracker = trackConsoleIssues()

      const { rerender } = render(<SEDAttachmentsPanel {...defaultProps} />)
      rerender(<SEDAttachmentsPanel {...defaultProps} canHaveAttachments={false} />)

      assertNoConsoleIssues(tracker)
    })
  })

  describe('selector memoization', () => {
    it('uses memoized selectors to prevent unnecessary rerenders', () => {
      const mockState = {
        buc: {
          attachmentsError: false
        }
      }

      const tracker = trackSelectorCalls(mockState)

      const { rerender } = render(<SEDAttachmentsPanel {...defaultProps} />)
      rerender(<SEDAttachmentsPanel {...defaultProps} />)


      assertSelectorsAreMemoized(tracker)
    })
  })

  it('keeps saved and pending attachments in separate tables', () => {
    const sedWithSavedAttachment = {
      ...sed,
      attachments: [{
        id: 'saved-attachment',
        name: 'Saved attachment',
        fileName: 'saved.pdf',
        mimeType: 'application/pdf',
        documentId: 'rina-document-id',
        lastUpdate: 0,
        medical: false
      }]
    }

    render(<SEDAttachmentsPanel {...defaultProps} sed={sedWithSavedAttachment} />)

    expect(screen.getByTestId('joark-browser-saved-sed-' + sed.id)).toHaveTextContent('sed')
    fireEvent.click(screen.getByTestId('a_buc_c_sedattachmentspanel--show-table-button-id'))
    fireEvent.click(screen.getByTestId('add-pending-attachment'))
    expect(screen.getByTestId('joark-browser-pending-sed-' + sed.id)).toHaveTextContent('joark')
  })

  it('uploads pending attachments and clears them when the batch finishes', () => {
    const { createSavingAttachmentJob } = jest.requireMock('src/actions/buc')
    render(<SEDAttachmentsPanel {...defaultProps} />)

    fireEvent.click(screen.getByTestId('a_buc_c_sedattachmentspanel--show-table-button-id'))
    fireEvent.click(screen.getByTestId('add-pending-attachment'))
    fireEvent.click(screen.getByTestId('a_buc_c_sedattachmentspanel--upload-button-id'))

    expect(createSavingAttachmentJob).toHaveBeenCalledWith(joarkBrowserItems)
    fireEvent.click(screen.getByTestId('finish-attachment-upload'))

    expect(screen.queryByTestId('joark-browser-pending-sed-' + sed.id)).not.toBeInTheDocument()
  })

  it('retains pending attachments when an upload is cancelled', () => {
    const { resetSavingAttachmentJob } = jest.requireMock('src/actions/buc')
    render(<SEDAttachmentsPanel {...defaultProps} />)

    fireEvent.click(screen.getByTestId('a_buc_c_sedattachmentspanel--show-table-button-id'))
    fireEvent.click(screen.getByTestId('add-pending-attachment'))
    fireEvent.click(screen.getByTestId('a_buc_c_sedattachmentspanel--upload-button-id'))
    fireEvent.click(screen.getByTestId('cancel-attachment-upload'))

    expect(resetSavingAttachmentJob).toHaveBeenCalled()
    expect(screen.getByTestId('joark-browser-pending-sed-' + sed.id)).toBeInTheDocument()
  })

  it('removes successfully uploaded attachments from the pending table', () => {
    render(<SEDAttachmentsPanel {...defaultProps} />)

    fireEvent.click(screen.getByTestId('a_buc_c_sedattachmentspanel--show-table-button-id'))
    fireEvent.click(screen.getByTestId('add-pending-attachment'))
    fireEvent.click(screen.getByTestId('a_buc_c_sedattachmentspanel--upload-button-id'))
    fireEvent.click(screen.getByTestId('save-attachment'))

    expect(screen.queryByTestId('joark-browser-pending-sed-' + sed.id)).not.toBeInTheDocument()
  })
})
