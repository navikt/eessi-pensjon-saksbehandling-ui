import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import JoarkBrowser from 'components/ui/JoarkBrowser/JoarkBrowser'
import FileUpload from 'components/ui/FileUpload/FileUpload'
import { Ingress, Hovedknapp } from 'components/ui/Nav'

const Step1 = (props) => {
  const { t, files, setFiles, setStep } = props

  const onEditButtonClick = () => {
    setStep('edit')
  }

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

  const handleFileUploadFileChange = (fileUploadFiles) => {
    handleFileChange(fileUploadFiles, 'fileupload')
  }

  const handleBeforeDrop = () => {
  }

  const handleAfterDrop = () => {
  }

  return <div>
    <Ingress className='mt-4 mb-3'>{t('buc:form-addAttachmentsFromJOARK')}</Ingress>
    <JoarkBrowser
      {...props}
      files={getFiles('joark')}
      onFilesChange={handleJoarkFilesChange} />
    <Ingress className='mt-4 mb-3'>{t('buc:form-addAttachmentsFromFileUpload')}</Ingress>
    <FileUpload t={t}
      fileUploadDroppableId={'SEDAttachments'}
      id={classNames('a-buc-c-sedattachments-fileupload-id', 'mb-3')}
      className={classNames('fileUpload', 'mb-3')}
      accept={['application/pdf', 'image/jpeg', 'image/png']}
      files={files.hasOwnProperty('fileupload') ? files['fileupload'] : []}
      beforeDrop={handleBeforeDrop}
      afterDrop={handleAfterDrop}
      onFileChange={handleFileUploadFileChange} />
    <Hovedknapp
      id='a-buc-c-sedattachmnents__edit-button-id'
      className='a-buc-c-sedattachmnents__edit-button'
      onClick={onEditButtonClick}>
      {t('ui:edit')}
    </Hovedknapp>
  </div>
}

Step1.propTypes = {
  actions: PT.object,
  t: PT.func.isRequired,
  setFiles: PT.func.isRequired
}

export default Step1
