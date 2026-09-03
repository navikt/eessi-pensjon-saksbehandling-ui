import { SEDAttachments } from 'src/declarations/buc'
import { Item } from '@navikt/tabell'
import Table from '@navikt/tabell'
import React, { JSX, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface SavedAttachmentTableItem extends Item {
  title: string
  date: Date
}

interface SavedAttachmentsTableProps {
  attachments: SEDAttachments
  tableId: string
}

const SavedAttachmentsTable: React.FC<SavedAttachmentsTableProps> = ({
  attachments,
  tableId
}: SavedAttachmentsTableProps): JSX.Element => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const items = useMemo<SavedAttachmentTableItem[]>(
    () => attachments.map((attachment) => ({
      key: attachment.id,
      title: attachment.name,
      date: new Date(attachment.lastUpdate)
    })),
    [attachments]
  )

  return (
    <div data-testid={'saved-attachments-table-' + tableId}>
      <Table<SavedAttachmentTableItem>
        id={'saved-attachments-table-' + tableId}
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
          render: () => <div />
        }, {
          id: 'actions',
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
