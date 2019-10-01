import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import { Nav } from 'eessi-pensjon-ui'

export const AttachmentStep1 = (props) => {
  const { t, files, setFiles } = props

  const onFileChange = (changedFiles, namespace) => {
    setFiles({
      ...files,
      [namespace]: changedFiles
    })
  }

  const onJoarkFilesChange = (joarkFiles) => {
    onFileChange(joarkFiles, 'joark')
  }

  return (
    <div className='a-buc-c-sedattachments__step1'>
      <Nav.Undertittel className='mt-4 mb-3'>
        {t('buc:form-addAttachmentsFromJOARK')}
      </Nav.Undertittel>
      <JoarkBrowser
        {...props}
        files={files && _.isArray(files.joark) ? files.joark : []}
        onFilesChange={onJoarkFilesChange}
      />
    </div>
  )
}

AttachmentStep1.propTypes = {
  t: PT.func.isRequired,
  files: PT.object.isRequired,
  setFiles: PT.func.isRequired
}

export default AttachmentStep1
