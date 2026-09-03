import { SEDAttachments } from 'src/declarations/buc'
import { render, screen } from '@testing-library/react'
import SavedAttachmentsTable from './SavedAttachmentsTable'

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

    render(<SavedAttachmentsTable attachments={attachments} tableId='test' />)

    expect(screen.getByText('Saved attachment')).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader')).toHaveLength(5)
    expect(screen.queryByRole('columnheader', { name: 'Tema' })).not.toBeInTheDocument()
  })
})
