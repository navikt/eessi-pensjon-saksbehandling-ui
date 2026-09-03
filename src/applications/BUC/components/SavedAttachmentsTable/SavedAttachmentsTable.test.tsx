import { SEDAttachments } from 'src/declarations/buc'
import { fireEvent, render, screen } from '@testing-library/react'
import { stageSelector } from 'src/setupTests'
import SavedAttachmentsTable from './SavedAttachmentsTable'

jest.mock('src/actions/buc', () => ({
  getSavedAttachmentPreview: jest.fn(() => ({ type: 'BUC/SAVED_ATTACHMENT/PREVIEW/REQUEST' })),
  setSavedAttachmentPreview: jest.fn(() => ({ type: 'BUC/SAVED_ATTACHMENT/PREVIEW/SET' }))
}))

describe('SavedAttachmentsTable', () => {
  it('renders saved attachments without JOARK metadata columns', () => {
    const attachments: SEDAttachments = [{
      id: 'attachment-one',
      name: 'Saved attachment',
      fileName: 'saved-attachment.pdf',
      mimeType: 'application/pdf',
      documentId: 'rina-document-id',
      lastUpdate: 0,
      medical: false
    }]
    stageSelector({
      buc: { savedAttachmentPreview: undefined },
      loading: { gettingSavedAttachmentPreview: false }
    }, {})

    render(
      <SavedAttachmentsTable
        attachments={attachments}
        rinaSakId='rina-case-id'
        dokumentId='sed-document-id'
        tableId='test'
      />
    )

    expect(screen.getByText('Saved attachment')).toBeInTheDocument()
    expect(screen.getByTestId('saved-attachment-preview-attachment-one')).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader')).toHaveLength(5)
    expect(screen.queryByRole('columnheader', { name: 'Tema' })).not.toBeInTheDocument()
  })

  it('requests a preview using the RINA attachment ID', () => {
    const { getSavedAttachmentPreview } = jest.requireMock('src/actions/buc')
    stageSelector({
      buc: { savedAttachmentPreview: undefined },
      loading: { gettingSavedAttachmentPreview: false }
    }, {})

    render(
      <SavedAttachmentsTable
        attachments={[{
          id: 'attachment-one',
          name: 'Saved attachment',
          fileName: 'saved-attachment.pdf',
          mimeType: 'application/pdf',
          documentId: 'rina-document-id',
          lastUpdate: 0,
          medical: false
        }]}
        rinaSakId='rina-case-id'
        dokumentId='sed-document-id'
        tableId='test'
      />
    )

    fireEvent.click(screen.getByTestId('saved-attachment-preview-attachment-one'))

    expect(getSavedAttachmentPreview).toHaveBeenCalledWith(
      'rina-case-id',
      'sed-document-id',
      'attachment-one'
    )
  })
})
