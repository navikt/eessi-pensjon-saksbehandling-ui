import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import PT from 'prop-types';
import _ from 'lodash';
import { bindActionCreators }  from 'redux';
import { connect } from 'react-redux';

import File from '../../ui/File/File';
import './DnDExternalFiles.css';
import * as pdfActions from '../../../actions/pdf';

const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'aliceblue' : 'transparent',
    padding: 5,
    display: 'flex',
    overflowX: 'auto',
    whiteSpace: 'nowrap'
});

const getItemStyle = (isDragging, draggableStyle) => ({
    ...draggableStyle
})

const mapStateToProps = () => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, pdfActions), dispatch)};
};

class DnDExternalFiles extends Component {

    state = {
        files: []
    };

    static getDerivedStateFromProps(newProps) {

        return {
            files : newProps.extPdfs
        }
    }

    addDocument(pdf) {

        const { addDocument } = this.props;

        if (typeof addDocument === 'function') {
            addDocument(pdf);
        }
    }

    onLoadSuccess(index, event) {

        const { actions } = this.props;

        if (index !== undefined && event && event.numPages) {

            let newFiles = _.clone(this.state.files);
            newFiles[index].numPages = event.numPages;

            actions.setExternalFileList(newFiles);
        }
    }

    render () {

        const { files } = this.state;

        if (!files) {
            return null;
        }

        return <Droppable isDropDisabled={true} droppableId={'dnd-external-files'} direction='horizontal'>
            {(provided, snapshot) => (
                <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                    {files.map((pdf, index) => {
                        return <Draggable key={index} draggableId={index} index={index}>
                            {(provided, snapshot) => (
                                <React.Fragment>
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                        )}>
                                        <File key={index} file={pdf} addLink={true}
                                            onAddDocument={this.addDocument.bind(this, pdf)}
                                            onLoadSuccess={this.onLoadSuccess.bind(this, index)}
                                            currentPage={1}/>
                                    </div>
                                    {snapshot.isDragging && (
                                        <div className='cloneStyle'>
                                            <File animate={false} key={index} file={pdf} currentPage={1}/>
                                        </div>
                                    )}
                                </React.Fragment>
                            )}
                        </Draggable>
                    })}
                </div>
            )}
        </Droppable>
    }
}

DnDExternalFiles.propTypes = {
    extPdfs : PT.array.isRequired
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DnDExternalFiles);
