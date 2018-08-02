import React, { Component } from 'react';
import PT from 'prop-types';

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

        const { file, onDeleteDocument } = this.props;

        let data = 'data:application/octet-stream;base64,' + encodeURIComponent(file.base64);
        let deleteLink = this.state.isHovering ? <Ikon size={20} kind='trashcan' onClick={onDeleteDocument}/> : null;
        let downloadLink = this.state.isHovering ? <a title='download' href={data} download={file.name}>
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
                <div className='numPages'>Size: {file.size} bytes</div>
            </div>
    }
}

MiniatureOther.propTypes = {
    file: PT.object.isRequired,
    onDeleteDocument: PT.func.isRequired,
}

export default MiniatureOther;
