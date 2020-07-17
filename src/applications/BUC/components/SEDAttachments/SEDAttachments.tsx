import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import { HighContrastKnapp, VerticalSeparatorDiv } from 'components/StyledComponents'
import { AttachedFiles } from 'declarations/buc'
import { AttachedFilesPropType } from 'declarations/buc.pt'
import { JoarkFiles } from 'declarations/joark'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface SEDAttachmentsProps {
  files: AttachedFiles
  highContrast: boolean
  open?: boolean
  onFilesChange?: (f: JoarkFiles) => void
  onClose?: () => void
  onOpen?: () => void
}

const SEDAttachments: React.FC<SEDAttachmentsProps> = ({
  files, open = false, onFilesChange = () => {}, onClose = () => {}, onOpen = () => {},
}: SEDAttachmentsProps): JSX.Element => {
  const { t } = useTranslation()

  const onEnableAttachmentsButtonClicked = (): void => onOpen()
  const onDisableAttachmentsButtonClicked = (): void => onClose()

  return (
    <>
      <HighContrastKnapp
        data-testid='a-buc-c-sedattachments-button-id'
        onClick={open ? onDisableAttachmentsButtonClicked : onEnableAttachmentsButtonClicked}
      >
         {t(open ? 'ui:hideAttachments' : 'ui:showAttachments')}
      </HighContrastKnapp>
      <VerticalSeparatorDiv/>
      {open && (
        <>
          <JoarkBrowser
            sed={undefined}
            files={files && files.joark ? files.joark as JoarkFiles : []}
            onFilesChange={onFilesChange}
          />
          <VerticalSeparatorDiv data-size='1.5' />
        </>
      )}
    </>
  )
}

SEDAttachments.propTypes = {
  files: AttachedFilesPropType.isRequired,
  open: PT.bool,
  onFilesChange: PT.func,
  onOpen: PT.func
}

export default SEDAttachments
