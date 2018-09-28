import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import PT from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';

import PDFPageInDnD from '../PDFPageInDnD';
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

        return <Droppable droppableId={'dndtarget-' + targetId}>

            {(provided, snapshot) => (

                <div ref={provided.innerRef}
                className={classNames('div-dndtarget-droppable', 'text-center', {'div-dndtarget-droppable-active ' : snapshot.isDraggingOver})}>

                    {recipe[targetId] ? recipe[targetId].map((recipeStep, index) => {

                        let pdf = _.find(pdfs, {name: recipeStep.name});

                        return <Draggable key={index} draggableId={index} index={index}>

                            {(provided, snapshot) => (

                                <div className={classNames('div-dndtarget-draggable')}
                                     ref={provided.innerRef}
                                     {...provided.draggableProps}
                                     {...provided.dragHandleProps}>
                                    <PDFPageInDnD
                                        className={classNames({'div-dndtarget-draggable-active' : snapshot.isDragging})}
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
    recipe   : PT.object.isRequired,
    pdfs     : PT.array.isRequired,
    targetId : PT.string.isRequired
}

export default connect(
    mapStateToProps,
    {}
)(DnDTarget);
