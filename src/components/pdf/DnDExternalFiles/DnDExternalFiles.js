import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import PT from 'prop-types';
import { bindActionCreators }  from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import File from '../../ui/File/File';
import * as storageActions from '../../../actions/storage';

import './DnDExternalFiles.css';

const mapStateToProps = (state) => {
    return {
        fileList   : state.storage.fileList,
        fileLoaded : state.storage.fileLoaded
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

    render () {

        const { fileList, fileLoaded } = this.props;

        return <div className='c-pdf-dndExternalFiles'>
            {fileList ? fileList.map((file, index) => {
                return <span key={index}>{file}</span>
            }) : null}
            {fileLoaded ? <Droppable isDropDisabled={true} droppableId={'c-pdf-dndExternalFiles-droppable'} direction='horizontal'>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef}>
                        <Draggable className='draggable' draggableId={'dndExternalFile'} index={0}>
                            {(provided, snapshot) => (
                                <React.Fragment>
                                    <div ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={classNames({'dragging' : snapshot.isDragging})}>
                                        <File file={fileLoaded} addLink={true} scale={1.0}
                                            onAddFile={this.addFile.bind(this, fileLoaded)}/>
                                    </div>
                                    {snapshot.isDragging && (
                                        <div className='cloneStyle'>
                                            <File animate={false} file={fileLoaded} scale={1.0}/>
                                        </div>
                                    )}
                                </React.Fragment>
                            )}
                        </Draggable>
                    }
                    </div>
                )}
            </Droppable> : null}
        </div>
    }
}

DnDExternalFiles.propTypes = {
    fileList   : PT.array.isRequired,
    fileLoaded : PT.object
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DnDExternalFiles);
