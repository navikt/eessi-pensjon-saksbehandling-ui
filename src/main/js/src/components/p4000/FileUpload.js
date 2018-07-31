import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import classNames from 'classnames';
import { translate } from 'react-i18next';
import Dropzone from 'react-dropzone';
import _ from 'lodash';

import * as p4000Actions from '../../actions/p4000';
import './custom-file-upload.css';

class FileUpload extends Component {

    onDrop(acceptedFiles) {

        const { onFileChange, files } = this.props;

        acceptedFiles.forEach(file => {

            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onloadend = (e) => {
                let data = new Uint8Array(e.target.result);
                let base64 = window.btoa(String.fromCharCode(...data));

                let newFiles = _.isEmpty(files) ? {} : files.slice();
                newFiles[file.name] = {
                    'base64' : base64,
                    'size' : file.size,
                    'name' : file.name
                };

                onFileChange(newFiles)
            }
            reader.onerror = error => {console.log(error)};
        })
    }

    removeFile(file, e) {

        const { onFileChange, files } = this.props;

        e.preventDefault();
        let newFiles = _.isEmpty(files) ? {} : files.slice();
        delete newFiles[file.name];
        onFileChange(newFiles);
    }

    renderFiles() {

        const { t, files } = this.props;
        let res = [];

        if (!_.isEmpty(files)) {

            _.forOwn(files, f => {

                let data = 'data:application/octet-stream;base64,' + encodeURIComponent(f.base64);

                res.push(<li className='fileUploadItem' key={f.name}>{f.name} - {f.size} {t('ui:bytes')} (
                <a onClick={this.removeFile.bind(this, f)} href='#'>{t('ui:remove')}</a>) (
                <a href={data} download={f.name}>{t('ui:download')}</a>)</li>);
            });
        }
        return res;
    }

    render() {

        const { t } = this.props;

        return <div className='dropzone'>
            <div className='d-inline-block'>
                <Dropzone onDrop={this.onDrop.bind(this)}>
                    <div style={{marginTop:'70px', textAlign: 'center'}}>{t('ui:dropFilesHere')}</div>
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
    initialFiles : PT.object
};

export default translate()(FileUpload);
