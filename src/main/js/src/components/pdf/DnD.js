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
        
        let newRecipe = recipe.slice();
        let modified = false;

        if (!result.destination) { // 'dragged outside'
            return
        }

        if (_.startsWith(result.destination.droppableId, 'dndsource')) { // dragged into source
            return
        }

        if (_.startsWith(result.source.droppableId, 'dndsource')) {// dragged from source

            let lastIndexOf = result.draggableId.lastIndexOf('-');
            let fileName = result.draggableId.substring(0, lastIndexOf);
            let pageNumber = parseInt(result.draggableId.substring(lastIndexOf + 1), 10)

            newRecipe.splice(result.destination.index, 0, {
                fileName: fileName,
                pageNumber: pageNumber
            });

            modified = true;
        }

        // dragged to and from the target
        if (_.startsWith(result.source.droppableId, 'dndtarget') &&
          _.startsWith(result.destination.droppableId, 'dndtarget')) {

            newRecipe = this.reorder(newRecipe, result.source.index, result.destination.index);
            modified = true;
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
    recipe: PT.array.isRequired,
    actions: PT.object,
    children: PT.node.isRequired
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DnD);

