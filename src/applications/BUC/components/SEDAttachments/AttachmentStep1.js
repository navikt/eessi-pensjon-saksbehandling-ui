import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'

export const AttachmentStep1 = (props) => {
  const { files, setFiles } = props

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
