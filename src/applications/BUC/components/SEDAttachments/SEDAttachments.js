import React, { useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { Icons, Nav } from 'eessi-pensjon-ui'
import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'

const SEDAttachments = ({ disableButtons, files, initialMode = 'view', open = false, onFilesChange, onOpen, onSubmit, t }) => {
  const [mode, setMode] = useState(initialMode)
  const [localFiles, setLocalFiles] = useState(files && _.isArray(files.joark) ? files.joark : [])

  const handleButtonClick = () => {
    if (_(onOpen).isFunction()) {
      onOpen()
    }
  }

  const onLocalFileChange = (changedFiles) => {
    setLocalFiles(changedFiles)
    if (_.isFunction(onFilesChange)) {
      onFilesChange(changedFiles)
    }
  }

  const onSubmitJoarkFiles = (joarkFiles) => {
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
          onClick={handleButtonClick}
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
