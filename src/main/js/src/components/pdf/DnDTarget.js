import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import PT from 'prop-types';
import _ from 'lodash';

import PDFPageInDnD from './PDFPageInDnD';

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'honeydew' : 'whitesmoke',
    padding: 10,
    overflowY: 'auto',
    minHeight : '55vh',
    maxHeight : '55vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'inset 5px 5px 5px lightgrey'
});

const getItemStyle = (isDragging, draggableStyle) => ({
    marginBottom: '5px',
    backgroundColor: isDragging ? 'lightgreen' : 'white',
    ...draggableStyle
})

const mapStateToProps = (state) => {
    return {
        recipe : state.pdf.recipe,
        pdfs   : state.pdf.pdfs
    };
};

class DnDTarget extends Component {

    render () {

        const { pdfs, recipe, targetId } = this.props;

        return <Droppable droppableId={'dndtarget-' + targetId}>

            {(provided, snapshot) => (

                <div className='recipePDFarea text-center' ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}>

                    {recipe[targetId] ? recipe[targetId].map((recipeStep, index) => {

                        let pdf = _.find(pdfs, {name: recipeStep.name});

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
                    }) : null}
                </div>
            )}
        </Droppable>
    }
}

DnDTarget.propTypes = {
    recipe: PT.array.isRequired,
    pdfs: PT.array.isRequired,
    targetId: PT.string.isRequired
}

export default connect(
    mapStateToProps,
    {}
)(DnDTarget);
