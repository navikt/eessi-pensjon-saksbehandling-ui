import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import { AttachedFiles } from 'declarations/buc'
import { AttachedFilesPropType } from 'declarations/buc.pt'
import { JoarkFiles } from 'declarations/joark'
import { T } from 'declarations/types'
import { TPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useState } from 'react'

export interface SEDAttachmentsProps {
  disableButtons?: boolean;
  files: AttachedFiles;
  initialMode ?: 'view' | 'confirm';
  open?: boolean;
  onFilesChange?: (f: JoarkFiles) => void;
  onOpen?: () => void;
  onSubmit?: (f: AttachedFiles) => void;
  t: T;
}

const SEDAttachments: React.FC<SEDAttachmentsProps> = ({
  disableButtons = false, files, initialMode = 'view', open = false, onFilesChange, onOpen, onSubmit, t
}: SEDAttachmentsProps): JSX.Element => {
  const [mode, setMode] = useState<string>(initialMode)
  const [localFiles, setLocalFiles] = useState<JoarkFiles>(files && _.isArray(files.joark) ? files.joark as JoarkFiles : [])

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
        <Ui.Nav.Knapp
          id='a-buc-c-sedattachments__enable-button-id'
          className='a-buc-c-sedattachments__enable-button'
          label={t('buc:form-enableAttachments')}
          onClick={onEnableAttachmentsButtonClicked}
        >
          <div className='d-flex'>
            <Ui.Icons className='mr-2' kind='tilsette' />
            <span>{t('ui:addAttachments')}</span>
          </div>
        </Ui.Nav.Knapp>
      ) : (
        <>
          <JoarkBrowser
            files={localFiles}
            mode={mode}
            onFilesChange={onLocalFileChange}
            t={t}
          />
          <div className='mt-4'>
            {mode === 'view' ? (
              <Ui.Nav.Hovedknapp
                disabled={_.isEmpty(localFiles)}
                id='a-buc-c-sedattachments__upload-button-id'
                className='a-buc-c-sedattachments__upload-button'
                onClick={() => setMode('confirm')}
              >
                {t('buc:form-addSelectedAttachments')}
              </Ui.Nav.Hovedknapp>
            ) : null}
            {mode === 'confirm' ? (
              <>
                <Ui.Nav.Hovedknapp
                  disabled={_.isEmpty(localFiles) || disableButtons}
                  id='a-buc-c-sedattachments__submit-button-id'
                  className='a-buc-c-sedattachments__submit-button mr-2'
                  onClick={() => onSubmitJoarkFiles(localFiles)}
                >
                  {t('buc:form-submitSelectedAttachments')}
                </Ui.Nav.Hovedknapp>
                <Ui.Nav.Knapp
                  disabled={disableButtons}
                  id='a-buc-c-sedattachments__cancel-button-id'
                  className='a-buc-c-sedattachments__cancel-button'
                  onClick={() => setMode('view')}
                >
                  {t('buc:form-selectAgainAttachments')}
                </Ui.Nav.Knapp>
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
  onSubmit: PT.func,
  t: TPropType.isRequired
}

export default SEDAttachments
