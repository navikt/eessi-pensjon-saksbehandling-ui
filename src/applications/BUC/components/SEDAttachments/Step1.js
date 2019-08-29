import React from 'react'
import PT from 'prop-types'
import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import { Undertittel } from 'components/Nav'

export const Step1 = (props) => {
  const { t, files, setFiles } = props

  const handleFileChange = (changedFiles, key) => {
    setFiles({
      ...files,
      [key]: changedFiles
    })
  }

  const handleJoarkFilesChange = (joarkFiles) => {
    handleFileChange(joarkFiles, 'joark')
  }

  return (
    <div className='a-buc-c-sedattachments__step1'>
      <Undertittel className='mt-4 mb-3'>{t('buc:form-addAttachmentsFromJOARK')}</Undertittel>
      <JoarkBrowser
        {...props}
        files={files ? files.joark : []}
        onFilesChange={handleJoarkFilesChange}
      />
    </div>
  )
}

Step1.propTypes = {
  actions: PT.object,
  t: PT.func.isRequired,
  setFiles: PT.func.isRequired
}

export default Step1
