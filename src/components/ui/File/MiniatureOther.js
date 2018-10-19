import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import classNames from 'classnames';

import { Ikon } from '../Nav';
import Icons from '../Icons';

import './File.css';
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

        const { t, file, size, onDeleteDocument, className, animate } = this.props;

        let data = 'data:application/octet-stream;base64,' + encodeURIComponent(file.content.base64);
        let deleteLink   = this.state.isHovering ? <Ikon size={15} kind='trashcan' onClick={onDeleteDocument}/> : null;
        let downloadLink = this.state.isHovering ? <a onClick={(e) => e.stopPropagation()} title={t('ui:download')} href={data} download={file.name}>
            <Icons size={'sm'} kind='download'/>
        </a> : null;

        let extension = file.name.substring(file.name.lastIndexOf('.') + 1);

        return <div className={classNames('c-ui-file', 'c-ui-miniatureOther', className, {'animate' : animate})}
            onMouseEnter={this.onHandleMouseEnter.bind(this)}
            onMouseLeave={this.onHandleMouseLeave.bind(this)}>
            <div className='link deleteLink'> {deleteLink}</div>
            <div className='link downloadLink'> {downloadLink}</div>
            <div className='miniatureDocument'>
                <div className='content'>{extension}</div>
            </div>
            <div className='fileName'> {file.name}</div>
            <div className='numPages'>{t('ui:size')}{': '}{size}</div>
        </div>
    }
}

MiniatureOther.propTypes = {
    t                : PT.func.isRequired,
    file             : PT.object.isRequired,
    size             : PT.string,
    animate          : PT.bool,
    onDeleteDocument : PT.func,
    className        : PT.string
}

export default translate()(MiniatureOther);
