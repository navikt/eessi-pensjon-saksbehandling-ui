import React, { Component } from 'react';
import PT from 'prop-types';
import { bindActionCreators }  from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import classNames from 'classnames';

import * as Nav from '../../ui/Nav';
import DnDExternalFiles from '../DnDExternalFiles/DnDExternalFiles';
import * as storageActions from '../../../actions/storage';
import * as storages from '../../../constants/storages';

import './ExternalFiles.css';

const mapStateToProps = (state) => {
    return {
        username        : state.app.username,
        loadingFileList : state.loading.loadingStorageFileList,
        fileList        : state.storage.fileList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, storageActions), dispatch)};
};

class ExternalFiles extends Component {

    requestExternalFileList() {

        const { actions, username } = this.props;

        actions.listStorageFiles(username, storages.FILES);
    }

    render () {

        const { t, loadingFileList, fileList, addFile, style, className } = this.props;

        return <Nav.Ekspanderbartpanel style={style} className={classNames('c-pdf-externalFiles', className)}
            apen={false} tittel={t('ui:fileSelect')} tittelProps='undertittel'
            onClick={this.requestExternalFileList.bind(this)}>
            <div className='fileArea'>
                {loadingFileList ? <div className='w-100 text-center'>
                    <Nav.NavFrontendSpinner/>
                    <p>{t('pdf:loading-loadingFileList')}</p>
                </div> : <DnDExternalFiles fileList={fileList || []} addFile={addFile}/>}
            </div>
        </Nav.Ekspanderbartpanel>
    }
}

ExternalFiles.propTypes = {
    t               : PT.func.isRequired,
    username        : PT.string.isRequired,
    loadingFileList : PT.bool,
    fileList        : PT.array,
    actions         : PT.object,
    addFile         : PT.func,
    style           : PT.object,
    className       : PT.string
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(ExternalFiles)
);
