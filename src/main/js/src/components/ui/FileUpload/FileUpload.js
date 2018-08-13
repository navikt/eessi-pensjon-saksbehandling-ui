/* global window, Uint8Array */

import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import Dropzone from 'react-dropzone';
import _ from 'lodash';
import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import MiniaturePDF from '../File/MiniaturePDF';
import MiniatureOther from '../File/MiniatureOther';
import './FileUpload.css';

class FileUpload extends Component {

    state = {};

    componentDidMount() {
        this.setState({
            files: this.props.files || [],
            status: undefined
        });
    }

    updateFiles(newFiles, status) {

        const { onFileChange } = this.props;

        return new Promise((resolve) => {

            this.setState({
                files: newFiles,
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
                    let base64 = window.btoa(blob.reduce((data, byte) => {
                        return data + String.fromCharCode(byte);
                    }));
                    let newFiles = _.clone(this.state.files);

                    newFiles.push({
                        'base64' : base64,
                        'data' : blob,
                        'size' : file.size,
                        'name' : file.name
                    });

                    let status = t('ui:accepted') + ': ' + acceptedFiles.length + ', ';
                    status += t('ui:rejected') + ': ' + rejectedFiles.length + ', ';
                    status += t('ui:total') + ': ' + (this.state.files.length + acceptedFiles.length);

                    await this.updateFiles(newFiles, status);

                    loadingStatus[index] = true;
                    let ok = true;
                    for (var i in loadingStatus) {
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

    async removeFile(fileIndex, e) {

        const { t } = this.props;

        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        let newFiles = _.clone(this.state.files);
        newFiles.splice(fileIndex, 1);
        let filename = this.state.files[fileIndex].name;
        let status = t('ui:removed') + ' ' + filename;

        await this.updateFiles(newFiles, status);
    }

    async onLoadSuccess(index, event) {

        if (index !== undefined && event && event.numPages) {

            let newFiles = _.clone(this.state.files);
            newFiles[index].numPages = event.numPages;

            await this.updateFiles(newFiles);
        }
    }

    render() {

        const { t, accept, className } = this.props;

        return <div className={classNames('div-dropzone', className)}>
            <Dropzone className='dropzone' activeClassName='dropzone-active' accept={accept} onDrop={this.onDrop.bind(this)}>
                <div className='dropzone-placeholder'>
                    <div className='dropzone-placeholder-message'>{t('ui:dropFilesHere')}</div>
                    <div className='dropzone-placeholder-status'>{this.state.status}</div>
                </div>
                <div className='dropzone-files scrollable'>
                    <TransitionGroup className='dropzone-files-transition'>
                        { this.state.files ? this.state.files.map((file, i) => {
                            if (_.endsWith(file.name, '.pdf')) {
                                return <CSSTransition key={i} classNames='fileUploadFile' timeout={500}>
                                    <MiniaturePDF key={i} pdf={file}
                                        deleteLink={true} downloadLink={true}
                                        onLoadSuccess={this.onLoadSuccess.bind(this, i)}
                                        onDeleteDocument={this.removeFile.bind(this, i)}
                                    />
                                </CSSTransition>
                            } else {
                                return <CSSTransition key={i} classNames='fileUploadFile' timeout={500}>
                                    <MiniatureOther key={i} file={file}
                                        onDeleteDocument={this.removeFile.bind(this, i)}/>
                                </CSSTransition>
                            }
                        }) : null }
                    </TransitionGroup>
                </div>
            </Dropzone>
        </div>
    }
}

FileUpload.propTypes = {
    t            : PT.func.isRequired,
    onFileChange : PT.func.isRequired,
    initialFiles : PT.object,
    files        : PT.array.isRequired,
    accept       : PT.string,
    className    : PT.string,
    beforeDrop   : PT.func,
    afterDrop    : PT.func
};

export default translate()(FileUpload);
