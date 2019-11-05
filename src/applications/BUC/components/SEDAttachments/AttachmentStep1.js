import React, { useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import { Nav } from 'eessi-pensjon-ui'

export const AttachmentStep1 = (props) => {
  const { files, onSubmit, t } = props
  const [mode, setMode] = useState('view')
  const [localFiles, setLocalFiles] = useState(files && _.isArray(files.joark) ? files.joark : [])

  const onLocalFileChange = (changedFiles) => {
    setLocalFiles(changedFiles)
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
    <div className='a-buc-c-sedattachments__step1'>
      <JoarkBrowser
        {...props}
        mode={mode}
        files={localFiles}
        onFilesChange={onLocalFileChange}
      />
      <div className='mt-4'>
        {mode === 'view' ? (
          <Nav.Hovedknapp
            disabled={_.isEmpty(localFiles)}
            id='a-buc-sedbody__upload-button-id'
            className='a-buc-sedbody__upload-button'
            onClick={() => setMode('confirm')}
          >
            {t('buc:form-addSelectedAttachments')}
          </Nav.Hovedknapp>
        ) : null}
        {mode === 'confirm' ? (
          <>
            <Nav.Hovedknapp
              disabled={_.isEmpty(localFiles)}
              id='a-buc-sedbody__submit-button-id'
              className='a-buc-sedbody__submit-button mr-2'
              onClick={() => onSubmitJoarkFiles(localFiles)}
            >
              {t('buc:form-submitSelectedAttachments')}
            </Nav.Hovedknapp>
            <Nav.Knapp
              id='a-buc-sedbody__cancel-button-id'
              className='a-buc-sedbody__cancel-button'
              onClick={() => setMode('view')}
            >
              {t('buc:form-selectAgainAttachments')}
            </Nav.Knapp>
          </>
        ) : null}
      </div>
    </div>
  )
}

AttachmentStep1.propTypes = {
  files: PT.object.isRequired,
  onSubmit: PT.func,
  t: PT.func.isRequired
}

export default AttachmentStep1
