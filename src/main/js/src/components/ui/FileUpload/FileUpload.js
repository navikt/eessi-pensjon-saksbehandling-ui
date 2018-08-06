/* global window, Uint8Array */

import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import Dropzone from 'react-dropzone';
import _ from 'lodash';
import classNames from 'classnames';

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

        this.setState({
            files: newFiles,
            status: (status ? status : this.state.status)
        }, () => {
            if (onFileChange) {
                onFileChange(newFiles);
            }
        });
    }

    onDrop(acceptedFiles, rejectedFiles) {

        const { t } = this.props;

        acceptedFiles.forEach(file => {

            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onloadend = (e) => {

                let data = new Uint8Array(e.target.result);
                let base64 = window.btoa(String.fromCharCode(...data));

                let newFiles = _.clone(this.state.files);
                newFiles.push({
                    'base64' : base64,
                    'data' : data,
                    'size' : file.size,
                    'name' : file.name
                });

                let status = t('ui:accepted') + ': ' + acceptedFiles.length + ', ' + t('ui:rejected') + ': ' + rejectedFiles.length
                this.updateFiles(newFiles, status);
            }
            reader.onerror = error => {console.log(error)};
        })
    }

    removeFile(fileIndex, e) {

        e.stopPropagation();
        e.preventDefault();

        const { t } = this.props;

        let newFiles = _.clone(this.state.files);
        newFiles.splice(fileIndex, 1);
        let filename = this.state.files[fileIndex].name;
        let status = t('ui:removed') + ' ' + filename;

        this.updateFiles(newFiles, status);
    }

    onLoadSuccess(index, event) {

        if (index !== undefined && event && event.numPages) {

            let newFiles = _.clone(this.state.files);
            newFiles[index].numPages = event.numPages;

            this.updateFiles(newFiles);
        }
    }

    renderFiles() {

        const { files } = this.props;

        if (_.isEmpty(files)) {
            return null;
        }

        return files.map((file, i) => {
            if (_.endsWith(file.name, '.pdf')) {
                return <MiniaturePDF
                    key={i}
                    pdf={file}
                    onLoadSuccess={this.onLoadSuccess.bind(this, i)}
                    onDeleteDocument={this.removeFile.bind(this, i)}
                />
            } else {
                return <MiniatureOther
                    key={i}
                    file={file}
                    onDeleteDocument={this.removeFile.bind(this, i)}
                />
            }
        });
    }

    render() {

        const { t, accept, className } = this.props;

        return <div className={classNames('div-dropzone', className)}>
            <Dropzone className='dropzone' activeClassName='dropzone-active' accept={accept} onDrop={this.onDrop.bind(this)}>
                <div className='dropzone-placeholder'>
                    <div className='dropzone-placeholder-message'>{t('ui:dropFilesHere')}</div>
                    <div className='dropzone-placeholder-status'>{this.state.status}</div>
                </div>
                <div className='dropzone-files scrollable'>{this.renderFiles()}</div>
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
    className    : PT.string
};

export default translate()(FileUpload);
