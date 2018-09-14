/* global window, Uint8Array */

import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import Dropzone from 'react-dropzone';
import _ from 'lodash';
import classNames from 'classnames';

import File from '../File/File';
import './FileUpload.css';

class FileUpload extends Component {

    constructor(props){
        super(props);
        this.state = {
            files: []
        }
        this.validate = this.validate.bind(this)
    }

/*    state = {
        files: []
    };*/

    validate(e) {
        this.props.action(e);
        console.log(e);
        this.state.files.length > 0?
            this.props.onValid():
            this.props.onInvalid();
    }

    componentDidMount() {
        this.setState({
            files: this.props.files || [],
            currentPages: this.props.currentPages || [],
            status: undefined,
            validate: this.validate
        });
    }

    componentDidUpdate() {
        if (!_.isEmpty(this.props.files) && (!(this.state.currentPages) || _.isEmpty(this.state.currentPages))) {
            let currentPages = []
            for (var i in this.props.files) {
                currentPages[i] = 1;
            }

            this.setState({
                currentPages: currentPages
            });
        }
    }

    updateFiles(newFiles, newCurrentPages, status) {

        const onFileChange = this.props.onFileChange? this.props.onFileChange: this.validate;

        return new Promise((resolve) => {

            this.setState({
                files: newFiles,
                currentPages : newCurrentPages,
                status: (status ? status : this.state.status)
            }, () => {
                if (onFileChange) {
                    onFileChange(newFiles);
                }
                resolve()
            });
        });
    }

    async onDrop(acceptedFiles, rejectedFiles) {

        const { beforeDrop, afterDrop } = this.props;

        if (beforeDrop) {
            beforeDrop();
        }

        await this.processFiles(acceptedFiles, rejectedFiles);

        if (afterDrop) {
            afterDrop();
        }
    }

    processFiles(acceptedFiles, rejectedFiles) {

        const { t } = this.props;

        return new Promise((resolve) => {

            let loadingStatus = Array(acceptedFiles.length).fill().map(() => {return false});

            acceptedFiles.forEach((file, index) => {

                const reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onloadend = async (e) => {
                    let blob = new Uint8Array(e.target.result);

                    var len = blob.byteLength;
                    var x = '';
                    for (var i = 0; i < len; i++) {
                        x += String.fromCharCode( blob[i] );
                    }
                    let base64 = window.btoa(x);

                    let newFiles = _.clone(this.state.files);
                    let newCurrentPages = _.clone(this.state.currentPages);

                    newFiles.push({
                        'base64' : base64,
                        'data'   : blob,
                        'size'   : file.size,
                        'name'   : file.name
                    });
                    newCurrentPages[newCurrentPages.length] = 1;

                    let status = t('ui:accepted') + ': ' + acceptedFiles.length + ', ';
                    status += t('ui:rejected') + ': ' + rejectedFiles.length + ', ';
                    status += t('ui:total') + ': ' + newFiles.length;

                    await this.updateFiles(newFiles, newCurrentPages, status);

                    loadingStatus[index] = true;
                    let ok = true;
                    for (i in loadingStatus) {
                        ok = ok && loadingStatus[i];
                    }
                    if (ok) {
                        resolve();
                    }
                }
                reader.onerror = error => {console.log(error)};
            });
        });
    }

    async removeFile(fileIndex) {

        const { t } = this.props;

        let newFiles = _.clone(this.state.files);
        let newCurrentPages = _.clone(this.state.currentPages);

        newFiles.splice(fileIndex, 1);
        newCurrentPages.splice(fileIndex, 1);

        let filename = this.state.files[fileIndex].name;
        let status = t('ui:removed') + ' ' + filename;

        await this.updateFiles(newFiles,newCurrentPages, status);
    }

    async onLoadSuccess(index, event) {

        if (index !== undefined && event && event.numPages) {

            let newFiles = _.clone(this.state.files);
            newFiles[index].numPages = event.numPages;

            await this.updateFiles(newFiles, this.state.currentPages);
        }
    }

    onPreviousPageRequest(fileIndex) {

        let newCurrentPages = _.clone(this.state.currentPages);
        newCurrentPages[fileIndex] = newCurrentPages[fileIndex] - 1;
        this.setState({currentPages: newCurrentPages});
    }

    onNextPageRequest(fileIndex) {

        let newCurrentPages = _.clone(this.state.currentPages);
        newCurrentPages[fileIndex] = newCurrentPages[fileIndex] + 1;
        this.setState({currentPages: newCurrentPages});
    }

    render() {

        const { t, accept, className } = this.props;
        const { files, currentPages, status } = this.state;

        return <div className={classNames('nav-fileUpload div-dropzone', className)} length={this.state.files.length}>
            <Dropzone className='dropzone p-2' activeClassName='dropzone-active' accept={accept} onDrop={this.onDrop.bind(this)} inputProps={{...this.props.inputProps}}>
                <div className='dropzone-placeholder'>
                    <div className='dropzone-placeholder-message'>{t('ui:dropFilesHere')}</div>
                    <div className='dropzone-placeholder-status'>{status}</div>
                </div>
                <div className='dropzone-files scrollable'>
                    { files ? files.map((file, i) => {
                        return <File className='mr-2' key={i} file={file}
                            currentPage={currentPages[i]}
                            deleteLink={true} downloadLink={true}
                            onPreviousPage={this.onPreviousPageRequest.bind(this, i)}
                            onNextPage={this.onNextPageRequest.bind(this, i)}
                            onLoadSuccess={this.onLoadSuccess.bind(this, i)}
                            onDeleteDocument={this.removeFile.bind(this, i)}
                        />
                    }) : null }
                </div>
            </Dropzone>
        </div>
    }
}

FileUpload.propTypes = {
    t            : PT.func.isRequired,
    onFileChange : PT.func.isRequired,
    files        : PT.array.isRequired,
    currentPages : PT.array,
    accept       : PT.string,
    className    : PT.string,
    beforeDrop   : PT.func,
    afterDrop    : PT.func,
    validate     : PT.func
};

export default translate()(FileUpload);
