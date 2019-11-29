import { JoarkFile } from 'applications/BUC/declarations/joark'
import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import { Icons, Nav } from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useState } from 'react'
import { T } from 'types'

export interface SEDAttachmentsProps {
  disableButtons?: boolean;
  files: { [k: string]: Array<JoarkFile> };
  initialMode ?: string;
  open?: boolean;
  onFilesChange?: Function;
  onOpen?: Function;
  onSubmit?: Function;
  t: T;
}

const SEDAttachments = ({
  disableButtons = false, files, initialMode = 'view', open = false, onFilesChange, onOpen, onSubmit, t
}: SEDAttachmentsProps) => {
  const [mode, setMode] = useState(initialMode)
  const [localFiles, setLocalFiles] = useState<Array<JoarkFile>>(files && _.isArray(files.joark) ? files.joark : [])

  const onEnableAttachmentsButtonClicked: Function = (): void => {
    if (onOpen && _(onOpen).isFunction()) {
      onOpen()
    }
  }

  const onLocalFileChange: Function = (changedFiles: Array<JoarkFile>): void => {
    setLocalFiles(changedFiles)
    if (_.isFunction(onFilesChange)) {
      onFilesChange(changedFiles)
    }
  }

  const onSubmitJoarkFiles: Function = (joarkFiles: Array<JoarkFile>): void => {
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
        <Nav.Knapp
          id='a-buc-c-sedattachments__enable-button-id'
          className='a-buc-c-sedattachments__enable-button'
          label={t('buc:form-enableAttachments')}
          onClick={onEnableAttachmentsButtonClicked}
        >
          <div className='d-flex'>
            <Icons className='mr-2' kind='tilsette' />
            <span>{t('ui:addAttachments')}</span>
          </div>
        </Nav.Knapp>
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
              <Nav.Hovedknapp
                disabled={_.isEmpty(localFiles)}
                id='a-buc-c-sedattachments__upload-button-id'
                className='a-buc-c-sedattachments__upload-button'
                onClick={() => setMode('confirm')}
              >
                {t('buc:form-addSelectedAttachments')}
              </Nav.Hovedknapp>
            ) : null}
            {mode === 'confirm' ? (
              <>
                <Nav.Hovedknapp
                  disabled={_.isEmpty(localFiles) || disableButtons}
                  id='a-buc-c-sedattachments__submit-button-id'
                  className='a-buc-c-sedattachments__submit-button mr-2'
                  onClick={() => onSubmitJoarkFiles(localFiles)}
                >
                  {t('buc:form-submitSelectedAttachments')}
                </Nav.Hovedknapp>
                <Nav.Knapp
                  disabled={disableButtons}
                  id='a-buc-c-sedattachments__cancel-button-id'
                  className='a-buc-c-sedattachments__cancel-button'
                  onClick={() => setMode('view')}
                >
                  {t('buc:form-selectAgainAttachments')}
                </Nav.Knapp>
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
  files: PT.object.isRequired,
  initialMode: PT.oneOf(['view', 'confirm']),
  open: PT.bool,
  onFilesChange: PT.func,
  onOpen: PT.func,
  onSubmit: PT.func,
  t: PT.func.isRequired
}

export default SEDAttachments
