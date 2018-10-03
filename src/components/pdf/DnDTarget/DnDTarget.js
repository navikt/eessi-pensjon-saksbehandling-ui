import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import PT from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';

import PDFPageInDnD from '../PDFPageInDnD/PDFPageInDnD';
import './DnDTarget.css';

const mapStateToProps = (state) => {
    return {
        recipe : state.pdf.recipe,
        pdfs   : state.pdf.pdfs
    };
};

class DnDTarget extends Component {

    render () {

        const { pdfs, recipe, targetId } = this.props;

        return <div className='c-pdf-dndTarget'>

            <Droppable droppableId={'c-pdf-dndTarget-droppable-' + targetId}>

                {(provided, snapshot) => (

                    <div ref={provided.innerRef}
                        className={classNames('c-pdf-dndTarget-droppable', 'text-center', {'c-pdf-dndTarget-droppable-active ' : snapshot.isDraggingOver})}>

                        {recipe[targetId] ? recipe[targetId].map((recipeStep, index) => {

                            let pdf = _.find(pdfs, {name: recipeStep.name});

                            return <Draggable key={index} draggableId={index} index={index}>

                                {(provided, snapshot) => (

                                    <div className={classNames('c-pdf-dndTarget-draggable', { dragging : snapshot.isDragging })}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}>
                                        <PDFPageInDnD
                                            className={classNames({'c-pdf-dndTarget-draggable-active' : snapshot.isDragging})}
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
    recipe   : PT.object.isRequired,
    pdfs     : PT.array.isRequired,
    targetId : PT.string.isRequired
}

export default connect(
    mapStateToProps,
    {}
)(DnDTarget);
