/* global window, Uint8Array */

import React, { Component } from 'react'
import PT from 'prop-types'
import Dropzone from 'react-dropzone'
import _ from 'lodash'
import classNames from 'classnames'
import bytes from 'bytes'

import File from 'components/File/File'

import './FileUpload.css'

class FileUpload extends Component {
    state = {
      files: [],
      currentPages: [],
      id: undefined,
      status: {}
    }

    static getDerivedStateFromProps (newProps, oldState) {
      if (newProps.id !== oldState.id) {
        return {
          id: newProps.id,
          files: newProps.files,
          currentPages: newProps.files && newProps.files.length > 0 ? Array(newProps.files.length).fill().map(() => { return 1 }) : []
        }
      }
      return null
    }

    componentDidMount () {
      this.setState({
        files: this.props.files || [],
        currentPages: this.props.currentPages || []
      })
    }

    componentDidUpdate () {
      if (!_.isEmpty(this.props.files) && (!(this.state.currentPages) || _.isEmpty(this.state.currentPages))) {
        const currentPages = []
        for (var i in this.props.files) {
          currentPages[i] = 1
        }
        this.setState({
          currentPages: currentPages
        })
      }
    }

    closePreview () {
      const { closeModal } = this.props

      closeModal()
    }

    openPreview (file, pageNumber) {
      const { t, openModal } = this.props

      openModal({
        modalContent: <div style={{ cursor: 'pointer' }} onClick={this.closePreview.bind(this)}>
          <File t={t} file={file} width={400} height={600} pageNumber={pageNumber} />
        </div>
      })
    }

    updateFiles (newFiles, newCurrentPages, statusMessage) {
      const { onFileChange } = this.props

      return new Promise((resolve) => {
        this.setState({
          files: newFiles,
          currentPages: newCurrentPages,
          status: {
            message: (statusMessage || this.state.status.message),
            type: 'OK'
          }
        }, () => {
          if (onFileChange) {
            onFileChange(newFiles)
          }
          resolve()
        })
      })
    }

    async onDrop (acceptedFiles, rejectedFiles) {
      const { t, beforeDrop, afterDrop, maxFiles } = this.props
      const { files } = this.state

      if (beforeDrop) {
        beforeDrop()
      }

      if (maxFiles && (files.length + acceptedFiles.length > maxFiles)) {
        return this.setState({
          status: {
            message: t('ui:maxFilesExceeded', { maxFiles: maxFiles }),
            type: 'ERROR'
          }
        })
      }

      await this.processFiles(acceptedFiles, rejectedFiles)

      if (afterDrop) {
        afterDrop()
      }
    }

    onDropRejected (rejectedFiles) {
      const { t, maxFileSize } = this.props

      if (maxFileSize && rejectedFiles[0].size > maxFileSize) {
        this.setState({
          status: {
            message: t('ui:fileIsTooBigLimitIs', {
              maxFileSize: bytes(maxFileSize),
              size: bytes(rejectedFiles[0].size),
              file: rejectedFiles[0].name
            }),
            type: 'ERROR'
          }
        })
      }
    }

    processFiles (acceptedFiles, rejectedFiles) {
      const { t } = this.props

      return new Promise((resolve) => {
        const loadingStatus = Array(acceptedFiles.length).fill().map(() => { return false })

        acceptedFiles.forEach((file, index) => {
          const reader = new FileReader()
          reader.readAsArrayBuffer(file)
          reader.onloadend = async (e) => {
            const blob = new Uint8Array(e.target.result)

            var len = blob.byteLength
            var x = ''
            for (var i = 0; i < len; i++) {
              x += String.fromCharCode(blob[i])
            }
            const base64 = window.btoa(x)

            const newFiles = _.clone(this.state.files)
            const newCurrentPages = _.clone(this.state.currentPages)

            newFiles.push({
              size: file.size,
              name: file.name,
              mimetype: file.type,
              content: {
                base64: base64
              }
            })
            newCurrentPages[newCurrentPages.length] = 1

            let statusMessage = t('ui:accepted') + ': ' + acceptedFiles.length + ', '
            statusMessage += t('ui:rejected') + ': ' + rejectedFiles.length + ', '
            statusMessage += t('ui:total') + ': ' + newFiles.length

            await this.updateFiles(newFiles, newCurrentPages, statusMessage)

            loadingStatus[index] = true
            let ok = true
            for (i in loadingStatus) {
              ok = ok && loadingStatus[i]
            }
            if (ok) {
              resolve()
            }
          }
          reader.onerror = error => { console.log(error) }
        })
      })
    }

