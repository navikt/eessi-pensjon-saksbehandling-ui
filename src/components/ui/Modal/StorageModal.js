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
        fileSelected       : undefined,
        saveTargetFileName : undefined,
        lastAction         : undefined,
        status             : undefined
    }

    static getDerivedStateFromProps(newProps, oldState) {

        const { t } = newProps;

        if (newProps.savingStorageFile && !oldState.lastAction) {
            return {
                lastAction : 'save',
                status : t('saving')
            }
        }
        if (newProps.loadingStorageFile && !oldState.lastAction) {
            return {
                lastAction : 'load',
                status : t('loading')
            }
        }
        if (newProps.deletingStorageFile && !oldState.lastAction) {
            return {
                lastAction : 'delete',
                status: t('deleting')
            }
        }
        if (newProps.loadingStorageFileList && !oldState.lastAction && !newProps.fileList) {
            return {
                lastAction : 'list',
                status: t('loading')
            }
        }
    }

    componentDidUpdate() {

        const { t, username, modalStorageOpen, fileList, fileLoaded, savingStorageFile, deletingStorageFile, modalStorageOptions, loadingStatus, loadingStorageFileList, actions } = this.props;
        const { fileSelected, lastAction} = this.state;


        if (modalStorageOpen) {

            if (!fileList && !loadingStorageFileList && loadingStatus !== 'ERROR') {
                actions.listStorageFiles(username);
            }

            if (lastAction === 'delete' && !deletingStorageFile) {

                this.setState({
                    lastAction : undefined,
                    status : t('deleted')
                });
            }

            if (lastAction === 'save' && !savingStorageFile) {

                this.setState({
                    lastAction : undefined,
                    status : t('saved')
                }, () => {
                    actions.closeStorageModal();
                });
            }

            if (lastAction === 'list' && fileList) {
                let newStatus = '';
                if (!_.isEmpty(fileList)) {
                    newStatus = t('found') + ' ' + fileList.length + ' ' + t(fileList.length === 1 ? 'file' : 'files').toLowerCase()
                } else {
                    newStatus = t('noFilesFound')
                }
                this.setState({
                    lastAction : undefined,
                    status     : newStatus,
                });
            }

            if (lastAction === 'load' && fileLoaded) {

                this.setState({
                    lastAction : undefined,
                    status : t('loaded')
                }, () => {
                    modalStorageOptions.onFileSelected(fileSelected, fileLoaded);
                    actions.closeStorageModal();
                });
            }
        }
    }

    onCancelClick() {

        const { actions } = this.props;

        actions.closeStorageModal();
    }

    onOkClick() {

        const { username, actions, modalStorageOptions } = this.props;
        const { fileSelected, saveTargetFileName } = this.state;

        if (modalStorageOptions.action === 'open') {
            actions.getStorageFile(username, fileSelected);
            this.setState({
                fileSelected : undefined
            });
        }
        if (modalStorageOptions.action === 'save') {
            let targetFile = fileSelected || saveTargetFileName;
            actions.postStorageFile(username, targetFile, modalStorageOptions.content);
        }
    }

    onSelectFile(file, e) {

        e.preventDefault();

        this.setState({
            fileSelected : file
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
            loadingStatus, fileList, fileToDelete, modalStorageOpen, modalStorageOptions } = this.props;
        const { fileSelected, saveTargetFileName } = this.state;

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
                        (fileList ? (!_.isEmpty(fileList) ? fileList.map((file, index) => {

                            let selected = fileSelected && fileSelected === file;
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
                        }) : null) : null)
                    }
                </div>

                {modalStorageOptions && modalStorageOptions.action === 'save' ? <div>
                    <Nav.Input label={t('filename')} value={saveTargetFileName || ''} onChange={this.setSaveTargetFileName.bind(this)}/>
                </div> : null}

                <div className='statusArea'>
                    {this.state.status}
                </div>

                <div className='buttonArea'>
                    {enableButtons ? <React.Fragment>
                        <Nav.Hovedknapp
                            className='mr-3 mb-3 modal-main-button'
                            disabled={modalStorageOptions.action === 'open' && fileSelected === undefined}
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
    userrole              : PT.string
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(StorageModal)
);
