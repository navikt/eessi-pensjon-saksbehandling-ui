import React, { Component } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { translate } from 'react-i18next'
import _ from 'lodash'

import * as Nav from '../Nav'
import ClientAlert from '../Alert/ClientAlert'
import * as storageActions from '../../../actions/storage'
import * as uiActions from '../../../actions/ui'
import './StorageModal.css'

const mapStateToProps = (state) => {
  return {
    username: state.app.username,
    userRole: state.app.userRole,
    modalOpen: state.storage.modalOpen,
    modalOptions: state.storage.modalOptions,
    fileList: state.storage.fileList,
    file: state.storage.file,
    fileToDelete: state.storage.fileToDelete,
    loadingStorageFileList: state.loading.loadingStorageFileList,
    loadingStorageFile: state.loading.loadingStorageFile,
    savingStorageFile: state.loading.savingStorageFile,
    deletingStorageFile: state.loading.deletingStorageFile,
    loadingStatus: state.loading.status
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions, storageActions), dispatch) }
}

class StorageModal extends Component {
    state = {
      currentSelectedFile: undefined,
      saveTargetFileName: undefined,
      lastAction: undefined,
      lastActionSubject: undefined,
      status: undefined
    }

    static getDerivedStateFromProps (newProps, oldState) {
      if (!oldState.lastAction) {
        if (newProps.savingStorageFile) {
          return {
            lastAction: 'save',
            status: newProps.t('saving') + ' ' + oldState.saveTargetFileName + '...',
            lastActionSubject: oldState.saveTargetFileName
          }
        }
        if (newProps.loadingStorageFile) {
          return {
            lastAction: 'load',
            status: newProps.t('loading') + ' ' + oldState.currentSelectedFile + '...',
            lastActionSubject: oldState.currentSelectedFile
          }
        }
        if (newProps.deletingStorageFile) {
          return {
            lastAction: 'delete',
            status: newProps.t('deleting') + ' ' + newProps.fileToDelete + '...',
            lastActionSubject: newProps.fileToDelete
          }
        }
        if (newProps.loadingStorageFileList && !newProps.fileList) {
          return {
            lastAction: 'list',
            status: newProps.t('listing') + '...'
          }
        }
        if (newProps.modalOptions && newProps.modalOptions.name && !oldState.saveTargetFileName) {
          return {
            saveTargetFileName: newProps.modalOptions.name
          }
        }
      }
      return null
    }

    componentDidUpdate () {
      const { t, username, modalOpen, fileList, file,
        savingStorageFile, deletingStorageFile, modalOptions, loadingStatus,
        loadingStorageFileList, actions, namespace } = this.props
      const { lastAction } = this.state

      if (!modalOpen) {
        return
      }

      if (!fileList && !loadingStorageFileList && loadingStatus !== 'ERROR') {
        actions.listStorageFiles(username, namespace)
      }

      if (lastAction === 'delete' && !deletingStorageFile) {
        this.setState({
          lastAction: undefined,
          status: t('deleted') + ' ' + this.state.lastActionSubject,
          lastActionSubject: undefined
        })
      }

      if (lastAction === 'save' && !savingStorageFile) {
        this.setState({
          lastAction: undefined,
          status: t('saved') + ' ' + this.state.lastActionSubject,
          lastActionSubject: undefined,
          saveTargetFileName: ''
        }, () => {
          actions.closeStorageModal()
          window.scrollTo(0, 0)
        })
      }

      if (lastAction === 'list' && fileList) {
        let newStatus = _.isEmpty(fileList)
          ? t('noFilesFound')
          : t('found') + ' ' + fileList.length + ' ' + t(fileList.length === 1 ? 'file' : 'files').toLowerCase()

        this.setState({
          lastAction: undefined,
          status: newStatus
        })
      }

      if (lastAction === 'load' && file) {
        this.setState({
          lastAction: undefined,
          status: t('loaded') + ' ' + this.state.lastActionSubject,
          lastActionSubject: undefined,
          currentSelectedFile: undefined
        }, () => {
          modalOptions.onFileSelected(file)
          actions.closeStorageModal()
          window.scrollTo(0, 0)
        })
      }
    }

    onCancelClick () {
      const { actions } = this.props

      actions.closeStorageModal()
      window.scrollTo(0, 0)
    }

    saveStorageFile (username, namespace, saveTargetFileName, blob) {
      const { actions } = this.props

      actions.postStorageFile(username, namespace, saveTargetFileName, blob)
      actions.closeModal()
    }

    closeModal () {
      const { actions } = this.props

      actions.closeModal()
    }

    onOkClick () {
      const { t, username, actions, modalOptions, namespace, fileList } = this.props
      const { currentSelectedFile, saveTargetFileName } = this.state

      if (modalOptions.action === 'open') {
        actions.getStorageFile(username, namespace, currentSelectedFile)
      }

      if (modalOptions.action === 'save') {
        if (fileList.indexOf(saveTargetFileName) >= 0) {
          actions.openModal({
            modalTitle: t('overwriteFile'),
            modalText: t('areYouSureOverwriteFile', { file: saveTargetFileName }),
            modalButtons: [{
              main: true,
              text: t('ui:yes') + ', ' + t('overwrite').toLowerCase(),
              onClick: this.saveStorageFile.bind(this, username, namespace, saveTargetFileName, modalOptions.blob)
            }, {
              text: t('ui:no') + ', ' + t('ui:cancel').toLowerCase(),
              onClick: this.closeModal.bind(this)
            }]
          })
        } else {
          this.saveStorageFile(username, namespace, saveTargetFileName, modalOptions.blob)
        }
      }
    }

