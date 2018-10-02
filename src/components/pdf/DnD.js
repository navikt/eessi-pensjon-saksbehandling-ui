import React, { Component } from 'react';
import PT from 'prop-types';
import { bindActionCreators }  from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { DragDropContext } from 'react-beautiful-dnd';

import * as pdfActions from '../../actions/pdf';

const mapStateToProps = (state) => {
    return {
        recipe : state.pdf.recipe
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, pdfActions), dispatch)};
};

class DnD extends Component {

    reorder(list, startIndex, endIndex) {

        let newList = Array.from(list);
        const [removed] = newList.splice(startIndex, 1);
        newList.splice(endIndex, 0, removed);
        return newList;
    }

    onDragEnd(result) {

        let { recipe, actions } = this.props;

        let newRecipe = _.clone(recipe);
        let modified = false;

        if (!result.destination) { // 'dragged to nowhere'
            return
        }

        // get target ID
        let lastIndexOf = result.destination.droppableId.lastIndexOf('-');
        let targetId = result.destination.droppableId.substring(lastIndexOf + 1);

        // get source ID
        lastIndexOf = result.source.droppableId.lastIndexOf('-');
        let sourceId = result.source.droppableId.substring(lastIndexOf + 1);

        // dragged from a PDF source...
        if (_.startsWith(result.source.droppableId, 'c-pdf-dndSource-droppable-')) {

            // ...to another PDF source? skip it
            if (_.startsWith(result.destination.droppableId, 'c-pdf-dndSource-droppable-')) {
                return
            }

            // ...to a PDF target? Add it
            let lastIndexOf = result.draggableId.lastIndexOf('-');
            let name = result.draggableId.substring(0, lastIndexOf);
            let pageNumber = parseInt(result.draggableId.substring(lastIndexOf + 1), 10)

            if (!newRecipe[targetId]) {
                newRecipe[targetId] = [];
            }

            newRecipe[targetId].splice(result.destination.index, 0, {
                name       : name,
                pageNumber : pageNumber
            });

            modified = true;
        }

        // dragged from a PDF target...
        if (_.startsWith(result.source.droppableId, 'c-pdf-dndTarget-droppable-')) {

            // ... to the same PDF target: reorder
            if (_.startsWith(result.destination.droppableId, 'c-pdf-dndTarget-droppable-')) {

                newRecipe[targetId] = this.reorder(newRecipe[targetId], result.source.index, result.destination.index);
                modified = true;
            }

            // ... to another PDF source: remove
            if (_.startsWith(result.destination.droppableId, 'c-pdf-dndSource-droppable-')) {

                newRecipe[sourceId].splice(result.source.index, 1);
                modified = true;
            }
        }

        if (modified) {
            actions.setRecipe(newRecipe);
        }
    }

    render () {

        return <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
            {this.props.children}
        </DragDropContext>
    }
}

DnD.propTypes = {
    recipe   : PT.object.isRequired,
    actions  : PT.object,
    children : PT.node.isRequired
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DnD);

