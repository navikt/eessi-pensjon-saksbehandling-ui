import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import Modal from 'components/Modal/Modal'
import { HighContrastKnapp } from 'components/StyledComponents'
import { AttachedFiles, BUCAttachments, Sed } from 'declarations/buc'
import { JoarkFiles } from 'declarations/joark'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface SEDAttachmentModalProps {
  sed: Sed
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

  return (
    <Modal
      modal={{
        closeButton: true,
        modalContent: (
          <>
            <JoarkBrowser
              id={sed.id}
              disabledFiles={sedAttachments.sed as BUCAttachments}
              files={files}
              onFilesChange={onFilesChange}
            />
            <HighContrastKnapp
              onClick={onButtonClick}
            >
              {t('ui:add')}
            </HighContrastKnapp>
          </>
        )
      }}
      onModalClose={onModalClose}
    />
  )
}

export default SEDAttachmentModal
