import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import PT from 'prop-types';
import { bindActionCreators }  from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import File from '../../ui/File/File';
import * as storageActions from '../../../actions/storage';
import * as storages from '../../../constants/storages';

import './DnDExternalFiles.css';

const mapStateToProps = (state) => {
    return {
        username   : state.app.username,
        fileList   : state.storage.fileList,
        file       : state.storage.file
    }
}

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, storageActions), dispatch)};
};

class DnDExternalFiles extends Component {

    addFile(file) {

        const { addFile } = this.props;

        if (typeof addFile === 'function') {
            addFile(file);
        }
    }

    onSelectFile (file) {

        const { actions, username } = this.props;

        actions.getStorageFile(username, storages.FILES, file);
    }

    render () {

        const { fileList, file } = this.props;

        return <div className='c-pdf-dndExternalFiles'>
            {fileList ? <div className='fileList'>
                {fileList.map((_file, index) => {
                    let selected = file && file.name === _file;
                    return <div className={classNames('fileRow', {selected : selected})} key={index}>
                        <a className={classNames('fileName')} href='#select'
                        onClick={this.onSelectFile.bind(this, _file)}>{_file}</a>
                    </div>
                })}
            </div> : null}
            {file ? <Droppable isDropDisabled={true} droppableId={'c-pdf-dndExternalFiles-droppable'} direction='horizontal'>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef}>
                        <Draggable className='draggable' draggableId={'storageFile'} index={0}>
                            {(provided, snapshot) => (
                                <React.Fragment>
                                    <div ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={classNames({'dragging' : snapshot.isDragging})}>
                                        <File file={file} addLink={true} scale={1.0} animate={true}
                                            onAddFile={this.addFile.bind(this, file)}/>
                                    </div>
                                    {snapshot.isDragging && (
                                        <div className='cloneStyle'>
                                            <File animate={false} file={file} scale={1.0}/>
                                        </div>
                                    )}
                                </React.Fragment>
                            )}
                        </Draggable>
                    </div>
                )}
            </Droppable> : null}
        </div>
    }
}

DnDExternalFiles.propTypes = {
    fileList   : PT.array.isRequired,
    file       : PT.object
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DnDExternalFiles);
