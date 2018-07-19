import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import PT from 'prop-types';
import _ from 'lodash';

import PDFPageInDnD from './PDFPageInDnD';

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: 5,
    overflowY: 'auto',
    whiteSpace: 'nowrap'
});

const getItemStyle = (isDragging, draggableStyle) => ({
    border: isDragging ? '2px color red' : 'none',
    padding: 5,
    margin: '0 0 5px 0',
    ...draggableStyle
})

const mapStateToProps = (state) => {
    return {
        recipe : state.pdf.recipe,
        pdfs:    state.pdf.pdfs
    };
};

class DnDTarget extends Component {

    render () {

        const { pdfs, recipe } = this.props;

        return <Droppable droppableId='dndtarget'>

            {(provided, snapshot) => (

                <div className='recipePDFarea text-center' ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}>

                    {recipe.map((recipeStep, index) => {

                        let pdf = _.find(pdfs, {fileName: recipeStep.fileName});

                        return <Draggable key={index} draggableId={index} index={index}>

                            {(provided, snapshot) => (

                                <div ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
                                    )}>
                                    <PDFPageInDnD
                                        pdf={pdf}
                                        pageNumber={recipeStep.pageNumber}
                                        action='remove'
                                    />
                                </div>
                            )}
                        </Draggable>
                    })}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    }
}

DnDTarget.propTypes = {
    recipe: PT.array.isRequired,
    pdfs: PT.array.isRequired
}

export default connect(
    mapStateToProps,
    {}
)(DnDTarget);