    onSelectFile (file, e) {
      e.preventDefault()

      this.setState({
        currentSelectedFile: file,
        saveTargetFileName: file,
        status: file
      })
    }

    areYouSureDeleteFile (file, e) {
      e.preventDefault()
      const { actions } = this.props

      actions.setTargetFileToDelete(file)
    }

    cancelDeleteFile (e) {
      e.preventDefault()
      const { actions } = this.props

      actions.cancelTargetFileToDelete()
    }

    onDeleteFile (e) {
      e.preventDefault()
      const { username, actions, fileToDelete, namespace } = this.props

      actions.deleteStorageFile(username, namespace, fileToDelete)
    }

    setSaveTargetFileName (e) {
      this.setState({
        saveTargetFileName: e.target.value
      })
    }

    render () {
      const { t, className, loadingStorageFileList, loadingStorageFile, deletingStorageFile,
        loadingStatus, fileList, fileToDelete, modalOpen, modalOptions } = this.props
      const { currentSelectedFile, saveTargetFileName, status } = this.state

      let enableButtons = (modalOptions && modalOptions.action !== undefined)
      let action = modalOptions ? modalOptions.action : undefined

      return <Nav.Modal className='c-ui-storageModal'
        ariaHideApp={false}
        isOpen={modalOpen}
        onRequestClose={this.onCancelClick.bind(this)}
        closeButton={false}
        contentLabel='contentLabel'>

        <div className='m-3 text-center'>

          <h4>{t(action + 'File')}</h4>
          <div className={classNames('body', className)}>

            {loadingStorageFileList
              ? <div className={classNames('text-center', className)}>
                <Nav.NavFrontendSpinner />
                <p>{t('ui:loading')}</p>
              </div>
              : (fileList && !_.isEmpty(fileList) ? fileList.map((file, index) => {
                let selected = currentSelectedFile && currentSelectedFile === file
                let loading = loadingStorageFile && selected
                let toDelete = fileToDelete === file

                return <div key={index} className={classNames('fileRow', { selected: selected })}>
                  { selected
                    ? <div className={classNames('fileName')}>{file} {loading ? <Nav.NavFrontendSpinner /> : null}</div>
                    : <a className={classNames('fileName')}
                      href='#select' onClick={this.onSelectFile.bind(this, file)}>{file} {loading ? <Nav.NavFrontendSpinner /> : null}</a>}
                  {toDelete
                    ? deletingStorageFile
                      ? <div>
                        <Nav.NavFrontendSpinner type='XS' />
                        <span>{t('deleting')}</span>
                      </div>
                      : <div className='areYouSure'>
                        <span>{t('areYouSure')}</span>
                        <a className='link yesLink' href='#delete' title={t('delete')}
                          onClick={this.onDeleteFile.bind(this)}>{t('yes')}</a>
                        <a className='link noLink' href='#cancel' title={t('cancel')}
                          onClick={this.cancelDeleteFile.bind(this)}>{t('no')}</a>
                      </div>
                    : <a href='#areyousure' className='link deleteLink' title={t('delete')} onClick={this.areYouSureDeleteFile.bind(this, file)}>
                      <Nav.Ikon size={15} kind='trashcan' />
                    </a>
                  }
                </div>
              }) : null)
            }
          </div>

          {modalOptions && modalOptions.action === 'save' ? <div>

            <Nav.Input placeholder={t('filename')} value={saveTargetFileName || ''}
              onChange={this.setSaveTargetFileName.bind(this)} />
          </div> : null}

          <div className='statusArea'>{status}</div>

          <div className='buttonArea'>
            {enableButtons ? <React.Fragment>
              <Nav.Hovedknapp
                className='mr-3 mb-3 modal-main-button'
                disabled={modalOptions.action === 'open' && currentSelectedFile === undefined}
                onClick={this.onOkClick.bind(this)}>
                {t(modalOptions.action)}
              </Nav.Hovedknapp>
              <Nav.Knapp
                className='mr-3 mb-3 modal-other-button'
                onClick={this.onCancelClick.bind(this)}>
                {t('cancel')}
              </Nav.Knapp>
            </React.Fragment> : null}
          </div>

        </div>

        { loadingStatus === 'ERROR' ? <div className={classNames('text-center', className)}>
          <ClientAlert fixed={false} />
          <Nav.Knapp
            className='mr-3 mb-3 modal-other-button'
            onClick={this.onCancelClick.bind(this)}>
            {t('close')}
          </Nav.Knapp>
        </div> : null }
      </Nav.Modal>
    }
}

StorageModal.propTypes = {
  t: PT.func.isRequired,
  className: PT.object,
  actions: PT.object.isRequired,
  fileList: PT.array,
  file: PT.object,
  fileToDelete: PT.object,
  savingStorageFile: PT.bool,
  deletingStorageFile: PT.bool,
  loadingStatus: PT.string,
  loadingStorageFile: PT.bool,
  loadingStorageFileList: PT.bool,
  modalOpen: PT.bool,
  modalOptions: PT.object,
  username: PT.string,
  userRole: PT.string,
  namespace: PT.string.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(StorageModal)
)
