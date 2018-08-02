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
    minHeight : '60vh',
    maxHeight : '60vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'inset 5px 5px 5px lightgrey'
});

const getItemStyle = (isDragging, draggableStyle) => ({
    border: isDragging ? '2px color red' : '1px solid lightgrey',
    padding: 5,
    boxShadow: '5px 5px 5px lightgrey',
    margin: '0 0 5px 0',
    backgroundColor: isDragging ? 'lightgreen' : 'white',
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

        const { pdfs, recipe, targetId } = this.props;

        return <div>
            {/*<div>Pages: {recipe.length}</div>*/}
            <Droppable droppableId={'dndtarget-' + targetId}>

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
        </div>
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