    async addFile (file) {
      const { t } = this.props

      const newFiles = _.clone(this.state.files)
      const newCurrentPages = _.clone(this.state.currentPages)

      newFiles.push(file)
      newCurrentPages.push(file.numPages)

      const statusMessage = t('ui:added') + ' ' + file.name
      await this.updateFiles(newFiles, newCurrentPages, statusMessage)
    }

    async removeFile (fileIndex) {
      const { t } = this.props

      const newFiles = _.clone(this.state.files)
      const newCurrentPages = _.clone(this.state.currentPages)

      newFiles.splice(fileIndex, 1)
      newCurrentPages.splice(fileIndex, 1)

      const filename = this.state.files[fileIndex].name
      const statusMessage = t('ui:removed') + ' ' + filename
      await this.updateFiles(newFiles, newCurrentPages, statusMessage)
    }

    async onLoadSuccess (index, event) {
      if (index !== undefined && event && event.numPages) {
        const newFiles = _.clone(this.state.files)
        newFiles[index].numPages = event.numPages
        await this.updateFiles(newFiles, this.state.currentPages)
      }
    }

    onPreviousPageRequest (fileIndex) {
      const newCurrentPages = _.clone(this.state.currentPages)
      newCurrentPages[fileIndex] = newCurrentPages[fileIndex] - 1
      this.setState({ currentPages: newCurrentPages })
    }

    onNextPageRequest (fileIndex) {
      const newCurrentPages = _.clone(this.state.currentPages)
      newCurrentPages[fileIndex] = newCurrentPages[fileIndex] + 1
      this.setState({ currentPages: newCurrentPages })
    }

    render () {
      const { t, acceptedMimetypes, maxFileSize, className, maxFiles } = this.props
      const { files, currentPages, status } = this.state
      const tabIndex = this.props.tabIndex ? { tabIndex: this.props.tabIndex } : {}

      return <div className={classNames('c-fileUpload', 'dropzone', 'p-4', className)}>
        <Dropzone
          length={files.length}
          activeClassName='dropzone-active'
          accept={acceptedMimetypes}
          onDrop={this.onDrop.bind(this)}
          maxSize={maxFileSize}
          onDropRejected={this.onDropRejected.bind(this)}
          inputProps={{ ...this.props.inputProps }}
          {...tabIndex}>
          {({ getRootProps, getInputProps, isDragActive }) => <div
            {...getRootProps()}
            className={classNames('c-fileUpload-zone', { 'c-fileUpload-zone-active ': isDragActive })}>
            <input {...getInputProps()} />
            <div className='c-fileUpload-placeholder'>
              <div className='c-fileUpload-placeholder-message'>{t('ui:dropFilesHere', { maxFiles: maxFiles })}</div>
              <div className={classNames('c-fileUpload-placeholder-status', 'c-fileUpload-placeholder-status-' + status.type)}>{status.message}</div>
            </div>
            <div className='c-fileUpload-files scrollable'>
              { files ? files.map((file, i) => {
                return <File className='mr-2' key={i} file={file} t={t}
                  currentPage={currentPages[i]}
                  deleteLink downloadLink previewLink
                  onPreviousPage={this.onPreviousPageRequest.bind(this, i)}
                  onNextPage={this.onNextPageRequest.bind(this, i)}
                  onLoadSuccess={this.onLoadSuccess.bind(this, i)}
                  onDeleteDocument={this.removeFile.bind(this, i)}
                  onPreviewDocument={this.openPreview.bind(this, file)}
                />
              }) : null }
            </div>
          </div>}
        </Dropzone>
      </div>
    }
}

FileUpload.propTypes = {
  t: PT.func.isRequired,
  id: PT.string.isRequired,
  onFileChange: PT.func.isRequired,
  files: PT.array.isRequired,
  currentPages: PT.array,
  acceptedMimetypes: PT.oneOfType([PT.string, PT.array]),
  className: PT.string,
  beforeDrop: PT.func,
  afterDrop: PT.func,
  active: PT.func,
  inactive: PT.func,
  inputProps: PT.object,
  openModal: PT.func.isRequired,
  closeModal: PT.func.isRequired,
  maxFiles: PT.number,
  maxFileSize: PT.number
}

export default FileUpload
