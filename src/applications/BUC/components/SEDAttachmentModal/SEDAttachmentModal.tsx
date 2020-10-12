import Document from 'assets/icons/document'
import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import Modal from 'components/Modal/Modal'
import { JoarkBrowserItems } from 'declarations/joark'
import { JoarkBrowserItemsFileType } from 'declarations/joark.pt'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ThemeProvider } from 'styled-components'

export interface SEDAttachmentModalProps {
  highContrast: boolean
  onFinishedSelection: (jbi: JoarkBrowserItems) => void
  onModalClose: () => void
  sedAttachments: JoarkBrowserItems
  tableId: string
}

const SEDAttachmentModal: React.FC<SEDAttachmentModalProps> = ({
  highContrast, onFinishedSelection, onModalClose, sedAttachments, tableId
}: SEDAttachmentModalProps): JSX.Element => {
  const [_items, setItems] = useState<JoarkBrowserItems>(sedAttachments)
  const { t } = useTranslation()

  const onRowSelectChange = (items: JoarkBrowserItems): void => {
    setItems(items)
  }

  const onAddAttachmentsButtonClick = (): void => {
    onFinishedSelection(_items)
    onModalClose()
  }

  const onCancelButtonClick = (): void => {
    onModalClose()
  }

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <Modal
        highContrast={highContrast}
        icon={<Document />}
        modal={{
          closeButton: true,
          modalContent: (
            <JoarkBrowser
              data-test-id='a-buc-c-sedattachmentmodal__joarkbrowser-id'
              existingItems={sedAttachments}
              mode='select'
              onRowSelectChange={onRowSelectChange}
              tableId={tableId}
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
    </ThemeProvider>
  )
}

SEDAttachmentModal.propTypes = {
  highContrast: PT.bool.isRequired,
  onFinishedSelection: PT.func.isRequired,
  onModalClose: PT.func.isRequired,
  sedAttachments: JoarkBrowserItemsFileType.isRequired,
  tableId: PT.string.isRequired
}

export default SEDAttachmentModal
