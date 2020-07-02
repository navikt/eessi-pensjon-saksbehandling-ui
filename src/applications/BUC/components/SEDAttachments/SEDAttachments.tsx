import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import { HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'components/StyledComponents'
import { AttachedFiles } from 'declarations/buc'
import { AttachedFilesPropType } from 'declarations/buc.pt'
import { JoarkFiles } from 'declarations/joark'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Knapp, { Hovedknapp } from 'nav-frontend-knapper'
import TilsetteIcon from 'assets/icons/Tilsette'
import { Normaltekst } from 'nav-frontend-typografi'
import styled from 'styled-components'

export interface SEDAttachmentsProps {
  disableButtons?: boolean;
  files: AttachedFiles;
  initialMode ?: 'view' | 'confirm';
  open?: boolean;
  onFilesChange?: (f: JoarkFiles) => void;
  onOpen?: () => void;
  onSubmit?: (f: AttachedFiles) => void;
}

const SEDAttachmentsDiv = styled.div``
const FlexDiv = styled.div`
  display: flex;
`
const NormalText = styled(Normaltekst)`
  margin-left: 0.5rem;
`

const SEDAttachments: React.FC<SEDAttachmentsProps> = ({
  disableButtons = false, files, initialMode = 'view', open = false, onFilesChange, onOpen, onSubmit
}: SEDAttachmentsProps): JSX.Element => {
  const [mode, setMode] = useState<string>(initialMode)
  const [localFiles, setLocalFiles] = useState<JoarkFiles>(files && _.isArray(files.joark) ? files.joark as JoarkFiles : [])
  const { t } = useTranslation()
  const onEnableAttachmentsButtonClicked = (): void => {
    if (_.isFunction(onOpen)) {
      onOpen()
    }
  }

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
    <SEDAttachmentsDiv data-testId='a-buc-c-sedattachments'>
      {!open ? (
        <Knapp
          data-testId='a-buc-c-sedattachments__enable-button-id'
          onClick={onEnableAttachmentsButtonClicked}
        >
          <FlexDiv>
            <TilsetteIcon />
            <NormalText>
              {t('ui:addAttachments')}
            </NormalText>
          </FlexDiv>
        </Knapp>
      ) : (
        <>
          <JoarkBrowser
            files={localFiles}
            mode={mode}
            onFilesChange={onLocalFileChange}
          />
          <VerticalSeparatorDiv data-size='1.5' />
          {mode === 'view' && (
            <Hovedknapp
              disabled={_.isEmpty(localFiles)}
              id='a-buc-c-sedattachments__upload-button-id'
              className='a-buc-c-sedattachments__upload-button'
              onClick={() => setMode('confirm')}
            >
              {t('buc:form-addSelectedAttachments')}
            </Hovedknapp>
          )}
          {mode === 'confirm' && (
            <>
              <Hovedknapp
                disabled={_.isEmpty(localFiles) || disableButtons}
                data-testId='a-buc-c-sedattachments__submit-button-id'
                onClick={() => onSubmitJoarkFiles(localFiles)}
              >
                <NormalText>
                  {t('buc:form-submitSelectedAttachments')}
                </NormalText>
              </Hovedknapp>
              <HorizontalSeparatorDiv />
              <Knapp
                disabled={disableButtons}
                data-testId='a-buc-c-sedattachments__cancel-button-id'
                className='a-buc-c-sedattachments__cancel-button'
                onClick={() => setMode('view')}
              >
                <NormalText>
                  {t('buc:form-selectAgainAttachments')}
                </NormalText>
              </Knapp>
            </>
          )}
        </>
      )}
    </SEDAttachmentsDiv>
  )
}

SEDAttachments.propTypes = {
  disableButtons: PT.bool,
  files: AttachedFilesPropType.isRequired,
  initialMode: PT.oneOf(['view', 'confirm']),
  open: PT.bool,
  onFilesChange: PT.func,
  onOpen: PT.func,
  onSubmit: PT.func
}

export default SEDAttachments
