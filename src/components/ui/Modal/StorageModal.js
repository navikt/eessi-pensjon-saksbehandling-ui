import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import { translate } from 'react-i18next';
import _ from 'lodash';

import * as Nav from '../Nav';
import ClientAlert from '../Alert/ClientAlert';
import * as storageActions from '../../../actions/storage';
import * as uiActions from '../../../actions/ui';

import './StorageModal.css';

const mapStateToProps = (state) => {
    return {
        username               : state.app.username,
        userrole               : state.app.userrole,
        modalStorageOpen       : state.ui.modalStorageOpen,
        modalStorageOptions    : state.ui.modalStorageOptions,
        fileList               : state.storage.fileList,
        fileLoaded             : state.storage.fileLoaded,
        fileToDelete           : state.storage.fileToDelete,
        loadingStorageFileList : state.loading.loadingStorageFileList,
        loadingStorageFile     : state.loading.loadingStorageFile,
        savingStorageFile      : state.loading.savingStorageFile,
        deletingStorageFile    : state.loading.deletingStorageFile,
        loadingStatus          : state.loading.status
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, uiActions, storageActions), dispatch)};
};

class StorageModal extends Component {

    state = {
        currentSelectedFile : undefined,
        saveTargetFileName  : undefined,
        lastAction          : undefined,
        lastActionSubject   : undefined,
        status              : undefined
    }

    static getDerivedStateFromProps(newProps, oldState) {

        if (!oldState.lastAction) {
            if (newProps.savingStorageFile) {
                return {
                    lastAction : 'save',
                    status : newProps.t('saving') + ' ' + oldState.saveTargetFileName + '...',
                    lastActionSubject : oldState.saveTargetFileName
                }
            }
            if (newProps.loadingStorageFile) {
                return {
                    lastAction : 'load',
                    status : newProps.t('loading') + ' ' + oldState.currentSelectedFile + '...',
                    lastActionSubject : oldState.currentSelectedFile
                }
            }
            if (newProps.deletingStorageFile) {
                return {
                    lastAction : 'delete',
                    status: newProps.t('deleting') + ' ' + newProps.fileToDelete + '...',
                    lastActionSubject : newProps.fileToDelete
                }
            }
            if (newProps.loadingStorageFileList && !newProps.fileList) {
                return {
                    lastAction : 'list',
                    status: newProps.t('listing') + '...'
                }
            }
        }
    }

    componentDidUpdate() {

        const { t, username, modalStorageOpen, fileList, fileLoaded, savingStorageFile, deletingStorageFile, modalStorageOptions, loadingStatus, loadingStorageFileList, actions } = this.props;
        const { currentSelectedFile, lastAction} = this.state;

        if (!modalStorageOpen) {
            return;
        }

        if (!fileList && !loadingStorageFileList && loadingStatus !== 'ERROR') {
            actions.listStorageFiles(username);
        }

        if (lastAction === 'delete' && !deletingStorageFile) {

            this.setState({
                lastAction : undefined,
                status : t('deleted') + ' ' + this.state.lastActionSubject,
                lastActionSubject : undefined
            });
        }

        if (lastAction === 'save' && !savingStorageFile) {

            this.setState({
                lastAction : undefined,
                status : t('saved') + ' ' + this.state.lastActionSubject,
                lastActionSubject : undefined,
                saveTargetFileName : ''
            }, () => {
                actions.closeStorageModal();
            });
        }

        if (lastAction === 'list' && fileList) {

            let newStatus = _.isEmpty(fileList) ?
                t('noFilesFound') :
                t('found') + ' ' + fileList.length + ' ' + t(fileList.length === 1 ? 'file' : 'files').toLowerCase();

            this.setState({
                lastAction : undefined,
                status     : newStatus,
            });
        }

        if (lastAction === 'load' && fileLoaded) {

            this.setState({
                lastAction : undefined,
                status : t('loaded') + ' ' + this.state.lastActionSubject,
                lastActionSubject : undefined,
                currentSelectedFile : undefined
            }, () => {
                modalStorageOptions.onFileSelected(currentSelectedFile, fileLoaded);
                actions.closeStorageModal();
            });
        }
    }

    onCancelClick() {

        const { actions } = this.props;

        actions.closeStorageModal();
    }

    onOkClick() {

        const { username, actions, modalStorageOptions } = this.props;
        const { currentSelectedFile, saveTargetFileName } = this.state;

        if (modalStorageOptions.action === 'open') {
            actions.getStorageFile(username, currentSelectedFile);
        }
        if (modalStorageOptions.action === 'save') {

            let targetFileName = saveTargetFileName.substring(saveTargetFileName.lastIndexOf('/') + 1);
            targetFileName = username + '/' + targetFileName;

            actions.postStorageFile(username, targetFileName, modalStorageOptions.content);
        }
    }

