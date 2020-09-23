import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import Modal from 'components/Modal/Modal'
import { AttachedFiles, BUCAttachments, Sed } from 'declarations/buc'
import { JoarkFiles } from 'declarations/joark'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Document from 'assets/icons/document'

export interface SEDAttachmentModalProps {
  sed?: Sed
  sedAttachments: AttachedFiles
  onModalClose: () => void
  onFinishedSelection: (jf: JoarkFiles) => void
}

const SEDAttachmentModal = ({
  sed, onFinishedSelection, sedAttachments, onModalClose
}: SEDAttachmentModalProps) => {
  const [files, setFiles] = useState<JoarkFiles>(sedAttachments.joark as JoarkFiles)
  const { t } = useTranslation()

  const onFilesChange = (jf: JoarkFiles) => {
    setFiles(jf)
  }

  const onButtonClick = () => {
    onFinishedSelection(files)
    onModalClose()
  }

  const onButtonCancel = () => {
    onModalClose()
  }

  return (
    <Modal
      icon={<Document />}
      modal={{
        closeButton: true,
        modalContent: (
          <JoarkBrowser
            id={sed ? sed.id : 'newsed'}
            disabledFiles={sedAttachments.sed as BUCAttachments}
            files={files}
            onFilesChange={onFilesChange}
          />
        ),
        modalButtons: [{
          main: true,
          text: t('buc:form-addSelectedAttachments'),
          onClick: onButtonClick
        }, {
          text: t('ui:cancel'),
          onClick: onButtonCancel
        }]
      }}
      onModalClose={onModalClose}
    />
  )
}

export default SEDAttachmentModal
