import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import { Ikon } from '../Nav';
import Icons from '../Icons';

import './MiniatureOther.css';

class MiniatureOther extends Component {

    state = {
        isHovering : false
    }

    onHandleMouseEnter() {
        this.setState({isHovering : true});
    }

    onHandleMouseLeave() {
        this.setState({isHovering : false});
    }

    render () {

        const { t, file, onDeleteDocument } = this.props;

        let data = 'data:application/octet-stream;base64,' + encodeURIComponent(file.base64);
        let deleteLink = this.state.isHovering ? <Ikon size={20} kind='trashcan' onClick={onDeleteDocument}/> : null;
        let downloadLink = this.state.isHovering ? <a onClick={(e) => e.stopPropagation()} title={t('ui:download')} href={data} download={file.name}>
            <Icons size={20} kind='download'/>
        </a> : null;

        let extension = file.name.substring(file.name.lastIndexOf('.') + 1);

        return <div className='miniatureOther position-relative'
            onMouseEnter={this.onHandleMouseEnter.bind(this)}
            onMouseLeave={this.onHandleMouseLeave.bind(this)}>
            <div className='deleteLink'> {deleteLink}</div>
            <div className='downloadLink'> {downloadLink}</div>
            <div className='document'>
                <div className='content'>{extension}</div>
            </div>
            <div className='fileName'> {file.name}</div>
            <div className='numPages'>{t('ui:size')}: {file.size} {t('ui:bytes')}</div>
        </div>
    }
}

MiniatureOther.propTypes = {
    t                : PT.func.isRequired,
    file: PT.object.isRequired,
    onDeleteDocument: PT.func.isRequired,
}

export default translate()(MiniatureOther);
