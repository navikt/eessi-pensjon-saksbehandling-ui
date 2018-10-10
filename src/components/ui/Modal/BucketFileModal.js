import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import { translate } from 'react-i18next';

import * as Nav from '../Nav';
import * as uiActions from '../../../actions/ui';

import './BucketFileModal.css';

const mapStateToProps = (state) => {
    return {
        modalBucketOpen       : state.ui.modalBucketOpen,
        modalBucketOptions    : state.ui.modalBucketOptions,
        bucketFiles           : state.ui.bucketFiles,
        bucketFile            : state.ui.bucketFile,
        loadingBucketFileList : state.loading.loadingBucketFileList,
        loadingBucketFile     : state.loading.loadingBucketFile
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, uiActions), dispatch)};
};

class BucketFileModal extends Component {

    state = {
        fileSelected : undefined
    }

    componentDidUpdate() {

        const { modalBucketOpen, bucketFiles, bucketFile, modalBucketOptions, loadingBucketFileList, actions } = this.props;
        const { fileSelected } = this.state;

        if (modalBucketOpen && !bucketFiles && !loadingBucketFileList) {
            actions.listBucketFiles();
        }

        if (modalBucketOptions && bucketFile && typeof modalBucketOptions.onFileSelected === 'function') {
            modalBucketOptions.onFileSelected(fileSelected, bucketFile);
            actions.closeBucketFileModal();
        }
    }

    onCancelClick() {

        const { actions } = this.props;

        actions.closeBucketFileModal();
    }

    onOkClick() {

        const { actions } = this.props;
        const { fileSelected } = this.state;

        actions.getBucketFile(fileSelected);
    }

    onSelectFile(file, e) {

        e.preventDefault();

        this.setState({
            fileSelected : file
        })
    }

    render() {

        const { t, className, loadingBucketFileList, loadingBucketFile, bucketFiles, modalBucketOpen } = this.props;
        const { fileSelected } = this.state;

        return <Nav.Modal className='c-ui-bucketFileModal'
            isOpen={modalBucketOpen}
            onRequestClose={this.onCancelClick.bind(this)}
            closeButton={false}
            contentLabel='contentLabel'>
            <div className='m-3 text-center'><h4>{t('fileSelect')}</h4></div>
            {loadingBucketFileList ? <div className={classNames('text-center', className)}>
                <Nav.NavFrontendSpinner/>
                <p>{t('ui:loading')}</p>
            </div> : (bucketFiles ? <div className={classNames('fileList', className)}>
                {bucketFiles.map((file, index) => {
                    let selected = fileSelected && fileSelected.name === file.name;
                    let loading = loadingBucketFile && selected;
                    return <a key={index} className={classNames('file', {selected : selected})}
                        href='#' onClick={this.onSelectFile.bind(this, file)}>{file.name} {loading ? <Nav.NavFrontendSpinner/> : null}</a>
                })}
            </div> : null
            )}
            <div className='text-center'>
                <Nav.Hovedknapp disabled={fileSelected === undefined}
                    className='mr-3 mb-3 modal-main-button'
                    onClick={this.onOkClick.bind(this)}>
                    {t('yes') + ', ' + t('open')}
                </Nav.Hovedknapp>
                <Nav.Knapp
                    className='mr-3 mb-3 modal-other-button'
                    onClick={this.onCancelClick.bind(this)}>
                    {t('no') + ', ' + t('cancel')}
                </Nav.Knapp>
            </div>
        </Nav.Modal>

    }
}

BucketFileModal.propTypes = {
    t                     : PT.func.isRequired,
    className             : PT.object,
    actions               : PT.object.isRequired,
    bucketFiles           : PT.array,
    loadingBucketFileList : PT.bool,
    modalBucketOpen       : PT.bool,
    modalBucketOptions    : PT.object,
    bucketFile            : PT.object,
    loadingBucketFile     : PT.bool
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(BucketFileModal)
);
