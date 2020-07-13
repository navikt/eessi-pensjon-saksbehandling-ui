import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import {
  HighContrastFlatknapp,
  HighContrastHovedknapp,
  HighContrastKnapp, HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from 'components/StyledComponents'
import { AttachedFiles } from 'declarations/buc'
import { AttachedFilesPropType } from 'declarations/buc.pt'
import { JoarkFiles } from 'declarations/joark'
import _ from 'lodash'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import TilsetteIcon from 'assets/icons/Tilsette'
import { Normaltekst } from 'nav-frontend-typografi'
import styled, { ThemeProvider } from 'styled-components'

export interface SEDAttachmentsProps {
  disableButtons: boolean
  files: AttachedFiles
  highContrast: boolean
  open?: boolean
  onFilesChange?: (f: JoarkFiles) => void
  onOpen?: () => void
  onSubmit?: (f: AttachedFiles) => void
}

const SEDAttachmentsDiv = styled.div``
const FlexDiv = styled.div`
  display: flex;
`
const NormalText = styled(Normaltekst)`
  margin-left: 0.5rem;
`

const SEDAttachments: React.FC<SEDAttachmentsProps> = ({
  disableButtons = false, files, highContrast, open = false, onFilesChange, onOpen = () => {}, onSubmit
}: SEDAttachmentsProps): JSX.Element => {
  const [localFiles, setLocalFiles] = useState<JoarkFiles>(files && _.isArray(files.joark) ? files.joark as JoarkFiles : [])
  const { t } = useTranslation()
  const onEnableAttachmentsButtonClicked = (): void => onOpen()

  const onLocalFileChange = (changedFiles: JoarkFiles): void => {
    setLocalFiles(changedFiles)
    if (_.isFunction(onFilesChange)) {
      onFilesChange(changedFiles)
    }
  }

  const onSubmitJoarkFiles = (joarkFiles: JoarkFiles): void => {
    if (_.isFunction(onSubmit)) {
      onSubmit({
        ...files,
        joark: joarkFiles
      })
    }
  }

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <SEDAttachmentsDiv data-testid='a-buc-c-sedattachments'>
        {!open ? (
          <HighContrastKnapp
            data-testid='a-buc-c-sedattachments__enable-button-id'
            onClick={onEnableAttachmentsButtonClicked}
          >
            <FlexDiv>
              <TilsetteIcon/>
              <NormalText>
                {t('ui:addAttachments')}
              </NormalText>
            </FlexDiv>
          </HighContrastKnapp>
        ) : (
          <>
            <JoarkBrowser
              files={localFiles}
              onFilesChange={onLocalFileChange}
            />
            <VerticalSeparatorDiv data-size='1.5' />
            <HighContrastHovedknapp
              disabled={_.isEmpty(localFiles) || disableButtons}
              data-testid='a-buc-c-sedattachments__upload-button-id'
              onClick={() => onSubmitJoarkFiles(localFiles)}
            >
              {t('buc:form-submitSelectedAttachments')}
            </HighContrastHovedknapp>
            <HorizontalSeparatorDiv/>
            <HighContrastFlatknapp
              disabled={disableButtons}
              data-testid='a-buc-c-sedattachments__cancel-button-id'
              onClick={() => onSubmitJoarkFiles(localFiles)}
            >
              {t('buc:form-cancelSelectedAttachments')}
            </HighContrastFlatknapp>

          </>
        )}
      </SEDAttachmentsDiv>
    </ThemeProvider>
  )
}

SEDAttachments.propTypes = {
  files: AttachedFilesPropType.isRequired,
  open: PT.bool,
  onFilesChange: PT.func,
  onOpen: PT.func,
  onSubmit: PT.func
}

export default SEDAttachments
