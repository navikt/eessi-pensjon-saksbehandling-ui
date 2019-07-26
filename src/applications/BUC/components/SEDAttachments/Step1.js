import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import { Undertittel } from 'components/Nav'

const Step1 = (props) => {
  const { t, files, setFiles } = props

  const handleFileChange = (changedFiles, key) => {
    let newFiles = _.cloneDeep(files)
    newFiles[key] = changedFiles
    setFiles(newFiles)
  }

  const getFiles = (key) => {
    if (files.hasOwnProperty(key)) {
      return (files[key])
    }
    return []
  }

  const handleJoarkFilesChange = (joarkFiles) => {
    handleFileChange(joarkFiles, 'joark')
  }

  return <div className='a-buc-c-sedattachments-step1'>
    <Undertittel className='mt-4 mb-3'>{t('buc:form-addAttachmentsFromJOARK')}</Undertittel>
    <JoarkBrowser
      {...props}
      files={getFiles('joark')}
      onFilesChange={handleJoarkFilesChange} />
  </div>
}

Step1.propTypes = {
  actions: PT.object,
  t: PT.func.isRequired,
  setFiles: PT.func.isRequired
}

export default Step1
