/* global window, Uint8Array */

import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import Dropzone from 'react-dropzone';
import _ from 'lodash';

import MiniaturePDF from '../File/MiniaturePDF';
import MiniatureOther from '../File/MiniatureOther';
import './FileUpload.css';

class FileUpload extends Component {

    state = {};

    componentDidMount() {
        this.setState({
            files: this.props.files || []
        });
    }

    updateFiles(newFiles) {

        const { onFileChange } = this.props;

        this.setState({
            files: newFiles
        }, () => {
            if (onFileChange) {
                onFileChange(newFiles);
            }
        });
    }

    onDrop(acceptedFiles) {

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
                this.updateFiles(newFiles);
            }
            reader.onerror = error => {console.log(error)};
        })
    }

    removeFile(fileIndex) {

        let newFiles = _.clone(this.state.files);
        newFiles.splice(fileIndex, 1);
        this.updateFiles(newFiles);
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

        let html = files.map((file, i) => {
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
        return <div className='scrollable'>{html}</div>
    }

    render() {

        const { t } = this.props;

        return <div className='dropzone'>
            <div className='d-inline-block'>
                <Dropzone onDrop={this.onDrop.bind(this)}>
                    <div className='dropzone-placeholder'>{t('ui:dropFilesHere')}</div>
                </Dropzone>
            </div>
            <div className='d-inline-block align-top'>
                <ul>{this.renderFiles()}</ul>
            </div>
        </div>
    }
}

FileUpload.propTypes = {
    t            : PT.func.isRequired,
    onFileChange : PT.func.isRequired,
    initialFiles : PT.object,
    files        : PT.array.isRequired
};

export default translate()(FileUpload);
