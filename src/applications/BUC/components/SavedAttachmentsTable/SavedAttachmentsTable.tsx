import { getSavedAttachmentPreview, setSavedAttachmentPreview } from 'src/actions/buc'
import attachmentTableStyles from 'src/components/AttachmentTable/AttachmentTable.module.css'
import Modal from 'src/components/Modal/Modal'
import PDFViewer from 'src/components/PDFViewer/PDFViewer'
import { JoarkPreview } from 'src/declarations/joark'
import { State } from 'src/declarations/reducers'
import { SEDAttachments } from 'src/declarations/buc'
import { EyeWithPupilFillIcon } from '@navikt/aksel-icons'
import { Button, Loader } from '@navikt/ds-react'
import { Item } from '@navikt/tabell'
import Table from '@navikt/tabell'
import React, { JSX, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

interface SavedAttachmentTableItem extends Item {
  attachmentId: string
  title: string
  date: Date
}

interface SavedAttachmentsTableProps {
  attachments: SEDAttachments
  rinaSakId: string | null
  dokumentId: string
  tableId: string
}

interface SavedAttachmentsTableSelector {
  preview: JoarkPreview | undefined
  previewLoading: boolean
}

const mapState = (state: State): SavedAttachmentsTableSelector => ({
  preview: state.buc.savedAttachmentPreview,
  previewLoading: state.loading.gettingSavedAttachmentPreview
})

const SavedAttachmentsTable: React.FC<SavedAttachmentsTableProps> = ({
  attachments,
  rinaSakId,
  dokumentId,
  tableId
}: SavedAttachmentsTableProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { preview, previewLoading } = useSelector<State, SavedAttachmentsTableSelector>(mapState)
  const [currentPage, setCurrentPage] = useState(1)
  const [previewedAttachmentId, setPreviewedAttachmentId] = useState<string | undefined>()
  const items = useMemo<SavedAttachmentTableItem[]>(
    () => attachments.map((attachment) => ({
      key: attachment.id,
      attachmentId: attachment.id,
      title: attachment.name,
      date: new Date(attachment.lastUpdate)
    })),
    [attachments]
  )

  useEffect(() => {
    setPreviewedAttachmentId(undefined)
    dispatch(setSavedAttachmentPreview(undefined))
  }, [dispatch, dokumentId, rinaSakId])

  const closePreview = (): void => {
    setPreviewedAttachmentId(undefined)
    dispatch(setSavedAttachmentPreview(undefined))
  }

  const renderPreviewCell = ({ item }: { item: SavedAttachmentTableItem }): JSX.Element => {
    const previewing = previewLoading && item.attachmentId === previewedAttachmentId

    return (
      <Button
        variant='secondary'
        size='small'
        data-testid={'saved-attachment-preview-' + item.attachmentId}
        disabled={previewLoading || !rinaSakId}
        onClick={() => {
          if (!rinaSakId) {
            return
          }
          setPreviewedAttachmentId(item.attachmentId)
          dispatch(getSavedAttachmentPreview(rinaSakId, dokumentId, item.attachmentId))
        }}
      >
        {previewing ? <Loader /> : <EyeWithPupilFillIcon fontSize='1.5rem' />}
      </Button>
    )
  }

  return (
    <div data-testid={'saved-attachments-table-' + tableId}>
      <Modal
        open={!!preview}
        modal={preview ? {
          modalContent: (
            <PDFViewer
              file={preview.filInnhold}
              name={preview.fileName}
              size={preview.filInnhold.length}
              width={900}
              height={1200}
            />
          )
        } : undefined}
        onModalClose={closePreview}
        width='900'
      />
      <Table<SavedAttachmentTableItem>
        id={'saved-attachments-table-' + tableId}
        className={attachmentTableStyles.table}
        items={items}
        columns={[{
          id: 'title',
          label: t('ui:title'),
          type: 'string'
        }, {
          id: 'date',
          label: t('ui:date'),
          type: 'date',
          dateFormat: 'DD.MM.YYYY'
        }, {
          id: 'preview',
          label: '',
          type: 'object',
          render: renderPreviewCell
        }, {
          id: 'actions',
          label: '',
          type: 'object',
          render: () => <div />
        }, {
          id: 'spacer',
          label: '',
          type: 'object',
          render: () => <div />
        }]}
        itemsPerPage={10}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        animatable={false}
        searchable={false}
        selectable={false}
        sortable={false}
        showSelectAll={false}
        summary
        size='small'
      />
    </div>
  )
}

export default SavedAttachmentsTable
