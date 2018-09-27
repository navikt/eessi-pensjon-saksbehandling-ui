import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import PT from 'prop-types';

import File from '../../ui/File/File';
import './DnDExternalFiles.css';

const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'aliceblue' : 'white',
    padding: 5,
    display: 'flex',
    overflowX: 'auto',
    whiteSpace: 'nowrap'
});

const getItemStyle = (isDragging, draggableStyle) => ({
    ...draggableStyle
})

class DnDExternalFiles extends Component {

    addDocument(pdf) {

        const { addDocument } = this.props;

        if (typeof addDocument === 'function') {
            addDocument(pdf);
        }
    }

    render () {

        const { extPdfs } = this.props;

        if (!extPdfs) {
            return null;
        }

        return <Droppable isDropDisabled={true} droppableId={'dndfiles'} direction='horizontal'>
            {(provided, snapshot) => (
                <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                    {extPdfs.map((pdf, index) => {
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

export default DnDExternalFiles;
