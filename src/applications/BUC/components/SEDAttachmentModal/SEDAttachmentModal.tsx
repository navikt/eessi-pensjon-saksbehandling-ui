import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import Modal from 'components/Modal/Modal'
import { JoarkBrowserItems } from 'declarations/joark'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Document from 'assets/icons/document'

export interface SEDAttachmentModalProps {
  onModalClose: () => void
  onFinishedSelection: (jbi: JoarkBrowserItems) => void
  sedAttachments: JoarkBrowserItems
  tableId: string
}

const SEDAttachmentModal = ({
  onFinishedSelection, onModalClose, sedAttachments, tableId
}: SEDAttachmentModalProps) => {
  const [_items, setItems] = useState<JoarkBrowserItems>(sedAttachments)
  const { t } = useTranslation()

  const onRowSelectChange = (items: JoarkBrowserItems) => {
    setItems(items)
  }

  const onAddAttachmentsButtonClick = () => {
    onFinishedSelection(_items)
    onModalClose()
  }

  const onCancelButtonClick = () => {
    onModalClose()
  }

  return (
    <Modal
      icon={<Document />}
      modal={{
        closeButton: true,
        modalContent: (
          <JoarkBrowser
            mode='select'
            tableId={tableId}
            existingItems={sedAttachments}
            onRowSelectChange={onRowSelectChange}
          />
        ),
        modalButtons: [{
          main: true,
          text: t('buc:form-addSelectedAttachments'),
          onClick: onAddAttachmentsButtonClick
        }, {
          text: t('ui:cancel'),
          onClick: onCancelButtonClick
        }]
      }}
      onModalClose={onModalClose}
    />
  )
}

export default SEDAttachmentModal