    onSelectFile(file, e) {

        e.preventDefault();

        this.setState({
            currentSelectedFile : file,
            saveTargetFileName  : file
        });
    }

    areYouSureDeleteFile(file, e) {

        e.preventDefault();
        const { actions } = this.props;

        actions.setTargetFileToDelete(file);
    }

    cancelDeleteFile(e) {

        e.preventDefault();
        const { actions } = this.props;

        actions.cancelTargetFileToDelete();
    }

    onDeleteFile(e) {

        e.preventDefault();
        const { username, actions, fileToDelete } = this.props;

        actions.deleteStorageFile(username, fileToDelete);
    }

    setSaveTargetFileName(e) {
        this.setState({
            saveTargetFileName : e.target.value
        });
    }

    render() {

        const { t, className, loadingStorageFileList, loadingStorageFile, deletingStorageFile,
            loadingStatus, fileList, fileToDelete, modalStorageOpen, modalStorageOptions, username } = this.props;
        const { currentSelectedFile, saveTargetFileName, status } = this.state;

        let enableButtons = (modalStorageOptions && modalStorageOptions.action !== undefined);

        return <Nav.Modal className='c-ui-storageModal'
            isOpen={modalStorageOpen}
            onRequestClose={this.onCancelClick.bind(this)}
            closeButton={false}
            contentLabel='contentLabel'>

            <div className='m-3 text-center'>

                <h4>{t('fileSelect')}</h4>
                <div className={classNames('body', className)}>

                    {loadingStorageFileList ?
                        <div className={classNames('text-center', className)}>
                            <Nav.NavFrontendSpinner/>
                            <p>{t('ui:loading')}</p>
                        </div> :
                        (fileList && !_.isEmpty(fileList) ? fileList.map((file, index) => {

                            let selected = currentSelectedFile && currentSelectedFile === file;
                            let loading = loadingStorageFile && selected;
                            let toDelete = fileToDelete === file;

                            return <div key={index} className={classNames('fileRow', {selected : selected})}>
                                <a className={classNames('fileName')}
                                    href='#select' onClick={this.onSelectFile.bind(this, file)}>{file} {loading ? <Nav.NavFrontendSpinner/> : null}</a>
                                {toDelete ?
                                    deletingStorageFile ?
                                        <div>
                                            <Nav.NavFrontendSpinner type='XS'/>
                                            <span>{t('deleting')}</span>
                                        </div>
                                        :
                                        <div className='areYouSure'>
                                            <span>{t('areYouSure')}</span>
                                            <a className='link yesLink' href='#delete' title={t('delete')}
                                                onClick={this.onDeleteFile.bind(this)}>{t('yes')}</a>
                                            <a className='link noLink' href='#cancel' title={t('cancel')}
                                                onClick={this.cancelDeleteFile.bind(this)}>{t('no')}</a>
                                        </div>
                                    :
                                    <a href='#areyousure' className='link deleteLink' title={t('delete')} onClick={this.areYouSureDeleteFile.bind(this, file)}>
                                        <Nav.Ikon size={15} kind='trashcan'/>
                                    </a>
                                }
                            </div>
                        }) : null)
                    }
                </div>

                {modalStorageOptions && modalStorageOptions.action === 'save' ? <div>
                    <label>{username + '/'}</label>
                    <Nav.Input label={t('filename')} value={saveTargetFileName || ''}
                        onChange={this.setSaveTargetFileName.bind(this)}/>
                </div> : null}

                <div className='statusArea'>{status}</div>

                <div className='buttonArea'>
                    {enableButtons ? <React.Fragment>
                        <Nav.Hovedknapp
                            className='mr-3 mb-3 modal-main-button'
                            disabled={modalStorageOptions.action === 'open' && currentSelectedFile === undefined}
                            onClick={this.onOkClick.bind(this)}>
                            {t(modalStorageOptions.action)}
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
                <ClientAlert/>
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
    t                     : PT.func.isRequired,
    className             : PT.object,
    actions               : PT.object.isRequired,
    fileList              : PT.array,
    fileLoaded            : PT.object,
    fileToDelete          : PT.object,
    savingStorageFile     : PT.bool,
    deletingStorageFile   : PT.bool,
    loadingStatus         : PT.string,
    loadingStorageFile    : PT.bool,
    loadingStorageFileList: PT.bool,
    modalStorageOpen      : PT.bool,
    modalStorageOptions   : PT.object,
    username              : PT.string,
    userrole              : PT.string,
    type                  : PT.string.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(StorageModal)
);
