import Icons from 'components/Icons/Icons'
import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import { AttachedFiles } from 'declarations/buc'
import { AttachedFilesPropType } from 'declarations/buc.pt'
import { JoarkFiles } from 'declarations/joark'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Knapp, { Hovedknapp } from 'nav-frontend-knapper'

export interface SEDAttachmentsProps {
  disableButtons?: boolean;
  files: AttachedFiles;
  initialMode ?: 'view' | 'confirm';
  open?: boolean;
  onFilesChange?: (f: JoarkFiles) => void;
  onOpen?: () => void;
  onSubmit?: (f: AttachedFiles) => void;
}

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
    <div className='a-buc-c-sedattachments'>
      {!open ? (
        <Knapp
          id='a-buc-c-sedattachments__enable-button-id'
          className='a-buc-c-sedattachments__enable-button'
          onClick={onEnableAttachmentsButtonClicked}
        >
          <div className='d-flex'>
            <Icons className='mr-2' kind='tilsette' />
            <span>{t('ui:addAttachments')}</span>
          </div>
        </Knapp>
      ) : (
        <>
          <JoarkBrowser
            files={localFiles}
            mode={mode}
            onFilesChange={onLocalFileChange}
          />
          <div className='mt-4'>
            {mode === 'view' ? (
              <Hovedknapp
                disabled={_.isEmpty(localFiles)}
                id='a-buc-c-sedattachments__upload-button-id'
                className='a-buc-c-sedattachments__upload-button'
                onClick={() => setMode('confirm')}
              >
                {t('buc:form-addSelectedAttachments')}
              </Hovedknapp>
            ) : null}
            {mode === 'confirm' ? (
              <>
                <Hovedknapp
                  disabled={_.isEmpty(localFiles) || disableButtons}
                  id='a-buc-c-sedattachments__submit-button-id'
                  className='a-buc-c-sedattachments__submit-button mr-2'
                  onClick={() => onSubmitJoarkFiles(localFiles)}
                >
                  {t('buc:form-submitSelectedAttachments')}
                </Hovedknapp>
                <Knapp
                  disabled={disableButtons}
                  id='a-buc-c-sedattachments__cancel-button-id'
                  className='a-buc-c-sedattachments__cancel-button'
                  onClick={() => setMode('view')}
                >
                  {t('buc:form-selectAgainAttachments')}
                </Knapp>
              </>
            ) : null}
          </div>
        </>
      )}
    </div>
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
